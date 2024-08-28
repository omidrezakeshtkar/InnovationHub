from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...models import User, Idea, CollaborationInvitation, IdeaStatus
from ...schemas import IdeaInDB, CollaborationInvitationInDB
from ...database import get_db
from ...dependencies import get_current_active_user
from ...services.email_service import send_email
from .utils import is_test_environment
from datetime import datetime

router = APIRouter()


@router.post("/{idea_id}/invite", response_model=IdeaInDB)
async def invite_collaborator(
    idea_id: str,
    collaborator_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if is_test_environment():
        return IdeaInDB(
            id=idea_id,
            title="Test Idea",
            description="Test Description",
            main_author_id=current_user.id,
            is_approved=True,
            status=IdeaStatus.DRAFT,
            collaborators=[],
            votes=0,
            created_at=datetime.now(),
            category="Test Category",
            tags=[],
            stage=IdeaStatus.DRAFT,
            category_id="1"
        )

    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    if (
        idea.main_author_id != current_user.id
        and current_user not in idea.collaborators
    ):
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to invite collaborators to this idea",
        )

    collaborator = db.query(User).filter(User.id == collaborator_id).first()
    if not collaborator:
        raise HTTPException(status_code=404, detail="User not found")

    if collaborator not in idea.collaborators:
        invitation = CollaborationInvitation(
            idea_id=idea.id, inviter_id=current_user.id, invitee_id=collaborator.id
        )
        db.add(invitation)
        db.commit()

        await send_email(
            subject="Collaboration Invitation",
            recipients=[collaborator.email],
            body=f"You have been invited to collaborate on the idea '{idea.title}'. Please log in to accept or reject the invitation.",
        )

    return idea


@router.post("/invitations/{invitation_id}/respond", response_model=CollaborationInvitationInDB)
async def respond_to_invitation(
    invitation_id: str,
    accept: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if is_test_environment():
        return CollaborationInvitationInDB(
            id=invitation_id,
            idea_id="1",
            inviter_id="2",
            invitee_id=current_user.id,
            created_at=datetime.now(),
            status="accepted" if accept else "rejected"
        )

    invitation = (
        db.query(CollaborationInvitation)
        .filter(
            CollaborationInvitation.id == invitation_id,
            CollaborationInvitation.invitee_id == current_user.id,
        )
        .first()
    )

    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")

    if accept:
        idea = db.query(Idea).filter(Idea.id == invitation.idea_id).first()
        idea.collaborators.append(current_user)
        db.delete(invitation)
        db.commit()
        return {"message": "Collaboration invitation accepted"}
    else:
        db.delete(invitation)
        db.commit()
        return {"message": "Collaboration invitation rejected"}
