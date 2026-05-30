import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
from app.core.database import get_db
from app.models.file import File
from app.models.user import User
from app.schemas.file import FileResponse
from app.dependencies.auth import get_current_user
from app.services.file_service import upload_file_to_storage, extract_text
from app.services.llm_service import analyze_file_content

router = APIRouter()


@router.get("", response_model=List[FileResponse])
async def list_files(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(File).where(File.user_id == current_user.id).order_by(desc(File.created_at)))
    return [FileResponse.model_validate(f) for f in result.scalars().all()]


@router.post("/upload", response_model=FileResponse)
async def upload_file(file: UploadFile, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    content = await file.read()
    extracted_text = extract_text(content, file.filename or "unknown", file.content_type or "")
    storage_path = None
    try:
        storage_path = upload_file_to_storage(content, f"{uuid.uuid4()}_{file.filename}", file.content_type or "application/octet-stream")
    except Exception:
        pass
    db_file = File(user_id=current_user.id, filename=file.filename or "unnamed",
                   file_type=file.content_type or "application/octet-stream",
                   file_size=len(content), storage_path=storage_path,
                   extracted_text=extracted_text, analysis_status="pending")
    db.add(db_file)
    await db.commit()
    await db.refresh(db_file)
    return FileResponse.model_validate(db_file)


@router.post("/{file_id}/analyze", response_model=FileResponse)
async def analyze_file(file_id: uuid.UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(File).where(File.id == file_id, File.user_id == current_user.id))
    db_file = result.scalar_one_or_none()
    if not db_file:
        raise HTTPException(status_code=404, detail="Fayl topilmadi")
    db_file.analysis_status = "processing"
    await db.commit()
    try:
        db_file.analysis_result = await analyze_file_content(db_file.filename, db_file.extracted_text or "")
        db_file.analysis_status = "done"
    except Exception as e:
        db_file.analysis_status = "error"
        db_file.analysis_result = f"Xato: {e}"
    await db.commit()
    await db.refresh(db_file)
    return FileResponse.model_validate(db_file)


@router.delete("/{file_id}")
async def delete_file(file_id: uuid.UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(File).where(File.id == file_id, File.user_id == current_user.id))
    db_file = result.scalar_one_or_none()
    if not db_file:
        raise HTTPException(status_code=404, detail="Fayl topilmadi")
    await db.delete(db_file)
    await db.commit()
    return {"message": "Fayl o'chirildi"}
