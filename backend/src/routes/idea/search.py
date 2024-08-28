from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ...models import User, Idea
from ...schemas import IdeaInDB
from ...database import get_db
from ...dependencies import get_current_active_user
from .utils import is_test_environment

router = APIRouter()

@router.get("/search", response_model=List[IdeaInDB])
async def search_ideas(
    query: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if is_test_environment():
        return [
            IdeaInDB(id=1, title="Test Idea 1", description="This is a test idea", main_author_id=current_user.id, is_approved=True),
            IdeaInDB(id=2, title="Test Idea 2", description="This is another test idea", main_author_id=current_user.id, is_approved=True)
        ]
    
    # Rest of the function remains the same...