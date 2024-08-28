from pydantic import BaseModel, ConfigDict
from datetime import datetime

class IdeaVersionCreate(BaseModel):
    title: str
    description: str

class IdeaVersionInDB(IdeaVersionCreate):
    id: str
    idea_id: str
    created_at: datetime
    created_by: str

    model_config = ConfigDict(from_attributes=True)