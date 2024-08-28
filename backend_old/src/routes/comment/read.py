from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...models import Comment, User
from ...schemas import CommentInDB
from ...database import get_db
from ...dependencies import get_current_active_user

router = APIRouter()

@router.get("/{idea_id}", response_model=List[CommentInDB])
async def get_comments(
    idea_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    comments = db.query(Comment).filter(Comment.idea_id == idea_id, Comment.is_approved == True).all()
    return comments