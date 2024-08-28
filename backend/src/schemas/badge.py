from pydantic import BaseModel, ConfigDict

class BadgeCreate(BaseModel):
    name: str
    description: str
    points_required: int

class BadgeInDB(BadgeCreate):
    id: str

    model_config = ConfigDict(from_attributes=True)