from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional


class MemoryCreate(BaseModel):
    content: str
    memory_type: str = "fact"


class MemoryResponse(BaseModel):
    id: UUID
    content: str
    memory_type: str
    created_at: datetime

    model_config = {"from_attributes": True}


class MemorySearch(BaseModel):
    query: str
    limit: int = 10
