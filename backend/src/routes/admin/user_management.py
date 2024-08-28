from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...models import User, UserRole
from ...schemas import UserInDB
from ...database import get_db
from ...dependencies import get_current_user
from ...auth.rbac import admin_only

router = APIRouter()

@router.get("/", response_model=list[UserInDB])
async def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    users = db.query(User).all()
    return users

@router.put("/{user_id}/role", response_model=UserInDB)
async def update_user_role(
    user_id: str,
    new_role: UserRole,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = new_role
    db.commit()
    db.refresh(user)
    return user

# Add more user management routes as needed