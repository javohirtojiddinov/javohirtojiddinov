from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional


class FileResponse(BaseModel):
    id: UUID
    filename: str
    file_type: str
    file_size: int
    analysis_status: str
    analysis_result: Optional[str] = None
    created_at: datetime
    model_config = {"from_attributes": True}
