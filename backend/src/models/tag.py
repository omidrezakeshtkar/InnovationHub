from sqlalchemy import Column, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from ..database import Base
import uuid

class Tag(Base):
    __tablename__ = "tags"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True)

    ideas = relationship("Idea", secondary="idea_tags", back_populates="tags")

class IdeaTag(Base):
    __tablename__ = "idea_tags"

    idea_id = Column(String, ForeignKey("ideas.id"), primary_key=True)
    tag_id = Column(String, ForeignKey("tags.id"), primary_key=True)