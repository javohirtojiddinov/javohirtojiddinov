import json
import uuid
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import List, Optional
from app.core.database import get_db
from app.core.security import decode_token
from app.models.user import User
from app.models.conversation import Conversation, Message
from app.models.memory import Memory
from app.models.document import Document
from app.models.file import File
from app.schemas.chat import ConversationCreate, ConversationResponse, MessageResponse, StatsResponse
from app.dependencies.auth import get_current_user
from app.services.llm_service import generate_response_stream, generate_response

router = APIRouter()


@router.get("/stats", response_model=StatsResponse)
async def get_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    conv_count = await db.scalar(
        select(func.count()).select_from(Conversation).where(Conversation.user_id == current_user.id)
    )
    doc_count = await db.scalar(
        select(func.count()).select_from(Document).where(Document.user_id == current_user.id)
    )
    file_count = await db.scalar(
        select(func.count()).select_from(File).where(File.user_id == current_user.id)
    )
    mem_count = await db.scalar(
        select(func.count()).select_from(Memory).where(Memory.user_id == current_user.id)
    )
    return StatsResponse(
        total_conversations=conv_count or 0,
        total_documents=doc_count or 0,
        total_files=file_count or 0,
        total_memories=mem_count or 0,
    )


@router.post("/conversations", response_model=ConversationResponse)
async def create_conversation(
    data: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    conv = Conversation(user_id=current_user.id, title=data.title or "Yangi suhbat")
    db.add(conv)
    await db.commit()
    await db.refresh(conv)
    return ConversationResponse(
        id=conv.id,
        title=conv.title,
        created_at=conv.created_at,
        updated_at=conv.updated_at,
        message_count=0,
    )


@router.get("/conversations", response_model=List[ConversationResponse])
async def list_conversations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Conversation)
        .where(Conversation.user_id == current_user.id)
        .order_by(desc(Conversation.updated_at))
        .limit(50)
    )
    conversations = result.scalars().all()
    out = []
    for conv in conversations:
        count = await db.scalar(
            select(func.count()).select_from(Message).where(Message.conversation_id == conv.id)
        )
        out.append(ConversationResponse(
            id=conv.id,
            title=conv.title,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
            message_count=count or 0,
        ))
    return out


@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageResponse])
async def get_messages(
    conversation_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Verify ownership
    result = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
    )
    conv = result.scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Suhbat topilmadi")

    msgs = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    )
    return [MessageResponse.model_validate(m) for m in msgs.scalars().all()]


@router.websocket("/ws/{conversation_id}")
async def websocket_chat(
    websocket: WebSocket,
    conversation_id: uuid.UUID,
    token: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    await websocket.accept()

    # Auth
    if not token:
        await websocket.send_text(json.dumps({"type": "error", "content": "Token kerak"}))
        await websocket.close()
        return

    payload = decode_token(token)
    if not payload:
        await websocket.send_text(json.dumps({"type": "error", "content": "Noto'g'ri token"}))
        await websocket.close()
        return

    user_result = await db.execute(select(User).where(User.id == payload.get("sub")))
    user = user_result.scalar_one_or_none()
    if not user:
        await websocket.send_text(json.dumps({"type": "error", "content": "Foydalanuvchi topilmadi"}))
        await websocket.close()
        return

    # Verify conversation ownership
    conv_result = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user.id,
        )
    )
    conv = conv_result.scalar_one_or_none()
    if not conv:
        await websocket.send_text(json.dumps({"type": "error", "content": "Suhbat topilmadi"}))
        await websocket.close()
        return

    try:
        while True:
            data = await websocket.receive_text()
            payload_data = json.loads(data)
            user_content = payload_data.get("content", "").strip()
            if not user_content:
                continue

            # Save user message
            user_msg = Message(
                conversation_id=conversation_id,
                role="user",
                content=user_content,
            )
            db.add(user_msg)
            await db.commit()

            # Build message history for LLM
            msgs_result = await db.execute(
                select(Message)
                .where(Message.conversation_id == conversation_id)
                .order_by(Message.created_at)
                .limit(40)
            )
            history = [
                {"role": m.role, "content": m.content}
                for m in msgs_result.scalars().all()
            ]

            # Stream response
            full_response = ""
            async for chunk in generate_response_stream(history):
                full_response += chunk
                await websocket.send_text(json.dumps({"type": "chunk", "content": chunk}))

            # Save assistant message
            assistant_msg = Message(
                conversation_id=conversation_id,
                role="assistant",
                content=full_response,
            )
            db.add(assistant_msg)

            # Update conversation title if it's the first message
            if conv.title == "Yangi suhbat" and user_content:
                conv.title = user_content[:80] + ("..." if len(user_content) > 80 else "")

            await db.commit()
            await websocket.send_text(json.dumps({"type": "done"}))

    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_text(json.dumps({"type": "error", "content": str(e)}))
        except Exception:
            pass
