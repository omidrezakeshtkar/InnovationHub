from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ...schemas import CollaborationInvitationInDB
from ...models import User, CollaborationInvitation
from ...database import get_db
from ...dependencies import get_current_active_user

router = APIRouter()


@router.get("/users", response_model=List[CollaborationInvitationInDB])
async def get_pending_invitations(
    current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)
):
    invitations = (
        db.query(CollaborationInvitation)
        .filter(CollaborationInvitation.invitee_id == current_user.id)
        .all()
    )
    return invitations
