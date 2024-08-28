from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...models import Badge, User
from ...schemas import BadgeCreate, BadgeInDB
from ...database import get_db
from ...dependencies import get_current_user
from ...auth.rbac import admin_only

router = APIRouter()

@router.post("/", response_model=BadgeInDB)
async def create_badge(
    badge: BadgeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    new_badge = Badge(**badge.dict())
    db.add(new_badge)
    db.commit()
    db.refresh(new_badge)
    return new_badge

@router.get("/", response_model=list[BadgeInDB])
async def get_all_badges(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    badges = db.query(Badge).all()
    return badges

@router.post("/{badge_id}/award/{user_id}")
async def award_badge_to_user(
    badge_id: str,
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    badge = db.query(Badge).filter(Badge.id == badge_id).first()
    user = db.query(User).filter(User.id == user_id).first()
    
    if not badge or not user:
        raise HTTPException(status_code=404, detail="Badge or User not found")
    
    if badge not in user.badges:
        user.badges.append(badge)
        db.commit()
        return {"message": f"Badge '{badge.name}' awarded to user '{user.username}'"}
    else:
        return {"message": f"User '{user.username}' already has the badge '{badge.name}'"}