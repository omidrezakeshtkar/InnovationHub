from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLAlchemyEnum, Table, func
from sqlalchemy.orm import relationship
from ..database import Base
import uuid
from enum import Enum as PyEnum

class IdeaStatus(str, PyEnum):
    DRAFT = "Draft"
    SUBMITTED = "Submitted"
    UNDER_REVIEW = "Under Review"
    APPROVED = "Approved"
    IN_PROGRESS = "In Progress"
    IMPLEMENTED = "Implemented"
    REJECTED = "Rejected"

idea_collaborators = Table('idea_collaborators', Base.metadata,
    Column('user_id', String, ForeignKey('users.id')),
    Column('idea_id', String, ForeignKey('ideas.id'))
)

class Idea(Base):
    __tablename__ = "ideas"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    title = Column(String)
    description = Column(String)
    main_author_id = Column(String, ForeignKey("users.id"))
    status = Column(SQLAlchemyEnum(IdeaStatus), default=IdeaStatus.UNDER_REVIEW)
    votes = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    category = Column(String, nullable=True)
    is_approved = Column(Boolean, default=False)
    category_id = Column(String, ForeignKey("categories.id"))
    
    main_author = relationship("User", back_populates="ideas")
    collaborators = relationship("User", secondary=idea_collaborators, back_populates="collaborated_ideas")
    comments = relationship("Comment", back_populates="idea")
    tags = relationship("Tag", secondary="idea_tags", back_populates="ideas")
    favorited_by = relationship("User", secondary="user_favorites", back_populates="favorite_ideas")
    reports = relationship("Report", back_populates="idea")
    invitations = relationship("CollaborationInvitation", back_populates="idea")
    category = relationship("Category", back_populates="ideas")
    versions = relationship("IdeaVersion", back_populates="idea", order_by="IdeaVersion.created_at.desc()")