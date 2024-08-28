from sqlalchemy.orm import Session
from ..models import User, Badge

def award_points(db: Session, user: User, points: int):
    user.points += points
    user.score += points  # Update the existing score field as well
    
    # Check if the user has earned any new badges
    available_badges = db.query(Badge).filter(Badge.points_required <= user.points).all()
    for badge in available_badges:
        if badge not in user.badges:
            user.badges.append(badge)
    
    db.commit()