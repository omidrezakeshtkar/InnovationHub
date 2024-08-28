from pydantic import BaseModel, ConfigDict

class FeatureFlagCreate(BaseModel):
    name: str
    is_enabled: bool

class FeatureFlagInDB(FeatureFlagCreate):
    id: str

    model_config = ConfigDict(from_attributes=True)