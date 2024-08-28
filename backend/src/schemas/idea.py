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
    collaborators: List[CollaboratorInfo]
    status: IdeaStatus
    votes: int
    created_at: datetime
    category: Optional[str]
    tags: List[str]
    is_approved: bool
    stage: IdeaStatus
    category_id: Optional[str]

    model_config = ConfigDict(from_attributes=True)