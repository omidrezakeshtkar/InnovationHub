from fastapi import APIRouter
from .auth import router as auth_router
from .profile import router as profile_router
from .management import router as management_router
from .stats import router as stats_router
from .invitations import router as invitations_router

router = APIRouter()

router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(profile_router, prefix="/profile", tags=["profile"])
router.include_router(management_router, prefix="/management", tags=["user management"])
router.include_router(stats_router, prefix="/stats", tags=["user stats"])
router.include_router(invitations_router, prefix="/invitations", tags=["invitations"])