from fastapi import APIRouter, HTTPException
import uuid

from app.models.analysis import AnalysisRequest, StatusAnalisisEnum
from app.tasks.analysis_tasks import process_image_analysis
from app.core.database import analysis_db as db

from app.models.analysis import AnalysisResult
from typing import List

router = APIRouter()

@router.post("/analysis")
async def start_analysis(request: AnalysisRequest):
    """Iniciar análisis de imágenes"""

    if len(request.images) == 0 or len(request.rules) == 0:
        raise HTTPException(400, "Debe enviar una lista de imagenes y reglas de análisis")

    analysis_id = str(uuid.uuid4())
    result = {
        "id": analysis_id,
        "status": StatusAnalisisEnum.PROCESANDO
    }
    
    process_image_analysis.delay(analysis_id, request.model_dump())
    return result

@router.get("/analysis/{id}", response_model=AnalysisResult)
async def get_analysis(id: str):
    data = db["results"].find_one({
        "_id": id
    })

    return data

@router.get("/analysis", response_model=List[AnalysisResult])
async def get_lista():
    data = db["results"].find({}).sort({
        "createdAt": -1
    })

    return data