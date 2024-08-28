from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean, func
from sqlalchemy.orm import relationship
from ..database import Base
import uuid

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    content = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    is_read = Column(Boolean, default=False)

    user = relationship("User", back_populates="notifications")