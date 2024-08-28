from fastapi import HTTPException, Depends
from ..models import UserRole, User
from ..dependencies import get_current_active_user

def RoleChecker(allowed_roles: list[UserRole]):
    async def check_role(current_user: User = Depends(get_current_active_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Operation not permitted")
        return current_user
    return check_role

admin_only = RoleChecker([UserRole.ADMIN])
admin_or_moderator = RoleChecker([UserRole.ADMIN, UserRole.MODERATOR])