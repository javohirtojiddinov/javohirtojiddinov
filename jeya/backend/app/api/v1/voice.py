import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.responses import Response
from app.core.config import settings
from app.models.user import User
from app.dependencies.auth import get_current_user

router = APIRouter()


@router.post("/stt")
async def speech_to_text(audio: UploadFile, current_user: User = Depends(get_current_user)):
    audio_content = await audio.read()
    if not settings.OPENAI_API_KEY:
        raise HTTPException(status_code=503, detail="STT xizmati sozlanmagan. OPENAI_API_KEY kerak.")
    try:
        import openai
        client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        audio_file = io.BytesIO(audio_content)
        audio_file.name = audio.filename or "recording.webm"
        transcription = await client.audio.transcriptions.create(model="whisper-1", file=audio_file, language="uz")
        return {"text": transcription.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"STT xatosi: {e}")


@router.post("/tts")
async def text_to_speech(request: dict, current_user: User = Depends(get_current_user)):
    text = request.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="Matn kiritilmagan")
    if not settings.OPENAI_API_KEY:
        raise HTTPException(status_code=503, detail="TTS xizmati sozlanmagan. OPENAI_API_KEY kerak.")
    try:
        import openai
        client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        response = await client.audio.speech.create(model="tts-1", voice="alloy", input=text)
        return Response(content=response.content, media_type="audio/mpeg",
                        headers={"Content-Disposition": "attachment; filename=speech.mp3"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS xatosi: {e}")
