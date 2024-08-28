from pydantic import BaseModel, ConfigDict
from datetime import datetime


class NotificationCreate(BaseModel):
    user_id: str
    content: str


class NotificationInDB(BaseModel):
    id: str
    user_id: str
    content: str
    created_at: datetime
    is_read: bool

    model_config = ConfigDict(from_attributes=True)
