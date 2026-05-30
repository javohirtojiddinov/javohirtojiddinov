from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.memory import Memory
import uuid


async def store_memory(db: AsyncSession, user_id: uuid.UUID, content: str,
                       memory_type: str = "fact", source_conversation_id=None) -> Memory:
    memory = Memory(user_id=user_id, content=content, memory_type=memory_type,
                    source_conversation_id=source_conversation_id)
    db.add(memory)
    await db.commit()
    await db.refresh(memory)
    return memory


async def get_user_memories(db: AsyncSession, user_id: uuid.UUID, limit: int = 50) -> List[Memory]:
    result = await db.execute(
        select(Memory).where(Memory.user_id == user_id).order_by(desc(Memory.created_at)).limit(limit)
    )
    return list(result.scalars().all())


async def search_memories(db: AsyncSession, user_id: uuid.UUID, query: str, limit: int = 10) -> List[Memory]:
    result = await db.execute(
        select(Memory).where(Memory.user_id == user_id, Memory.content.ilike(f"%{query}%"))
        .order_by(desc(Memory.created_at)).limit(limit)
    )
    return list(result.scalars().all())


async def delete_memory(db: AsyncSession, memory_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    result = await db.execute(select(Memory).where(Memory.id == memory_id, Memory.user_id == user_id))
    memory = result.scalar_one_or_none()
    if not memory:
        return False
    await db.delete(memory)
    await db.commit()
    return True
