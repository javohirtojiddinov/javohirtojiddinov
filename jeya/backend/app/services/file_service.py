import io
import os
import boto3
from botocore.client import Config
from typing import Optional, Tuple
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
    """Upload file to MinIO/S3 and return storage path."""
    try:
        client = get_s3_client()
        # Ensure bucket exists
        try:
            client.head_bucket(Bucket=settings.S3_BUCKET)
        except Exception:
            client.create_bucket(Bucket=settings.S3_BUCKET)

        storage_path = f"uploads/{filename}"
        client.put_object(
            Bucket=settings.S3_BUCKET,
            Key=storage_path,
            Body=file_content,
            ContentType=content_type,
        )
        return storage_path
    except Exception as e:
        # Fallback: save locally
        local_path = f"/tmp/{filename}"
        with open(local_path, "wb") as f:
            f.write(file_content)
        return local_path


def extract_text_from_pdf(content: bytes) -> str:
    """Extract text from PDF bytes."""
    try:
        from pdfminer.high_level import extract_text
        return extract_text(io.BytesIO(content))
    except Exception as e:
        return f"[PDF matnini o'qishda xato: {str(e)}]"


def extract_text_from_docx(content: bytes) -> str:
    """Extract text from DOCX bytes."""
    try:
        from docx import Document
        doc = Document(io.BytesIO(content))
        return "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
    except Exception as e:
        return f"[DOCX matnini o'qishda xato: {str(e)}]"


def extract_text_from_txt(content: bytes) -> str:
    """Extract text from plain text file."""
    try:
        return content.decode("utf-8", errors="ignore")
    except Exception:
        return content.decode("latin-1", errors="ignore")


def extract_text(content: bytes, filename: str, content_type: str) -> str:
    """Extract text from file based on type."""
    fname_lower = filename.lower()
    if "pdf" in content_type or fname_lower.endswith(".pdf"):
        return extract_text_from_pdf(content)
    elif "wordprocessingml" in content_type or fname_lower.endswith((".docx", ".doc")):
        return extract_text_from_docx(content)
    elif "text" in content_type or fname_lower.endswith(".txt"):
        return extract_text_from_txt(content)
    else:
        # Try plain text
        try:
            return content.decode("utf-8", errors="ignore")
        except Exception:
            return "[Bu fayl turi qo'llab-quvvatlanmaydi]"


def chunk_text(text: str, chunk_size: int = 4000) -> list[str]:
    """Split text into chunks for LLM processing."""
    words = text.split()
    chunks = []
    current_chunk = []
    current_size = 0

    for word in words:
        current_size += len(word) + 1
        current_chunk.append(word)
        if current_size >= chunk_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_size = 0

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks
