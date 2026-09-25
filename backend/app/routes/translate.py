from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.sarvam import translate_text


router = APIRouter(
    prefix="/translate",
    tags=["Translation"],
)


class TranslationRequest(BaseModel):
    text: str
    source_language: str = "en-IN"
    target_language: str = "te-IN"


@router.post("")
def translate(request: TranslationRequest):

    try:
        translated_text = translate_text(
            text=request.text,
            source_language=request.source_language,
            target_language=request.target_language,
        )

        return {
            "status": "success",
            "message": "Text translated successfully.",
            "data": {
                "original_text": request.text,
                "source_language": request.source_language,
                "target_language": request.target_language,
                "translated_text": translated_text,
            },
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Translation failed: {str(error)}",
        )