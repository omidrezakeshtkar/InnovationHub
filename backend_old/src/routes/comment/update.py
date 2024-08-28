from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...models import Comment, User
from ...schemas import CommentUpdate, CommentInDB
from ...database import get_db
from ...dependencies import get_current_active_user

router = APIRouter()

@router.put("/{comment_id}", response_model=CommentInDB)
async def update_comment(
    comment_id: str,
    comment_update: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this comment")
    
    comment.content = comment_update.content
    db.commit()
    db.refresh(comment)
    return comment