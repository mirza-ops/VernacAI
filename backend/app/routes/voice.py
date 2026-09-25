from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from app.services.sarvam import speech_to_text, text_to_speech


router = APIRouter(
    prefix="/voice",
    tags=["Voice"],
)


# --------------------------------------------------
# TEXT TO SPEECH
# --------------------------------------------------

class TextToSpeechRequest(BaseModel):
    text: str
    language: str = "te-IN"


@router.post("/text-to-speech")
def generate_speech(request: TextToSpeechRequest):

    try:

        if not request.text.strip():
            raise HTTPException(
                status_code=400,
                detail="Text cannot be empty.",
            )

        response = text_to_speech(
            text=request.text,
            target_language=request.language,
        )

        audios = response.audios

        if not audios:
            raise HTTPException(
                status_code=500,
                detail="Sarvam did not return any audio.",
            )

        return {
            "status": "success",
            "message": "Speech generated successfully.",
            "data": {
                "language": request.language,
                "audio_base64": audios[0],
                "format": "wav",
            },
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Text-to-speech failed: {str(error)}",
        )


# --------------------------------------------------
# SPEECH TO TEXT
# --------------------------------------------------

@router.post("/speech-to-text")
async def convert_speech_to_text(
    file: UploadFile = File(...),
    language: str = Form("te-IN"),
):

    try:

        if not file:
            raise HTTPException(
                status_code=400,
                detail="Audio file is required.",
            )

        audio_bytes = await file.read()

        if not audio_bytes:
            raise HTTPException(
                status_code=400,
                detail="Audio file is empty.",
            )

        response = speech_to_text(
            audio_file=audio_bytes,
            language=language,
        )

        transcript = response.transcript

        return {
            "status": "success",
            "message": "Speech converted to text successfully.",
            "data": {
                "language": language,
                "text": transcript,
            },
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Speech-to-text failed: {str(error)}",
        )