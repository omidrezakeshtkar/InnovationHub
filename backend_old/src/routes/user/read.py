from fastapi import Depends
from sqlalchemy.orm import Session
from src.dependencies.auth import get_current_active_user
from src.models.user import User
from src.dependencies.database import get_db


@router.get("/stats")
async def get_user_stats(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)
):
    # Implement logic to get user stats here
    return {"stats": "User stats here"}
