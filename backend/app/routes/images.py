from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import io
from app.services.image_service import get_image_data

router = APIRouter()

@router.get("/images")
async def get_image(path: str):
    """Servir imagen dinámicamente desde path local o URL externa"""
    try:
        image_data = get_image_data(path)
        return StreamingResponse(io.BytesIO(image_data), media_type="image/jpeg")
    
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")