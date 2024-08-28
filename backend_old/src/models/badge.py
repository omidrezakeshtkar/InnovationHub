from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from ..database.base import Base
from .user import user_badges
import uuid

class Badge(Base):
    __tablename__ = "badges"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True)
    description = Column(String)
    points_required = Column(Integer)

    users = relationship("User", secondary=user_badges, back_populates="badges")