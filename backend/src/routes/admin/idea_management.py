from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...models import Idea, IdeaStatus, User
from ...schemas import IdeaInDB
from ...database import get_db
from ...dependencies import get_current_user
from ...auth.rbac import admin_only
from ...services.external_integrations import create_trello_card, send_slack_notification

router = APIRouter()

@router.get("/", response_model=list[IdeaInDB])
async def get_all_ideas(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    ideas = db.query(Idea).all()
    return ideas

@router.put("/{idea_id}/status", response_model=IdeaInDB)
async def update_idea_status(
    idea_id: str,
    new_status: IdeaStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    old_status = idea.status
    idea.status = new_status
    db.commit()
    db.refresh(idea)

    if new_status == IdeaStatus.APPROVED and old_status != IdeaStatus.APPROVED:
        trello_url = create_trello_card(idea)
        if trello_url:
            send_slack_notification(f"New idea approved: {idea.title}\nTrello card: {trello_url}")
        else:
            send_slack_notification(f"New idea approved: {idea.title}\nFailed to create Trello card.")
    
    if new_status == IdeaStatus.IMPLEMENTED:
        send_slack_notification(f"Idea implemented: {idea.title}")

    return idea

# Add more idea management routes as needed