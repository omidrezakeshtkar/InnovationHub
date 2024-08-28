from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...models import Comment, User
from ...schemas import CommentInDB
from ...database import get_db
from ...dependencies import get_current_user
from ...auth.rbac import admin_only

router = APIRouter()

@router.get("/", response_model=list[CommentInDB])
async def get_all_comments(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    comments = db.query(Comment).all()
    return comments

@router.delete("/{comment_id}")
async def delete_comment(
    comment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"}

# Add more comment management routes as needed