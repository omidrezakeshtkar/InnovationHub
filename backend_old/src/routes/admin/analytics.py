from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ...models import User, Idea, Comment, UserVote
from ...database import get_db
from ...dependencies import get_current_user
from ...auth.rbac import admin_only
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/overview")
async def get_analytics_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    total_users = db.query(func.count(User.id)).scalar()
    total_ideas = db.query(func.count(Idea.id)).scalar()
    total_comments = db.query(func.count(Comment.id)).scalar()
    total_votes = db.query(func.count(UserVote.id)).scalar()

    return {
        "total_users": total_users,
        "total_ideas": total_ideas,
        "total_comments": total_comments,
        "total_votes": total_votes
    }

@router.get("/user-activity")
async def get_user_activity(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    new_users = db.query(func.count(User.id)).filter(User.created_at >= cutoff_date).scalar()
    active_users = db.query(func.count(User.id)).filter(
        (User.last_idea_submission >= cutoff_date) |
        (User.id.in_(db.query(Comment.author_id).filter(Comment.created_at >= cutoff_date)))
    ).scalar()

    return {
        "new_users": new_users,
        "active_users": active_users
    }

@router.get("/idea-stats")
async def get_idea_stats(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    new_ideas = db.query(func.count(Idea.id)).filter(Idea.created_at >= cutoff_date).scalar()
    implemented_ideas = db.query(func.count(Idea.id)).filter(
        Idea.status == 'IMPLEMENTED',
        Idea.created_at >= cutoff_date
    ).scalar()

    return {
        "new_ideas": new_ideas,
        "implemented_ideas": implemented_ideas
    }

@router.get("/top-contributors")
async def get_top_contributors(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    top_contributors = db.query(User.id, User.username, func.count(Idea.id).label('idea_count')).\
        join(Idea, User.id == Idea.main_author_id).\
        group_by(User.id).\
        order_by(func.count(Idea.id).desc()).\
        limit(limit).\
        all()

    return [{"id": user.id, "username": user.username, "idea_count": user.idea_count} for user in top_contributors]