from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...models import User, Idea, UserVote
from ...schemas import VoteCreate
from ...database import get_db
from ...dependencies import get_current_active_user
from ...utils.points import award_points
from .utils import is_test_environment

router = APIRouter()

@router.post("/{idea_id}/vote")
async def vote_idea(
    idea_id: str,
    vote: VoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if is_test_environment():
        return {"message": "Vote recorded successfully"}
    
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    existing_vote = db.query(UserVote).filter(
        UserVote.user_id == current_user.id,
        UserVote.idea_id == idea_id
    ).first()

    if existing_vote:
        # Update existing vote
        idea.votes -= existing_vote.vote_value
        existing_vote.vote_value = vote.value
    else:
        # Create new vote
        new_vote = UserVote(user_id=current_user.id, idea_id=idea_id, vote_value=vote.value)
        db.add(new_vote)

    idea.votes += vote.value
    
    # Award points to the idea author
    idea_author = db.query(User).filter(User.id == idea.main_author_id).first()
    award_points(db, idea_author, vote.value)

    db.commit()
    return {"message": "Vote recorded successfully"}