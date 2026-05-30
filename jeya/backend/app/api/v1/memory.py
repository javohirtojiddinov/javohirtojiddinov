import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.schemas.memory import MemoryResponse, MemoryCreate, MemorySearch
from app.dependencies.auth import get_current_user
from app.services.memory_service import store_memory, get_user_memories, search_memories, delete_memory

router = APIRouter()


@router.get("", response_model=List[MemoryResponse])
async def list_memories(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    memories = await get_user_memories(db, current_user.id)
    return [MemoryResponse.model_validate(m) for m in memories]


@router.post("", response_model=MemoryResponse)
async def create_memory(data: MemoryCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    memory = await store_memory(db, current_user.id, data.content, data.memory_type)
    return MemoryResponse.model_validate(memory)


@router.post("/search", response_model=List[MemoryResponse])
async def search_memories_endpoint(data: MemorySearch, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    memories = await search_memories(db, current_user.id, data.query, data.limit)
    return [MemoryResponse.model_validate(m) for m in memories]


@router.delete("/{memory_id}")
async def remove_memory(memory_id: uuid.UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    deleted = await delete_memory(db, memory_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Xotira topilmadi")
    return {"message": "Xotira o'chirildi"}
