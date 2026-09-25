from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.gemini import ask_tutor
from app.services.pedagogy import get_pedagogy_profile

router = APIRouter(
    prefix="/ask",
    tags=["AI Tutor"],
)


class TutorRequest(BaseModel):
    question: str
    class_level: str = "Class 5"
    subject: str = "Science"
    language: str = "Telugu"
    learning_mode: str = "Explain"
    lesson_context: str | None = None
    lesson_topic: str | None = None


@router.post("")
def ask_ai_tutor(request: TutorRequest):
    try:
        if not request.question.strip():
            raise HTTPException(
                status_code=400,
                detail="Question cannot be empty.",
            )

        allowed_modes = {
            "Explain",
            "Example",
            "Quiz Me",
            "Simplify",
            "Translate",
        }

        learning_mode = request.learning_mode

        if learning_mode not in allowed_modes:
            learning_mode = "Explain"

        pedagogy = get_pedagogy_profile(
            class_level=request.class_level,
            subject=request.subject,
            language=request.language,
        )

        answer = ask_tutor(
            question=request.question,
            class_level=request.class_level,
            subject=request.subject,
            language=request.language,
            pedagogy_instruction=pedagogy["instruction"],
            learning_mode=learning_mode,
            lesson_context=request.lesson_context,
            lesson_topic=request.lesson_topic,
        )

        return {
            "status": "success",
            "message": "AI Tutor generated an adapted answer.",
            "data": {
                "question": request.question,
                "class_level": request.class_level,
                "subject": request.subject,
                "language": request.language,
                "learning_mode": learning_mode,
                "lesson_topic": request.lesson_topic,
                "answer": answer,
                "pedagogy": {
                    "level": pedagogy["level"],
                    "instruction": pedagogy["instruction"],
                },
            },
        }

    except HTTPException:
        raise

    except Exception as error:
        error_message = str(error)
        lower_message = error_message.lower()

        # Gemini / Google API rate-limit handling
        if (
            "429" in lower_message
            or "rate limit" in lower_message
            or "quota" in lower_message
            or "resource exhausted" in lower_message
        ):
            raise HTTPException(
                status_code=429,
                detail=(
                    "AI Tutor is temporarily unavailable because "
                    "the AI service rate limit has been reached. "
                    "Please try again later."
                ),
            )

        raise HTTPException(
            status_code=500,
            detail=f"AI Tutor failed: {error_message}",
        )