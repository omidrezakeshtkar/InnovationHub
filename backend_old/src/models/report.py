from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean, func
from sqlalchemy.orm import relationship
from ..database import Base
import uuid

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    idea_id = Column(String, ForeignKey("ideas.id"))
    reporter_id = Column(String, ForeignKey("users.id"))
    reason = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    is_resolved = Column(Boolean, default=False)

    idea = relationship("Idea", back_populates="reports")
    reporter = relationship("User", back_populates="reports")