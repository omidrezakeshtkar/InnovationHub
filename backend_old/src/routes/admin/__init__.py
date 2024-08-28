from fastapi import APIRouter
from .user_management import router as user_management_router
from .idea_management import router as idea_management_router
from .category_management import router as category_management_router
from .comment_management import router as comment_management_router
from .reports import router as reports_router
from .analytics import router as analytics_router
from .department_management import router as department_management_router
from .badge_management import router as badge_management_router
from .feature_flag_management import router as feature_flag_management_router

router = APIRouter()

router.include_router(user_management_router, prefix="/users", tags=["admin-users"])
router.include_router(idea_management_router, prefix="/ideas", tags=["admin-ideas"])
router.include_router(category_management_router, prefix="/categories", tags=["admin-categories"])
router.include_router(comment_management_router, prefix="/comments", tags=["admin-comments"])
router.include_router(reports_router, prefix="/reports", tags=["admin-reports"])
router.include_router(analytics_router, prefix="/analytics", tags=["admin-analytics"])
router.include_router(department_management_router, prefix="/departments", tags=["admin-departments"])
router.include_router(badge_management_router, prefix="/badges", tags=["admin-badges"])
router.include_router(feature_flag_management_router, prefix="/feature-flags", tags=["admin-feature-flags"])