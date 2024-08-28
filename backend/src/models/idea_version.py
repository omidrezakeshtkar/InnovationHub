from sqlalchemy import Column, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from ..database.base import Base
import uuid

class IdeaVersion(Base):
    __tablename__ = "idea_versions"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    idea_id = Column(String, ForeignKey("ideas.id"))
    title = Column(String)
    description = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    created_by = Column(String, ForeignKey("users.id"))

    idea = relationship("Idea", back_populates="versions")
    author = relationship("User")