from pydantic import BaseModel, ConfigDict
from datetime import datetime


class ReportCreate(BaseModel):
    idea_id: str
    reason: str


class ReportInDB(BaseModel):
    id: str
    idea_id: str
    reporter_id: str
    reason: str
    created_at: datetime
    is_resolved: bool

    model_config = ConfigDict(from_attributes=True)
