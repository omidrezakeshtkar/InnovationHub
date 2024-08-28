from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum as SQLAlchemyEnum, func, Table, ForeignKey
from sqlalchemy.orm import relationship
from ..database.base import Base
import uuid
from enum import Enum as PyEnum

class UserRole(str, PyEnum):
    ADMIN = "admin"
    MODERATOR = "moderator"
    USER = "user"

user_badges = Table('user_badges', Base.metadata,
    Column('user_id', String, ForeignKey('users.id')),
    Column('badge_id', String, ForeignKey('badges.id'))
)

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(SQLAlchemyEnum(UserRole), default=UserRole.USER)
    is_blocked = Column(Boolean, default=False)
    score = Column(Integer, default=0)
    points = Column(Integer, default=0)  # New field for gamification points
    ideas_submitted_today = Column(Integer, default=0)
    last_idea_submission = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    is_approved = Column(Boolean, default=False)

    ideas = relationship("Idea", back_populates="main_author")
    collaborated_ideas = relationship("Idea", secondary="idea_collaborators", back_populates="collaborators")
    comments = relationship("Comment", back_populates="author")
    favorite_ideas = relationship("Idea", secondary="user_favorites", back_populates="favorited_by")
    notifications = relationship("Notification", back_populates="user")
    reports = relationship("Report", back_populates="reporter")
    badges = relationship("Badge", secondary=user_badges, back_populates="users")  # New relationship for badges