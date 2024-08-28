from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CommentCreate(BaseModel):
    content: str

class CommentInDB(BaseModel):
    id: str
    content: str
    author_id: str
    idea_id: str
    created_at: datetime
    is_approved: bool

    model_config = ConfigDict(from_attributes=True)

class CommentUpdate(BaseModel):
    content: str