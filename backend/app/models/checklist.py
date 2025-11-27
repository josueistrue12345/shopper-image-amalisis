from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

from bson import ObjectId

class UnitType(BaseModel):
    id: ObjectId = Field(alias="_id")
    name: str
    enable: Optional[bool] = False

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
        }

class Unit(UnitType):
    typeUnity: ObjectId
    storeCode: str
    email: str

class Evidencia(BaseModel):
    id: Optional[str] = ""
    type: Optional[int] = 0
    path: Optional[str] = ""
    name: Optional[str] = ""

class Complemento(BaseModel):
    nombre: Optional[str] = ""
    enable: Optional[bool] = False
    evidences: Optional[List[Evidencia]] = []

class ListResponse(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    complements: Optional[List[Complemento]] = []

class Response(BaseModel):
    evaluativeOptions: Optional[List[ListResponse]] = []
    listSelected: Optional[List[ListResponse]] = []

class Item(BaseModel):
    id: str
    type: str
    description: Optional[str] = ""
    complements: Optional[List[Complemento]] = []
    response: Optional[Response] = None

class Area(BaseModel):
    id: ObjectId = Field(alias="_id")
    name: Optional[str] = None
    description: Optional[str] = None
    items: Optional[List[Item]] = []

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
        }

class Checklist(BaseModel):
    id: ObjectId = Field(alias="_id")
    status: str
    title: str
    dateApplyed: datetime
    areas: List[Area] = []
    checkApply: Optional[ObjectId] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat(),
        }

class Form(BaseModel):
    id: ObjectId = Field(alias="_id")
    title: str
    areas: List[Area] = []

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
        }

class ReplieInfo(BaseModel):
    replie: Checklist
    store: Unit
