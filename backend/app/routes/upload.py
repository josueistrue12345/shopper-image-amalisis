from fastapi import APIRouter, HTTPException, UploadFile, File
from PIL import Image
import uuid
import io
from pathlib import Path

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Subir archivo con compresión de imagen"""
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")
    
    # Generar nombre único
    file_id = str(uuid.uuid4())
    file_extension = Path(file.filename).suffix
    filename = f"{file_id}{file_extension}"
    file_path = UPLOAD_DIR / filename
    
    try:
        content = await file.read()
        
        with Image.open(io.BytesIO(content)) as img:
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # Guardar con compresión del 80%
            img.save(file_path, format='JPEG', quality=80, optimize=True)
        
        return {
            "path": f"/uploads/{filename}",
            "message": "Imagen subida y comprimida exitosamente"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar imagen: {str(e)}")