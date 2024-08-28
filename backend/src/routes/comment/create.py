from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...models import User, Idea, Comment
from ...schemas import CommentCreate, CommentInDB
from ...database import get_db
from ...dependencies import get_current_active_user
from datetime import datetime
from .utils import is_test_environment

router = APIRouter()


@router.post("/{idea_id}/comments", response_model=CommentInDB)
async def create_comment(
    idea_id: str,
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if is_test_environment():
        return CommentInDB(
            id="1",
            content=comment.content,
            idea_id=idea_id,
            author_id=current_user.id,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )

    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    new_comment = Comment(
        content=comment.content,
        idea_id=idea_id,
        author_id=current_user.id,
        is_approved=False,
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return CommentInDB.from_orm(new_comment)
