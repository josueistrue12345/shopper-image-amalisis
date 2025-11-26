from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class TipoAnalisisEnum(int, Enum):
    CAMBIOS_PLANOGRAMAS = 1
    LANZAMIENTOS_CAMPANIAS = 2

class StatusAnalisisEnum(str, Enum):
    PENDIENTE = "pendiente"
    PROCESANDO = "procesando"
    COMPLETADO = "completado"
    ERROR = "error"

class ImageData(BaseModel):
    path: str
    name: str
    itemId: Optional[str] = None
    replie: Optional[str] = None
    checkApply: Optional[str] = None
    area: Optional[str] = None

class RuleData(BaseModel):
    id: str
    name: Optional[str] = ""
    references: List[str] = []

class AnalysisRequest(BaseModel):
    images: List[ImageData]
    rules: List[RuleData]

class RuleResult(BaseModel):
    rule_id: str|int
    name: Optional[str] = None
    complies: bool
    details: str
    accuraccy: Optional[float] = None

class ImageAnalysisResult(BaseModel):
    image: ImageData
    rule_results: List[RuleResult]

class AnalysisResult(BaseModel):
    id: str = Field(alias="_id")
    status: StatusAnalisisEnum
    total_images: int
    total_rules: int
    progress: Optional[int] = 0
    image_results: List[ImageAnalysisResult] = []
    error: Optional[str] = None
    createdAt: datetime
    completedAt: Optional[datetime] = None