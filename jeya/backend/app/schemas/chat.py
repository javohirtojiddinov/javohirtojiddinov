from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional


class MessageCreate(BaseModel):
    content: str


class MessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    created_at: datetime
    model_config = {"from_attributes": True}


class ConversationCreate(BaseModel):
    title: Optional[str] = "Yangi suhbat"


class ConversationResponse(BaseModel):
    id: UUID
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: Optional[int] = 0
    model_config = {"from_attributes": True}


class StatsResponse(BaseModel):
    total_conversations: int
    total_documents: int
    total_files: int
    total_memories: int
