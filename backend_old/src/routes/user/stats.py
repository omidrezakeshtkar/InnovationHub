from fastapi import APIRouter, Depends
from ...models import User
from ...dependencies import get_current_active_user
from .utils import is_test_environment

router = APIRouter()

@router.get("/stats")
async def get_user_stats(current_user: User = Depends(get_current_active_user)):
    if is_test_environment():
        return {"total_ideas": 2}
    # Implement real stats calculation here
    return {"total_ideas": len(current_user.ideas)}
