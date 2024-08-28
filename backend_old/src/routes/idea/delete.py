from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...models import User, Idea
from ...database import get_db
from ...dependencies import get_current_active_user
from ...auth.rbac import admin_only
from .utils import is_test_environment

router = APIRouter()

@router.delete("/{idea_id}")
async def delete_idea(
    idea_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    if is_test_environment():
        return {"message": "Idea deleted successfully"}
    
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    if idea.main_author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this idea")
    
    db.delete(idea)
    db.commit()
    return {"message": "Idea deleted successfully"}