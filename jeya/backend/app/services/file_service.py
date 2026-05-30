import io
import boto3
from botocore.client import Config
from app.core.config import settings


def get_s3_client():
    return boto3.client(
        "s3",
        endpoint_url=settings.S3_ENDPOINT,
        aws_access_key_id=settings.S3_ACCESS_KEY,
        aws_secret_access_key=settings.S3_SECRET_KEY,
        config=Config(signature_version="s3v4"),
    )


def upload_file_to_storage(file_content: bytes, filename: str, content_type: str) -> str:
    try:
        client = get_s3_client()
        try:
            client.head_bucket(Bucket=settings.S3_BUCKET)
        except Exception:
            client.create_bucket(Bucket=settings.S3_BUCKET)
        storage_path = f"uploads/{filename}"
        client.put_object(Bucket=settings.S3_BUCKET, Key=storage_path,
                          Body=file_content, ContentType=content_type)
        return storage_path
    except Exception:
        local_path = f"/tmp/{filename}"
        with open(local_path, "wb") as f:
            f.write(file_content)
        return local_path


def extract_text(content: bytes, filename: str, content_type: str) -> str:
    fname = filename.lower()
    if "pdf" in content_type or fname.endswith(".pdf"):
        try:
            from pdfminer.high_level import extract_text as pdf_extract
            return pdf_extract(io.BytesIO(content))
        except Exception as e:
            return f"[PDF xato: {e}]"
    elif "wordprocessingml" in content_type or fname.endswith((".docx", ".doc")):
        try:
            from docx import Document
            doc = Document(io.BytesIO(content))
            return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
        except Exception as e:
            return f"[DOCX xato: {e}]"
    else:
        return content.decode("utf-8", errors="ignore")


def chunk_text(text: str, chunk_size: int = 4000) -> list[str]:
    words = text.split()
    chunks, current, size = [], [], 0
    for word in words:
        size += len(word) + 1
        current.append(word)
        if size >= chunk_size:
            chunks.append(" ".join(current))
            current, size = [], 0
    if current:
        chunks.append(" ".join(current))
    return chunks
