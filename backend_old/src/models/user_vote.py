from sqlalchemy import Column, String, ForeignKey, Integer
from ..database.base import Base
import uuid

class UserVote(Base):
    __tablename__ = "user_votes"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    idea_id = Column(String, ForeignKey("ideas.id"))
    vote_value = Column(Integer)  # 1 for upvote, -1 for downvote