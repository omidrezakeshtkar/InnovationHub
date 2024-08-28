from sqlalchemy import Column, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from ..database import Base
import uuid

class CollaborationInvitation(Base):
    __tablename__ = "collaboration_invitations"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    idea_id = Column(String, ForeignKey("ideas.id"))
    inviter_id = Column(String, ForeignKey("users.id"))
    invitee_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())

    idea = relationship("Idea", back_populates="invitations")
    inviter = relationship("User", foreign_keys=[inviter_id])
    invitee = relationship("User", foreign_keys=[invitee_id])