from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...schemas import UserInDB
from ...models import User, UserRole
from ...database import get_db
from ...dependencies import get_current_active_user
from ...auth.rbac import admin_only, admin_or_moderator

router = APIRouter()

@router.get("/", response_model=List[UserInDB])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_or_moderator)
):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.post("/block/{user_id}")
async def block_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_blocked = True
    db.commit()
    return {"message": "User blocked successfully"}

@router.post("/approve/{user_id}")
async def approve_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_or_moderator),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_approved = True
    db.commit()
    return {"message": "User approved successfully"}