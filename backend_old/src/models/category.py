from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database.base import Base
import uuid

class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True)
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)

    department = relationship("Department", back_populates="categories")
    ideas = relationship("Idea", back_populates="category")