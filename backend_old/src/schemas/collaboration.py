from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CollaborationInvitationCreate(BaseModel):
    idea_id: str
    invitee_id: str

class CollaborationInvitationInDB(BaseModel):
    id: str
    idea_id: str
    inviter_id: str
    invitee_id: str
    created_at: datetime
    status: str  # e.g., "pending", "accepted", "rejected"

    model_config = ConfigDict(from_attributes=True)