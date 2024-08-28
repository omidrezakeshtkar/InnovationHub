from pydantic import BaseModel, ConfigDict, EmailStr
from ..models import UserRole
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserInDB(BaseModel):
    id: str
    username: str
    email: str
    hashed_password: str
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    role: str = "user"
    # Keep any other existing fields

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str
