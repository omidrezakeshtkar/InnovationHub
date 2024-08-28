from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean, func
from sqlalchemy.orm import relationship
from ..database import Base
import uuid

class Comment(Base):
    __tablename__ = "comments"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    content = Column(String)
    author_id = Column(String, ForeignKey("users.id"))
    idea_id = Column(String, ForeignKey("ideas.id"))
    created_at = Column(DateTime, server_default=func.now())
    is_approved = Column(Boolean, default=False)

    author = relationship("User", back_populates="comments")
    idea = relationship("Idea", back_populates="comments")