from sqlalchemy import Column, String, ForeignKey
from ..database import Base

class UserFavorite(Base):
    __tablename__ = "user_favorites"

    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    idea_id = Column(String, ForeignKey("ideas.id"), primary_key=True)