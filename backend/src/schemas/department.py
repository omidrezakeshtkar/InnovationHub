from pydantic import BaseModel, ConfigDict

class DepartmentCreate(BaseModel):
    name: str

class DepartmentInDB(BaseModel):
    id: str
    name: str

    model_config = ConfigDict(from_attributes=True)