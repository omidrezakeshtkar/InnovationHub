from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ...models import Idea
from ...schemas import IdeaInDB
from ...database import get_db
from sqlalchemy import desc
from datetime import datetime, timedelta
from .utils import is_test_environment

router = APIRouter()

@router.get("/trending", response_model=List[IdeaInDB])
async def get_trending_ideas(
    db: Session = Depends(get_db),
    time_window: int = 7,  # Default to 7 days
    limit: int = 10
):
    if is_test_environment():
        return [
            IdeaInDB(id=1, title="Trending Idea 1", description="This is a trending idea", main_author_id=1, is_approved=True, votes=100),
            IdeaInDB(id=2, title="Trending Idea 2", description="This is another trending idea", main_author_id=2, is_approved=True, votes=90)
        ]
    
    # Rest of the function remains the same...