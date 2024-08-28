from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from ..models import IdeaStatus


class CollaboratorInfo(BaseModel):
    id: str
    username: str

    model_config = ConfigDict(from_attributes=True)


class IdeaCreate(BaseModel):
    title: str
    description: str
    tags: List[str] = []
    category_id: Optional[str] = None
    collaborator_ids: List[str] = []


class IdeaInDB(BaseModel):
    id: str
    title: str
    description: str
    main_author_id: str
    is_approved: bool
    status: IdeaStatus
    created_at: datetime
    category: str
    category_id: str
    stage: IdeaStatus
    collaborators: List[str] = []
    votes: int = 0
    tags: List[str] = []
    # Keep any other existing fields

    model_config = ConfigDict(from_attributes=True)
