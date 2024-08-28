from sqlalchemy import Column, String, Boolean
from ..database.base import Base
import uuid

class FeatureFlag(Base):
    __tablename__ = "feature_flags"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True)
    is_enabled = Column(Boolean, default=False)