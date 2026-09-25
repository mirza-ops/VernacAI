import io
import os

from dotenv import load_dotenv
from sarvamai import SarvamAI


load_dotenv()


SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

if not SARVAM_API_KEY:
    raise RuntimeError(
        "SARVAM_API_KEY is not configured. "
        "Add it to backend/.env"
    )


client = SarvamAI(
    api_subscription_key=SARVAM_API_KEY
)


# --------------------------------------------------
# TEXT TRANSLATION
# --------------------------------------------------

def translate_text(
    text: str,
    source_language: str = "en-IN",
    target_language: str = "te-IN",
) -> str:

    response = client.text.translate(
        input=text,
        source_language_code=source_language,
        target_language_code=target_language,
    )

    return response.translated_text


# --------------------------------------------------
# TEXT TO SPEECH
# --------------------------------------------------

def text_to_speech(
    text: str,
    target_language: str = "te-IN",
):

    response = client.text_to_speech.convert(
        text=text,
        language_code=target_language,
        model="bulbul:v3",
        speaker="shubh",
    )

    return response


# --------------------------------------------------
# SPEECH TO TEXT
# --------------------------------------------------

def speech_to_text(
    audio_file,
    language: str = "te-IN",
):

    if isinstance(audio_file, bytes):
        audio_file = io.BytesIO(audio_file)

    response = client.speech_to_text.transcribe(
        file=audio_file,
        model="saaras:v4",
        language_code=language,
        mode="transcribe",
    )

    return response