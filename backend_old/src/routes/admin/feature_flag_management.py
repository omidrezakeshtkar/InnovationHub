from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...models import FeatureFlag, User, UserRole
from ...schemas import FeatureFlagCreate, FeatureFlagInDB
from ...database import get_db
from ...dependencies import get_current_user
from ...auth.rbac import admin_only
from ...services.email_service import send_email

router = APIRouter()

@router.post("/", response_model=FeatureFlagInDB)
async def create_feature_flag(
    feature_flag: FeatureFlagCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    new_feature_flag = FeatureFlag(**feature_flag.dict())
    db.add(new_feature_flag)
    db.commit()
    db.refresh(new_feature_flag)
    return new_feature_flag

@router.get("/", response_model=list[FeatureFlagInDB])
async def get_all_feature_flags(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    feature_flags = db.query(FeatureFlag).all()
    return feature_flags

@router.put("/{flag_name}", response_model=FeatureFlagInDB)
async def update_feature_flag(
    flag_name: str,
    is_enabled: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    feature_flag = db.query(FeatureFlag).filter(FeatureFlag.name == flag_name).first()
    if not feature_flag:
        raise HTTPException(status_code=404, detail="Feature flag not found")
    
    feature_flag.is_enabled = is_enabled
    db.commit()
    db.refresh(feature_flag)

    # Send email to all admins
    admin_users = db.query(User).filter(User.role == UserRole.ADMIN).all()
    admin_emails = [user.email for user in admin_users]
    
    await send_email(
        subject=f"Feature Flag '{flag_name}' Updated",
        recipients=admin_emails,
        body=f"The feature flag '{flag_name}' has been {'enabled' if is_enabled else 'disabled'}."
    )

    return feature_flag