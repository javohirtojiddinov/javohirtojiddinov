from typing import AsyncGenerator, List
import anthropic
from app.core.config import settings

SYSTEM_PROMPT = """Siz JEYA — o'zbek tilida muloqot qiladigan sun'iy intellekt yordamchisiz.
Foydalanuvchi bilan doimo o'zbek tilida muloqot qiling, muloyim va foydali bo'ling.
Javoblaringiz aniq, qisqa va tushunarli bo'lsin.
Agar foydalanuvchi boshqa tilda murojaat qilsa ham, o'zbek tilida javob bering."""


async def generate_response_stream(messages: List[dict]) -> AsyncGenerator[str, None]:
    """Stream response from Claude."""
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
    """Single response from Claude."""
    client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    response = await client.messages.create(
        model="claude-opus-4-5",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=messages,
    )
    return response.content[0].text


async def generate_document(title: str, doc_type: str, prompt: str) -> str:
    """Generate document content using AI."""
    doc_type_names = {
        "letter": "xat",
        "report": "hisobot",
        "resume": "rezyume",
        "application": "ariza",
        "contract": "shartnoma",
        "other": "hujjat",
    }
    type_name = doc_type_names.get(doc_type, "hujjat")

    system = f"""Siz professional hujjat yozuvchisisiz. 
Foydalanuvchi so'rovi asosida rasmiy va sifatli {type_name} yarating.
Hujjat o'zbek tilida bo'lsin, to'g'ri formatda va professional uslubda yozilsin."""

    user_message = f"""Sarlavha: {title}
Hujjat turi: {type_name}
Ko'rsatma: {prompt}

Iltimos, yuqoridagi ma'lumotlar asosida to'liq va professional {type_name} yarating."""

    client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    response = await client.messages.create(
        model="claude-opus-4-5",
        max_tokens=4096,
        system=system,
        messages=[{"role": "user", "content": user_message}],
    )
    return response.content[0].text


async def analyze_file_content(filename: str, content: str) -> str:
    """Analyze file content and return summary."""
    client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    response = await client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1024,
        system="Siz hujjat tahlilchisisiz. Matnni o'qib, asosiy fikrlarni va xulosani o'zbek tilida qisqa bayon qiling.",
        messages=[{
            "role": "user",
            "content": f"Quyidagi faylni tahlil qiling: {filename}\n\nMazmuni:\n{content[:8000]}"
        }],
    )
    return response.content[0].text
