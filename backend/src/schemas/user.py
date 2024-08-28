from pydantic import BaseModel, ConfigDict, EmailStr
from ..models import UserRole

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserInDB(BaseModel):
    id: str
    username: str
    email: str
    role: UserRole
    is_blocked: bool
    score: int
    is_approved: bool
    is_active: bool = True

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str