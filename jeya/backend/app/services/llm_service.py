from typing import AsyncGenerator, List
import anthropic
from app.core.config import settings

SYSTEM_PROMPT = """Siz JEYA — Windows 11 va web uchun yaratilgan aqlli AI operator va shaxsiy yordamchisiz.
Foydalanuvchi bilan doimo o'zbek tilida muloqot qiling.
Siz faqat matn yordamchisi emassiz — siz raqamli miya, shaxsiy operator va intellektual tizim sifatida ishlaysiz.
Javoblaringiz aniq, qisqa va amaliy bo'lsin. Foydalanuvchining har bir so'rovini to'liq vazifa sifatida qabul qiling."""


async def generate_response_stream(messages: List[dict]) -> AsyncGenerator[str, None]:
    client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    async with client.messages.stream(
        model="claude-opus-4-5",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=messages,
    ) as stream:
        async for text in stream.text_stream:
            yield text


async def generate_response(messages: List[dict]) -> str:
    client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    response = await client.messages.create(
        model="claude-opus-4-5",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=messages,
    )
    return response.content[0].text


async def generate_document(title: str, doc_type: str, prompt: str) -> str:
    type_names = {"letter": "xat", "report": "hisobot", "resume": "rezyume",
                  "application": "ariza", "contract": "shartnoma", "other": "hujjat"}
    type_name = type_names.get(doc_type, "hujjat")
    client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    response = await client.messages.create(
        model="claude-opus-4-5",
        max_tokens=4096,
        system=f"Siz professional hujjat yozuvchisisiz. Rasmiy va sifatli {type_name} yarating. O'zbek tilida, to'g'ri formatda.",
        messages=[{"role": "user", "content": f"Sarlavha: {title}\nTur: {type_name}\nKo'rsatma: {prompt}\n\nTo'liq {type_name} yarating."}],
    )
    return response.content[0].text


async def analyze_file_content(filename: str, content: str) -> str:
    client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    response = await client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1024,
        system="Siz hujjat tahlilchisisiz. Matnni o'qib, asosiy fikrlarni o'zbek tilida qisqa bayon qiling.",
        messages=[{"role": "user", "content": f"Fayl: {filename}\n\nMazmuni:\n{content[:8000]}"}],
    )
    return response.content[0].text
