from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional


class DocumentCreate(BaseModel):
    title: str
    doc_type: str = "other"
    content: Optional[str] = ""


class DocumentGenerate(BaseModel):
    title: str
    doc_type: str = "other"
    prompt: str


class DocumentResponse(BaseModel):
    id: UUID
    title: str
    doc_type: str
    content: str
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
