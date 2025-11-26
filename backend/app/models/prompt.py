from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId
from datetime import datetime

class PromptBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    text: Optional[str] = None
    with_references: Optional[bool] = None
    type: Optional[str] = ""
    enabled: Optional[bool] = True

class PromptCreate(PromptBase):
    title: str
    description: str
    text: str

class Prompt(PromptBase):
    id: Optional[ObjectId] = Field(alias="_id", default_factory=ObjectId)
    createdAt: Optional[datetime] = Field(default_factory=datetime.now)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.now)
    
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
        }