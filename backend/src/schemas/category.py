from pydantic import BaseModel, ConfigDict

class CategoryCreate(BaseModel):
    name: str

class CategoryInDB(BaseModel):
    id: str
    name: str

    model_config = ConfigDict(from_attributes=True)