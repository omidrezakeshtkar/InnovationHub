from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from ..database.base import Base
import uuid

class Department(Base):
    __tablename__ = "departments"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True)

    categories = relationship("Category", back_populates="department")