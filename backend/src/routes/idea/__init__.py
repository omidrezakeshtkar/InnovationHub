from fastapi import APIRouter
from .create import router as create_router
from .read import router as read_router
from .update import router as update_router
from .delete import router as delete_router
from .vote import router as vote_router
from .favorite import router as favorite_router
from .search import router as search_router
from .trending import router as trending_router
from .report import router as report_router
from .collaboration import router as collaboration_router

router = APIRouter()

router.include_router(create_router, tags=["idea creation"])
router.include_router(read_router, tags=["idea reading"])
router.include_router(update_router, tags=["idea updating"])
router.include_router(delete_router, tags=["idea deletion"])
router.include_router(vote_router, tags=["idea voting"])
router.include_router(favorite_router, tags=["idea favorites"])
router.include_router(search_router, tags=["idea search"])
router.include_router(trending_router, tags=["trending ideas"])
router.include_router(report_router, tags=["idea reporting"])
router.include_router(collaboration_router, tags=["idea collaboration"])