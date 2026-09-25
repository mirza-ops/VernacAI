from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.gemini import generate_lesson


router = APIRouter(
    prefix="/generate-lesson",
    tags=["Lesson Generation"],
)


class LessonRequest(BaseModel):
    topic: str
    subject: str
    class_level: str
    source_language: str = "English"
    target_language: str = "Telugu"


@router.post("")
def create_lesson(request: LessonRequest):

    try:
        lesson = generate_lesson(
            topic=request.topic,
            subject=request.subject,
            class_level=request.class_level,
            source_language=request.source_language,
            target_language=request.target_language,
        )

        return {
            "status": "success",
            "message": "Lesson generated successfully by Gemini.",
            "data": {
                "topic": request.topic,
                "subject": request.subject,
                "class_level": request.class_level,
                "source_language": request.source_language,
                "target_language": request.target_language,
                "lesson": lesson,
            },
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini lesson generation failed: {str(error)}",
        )