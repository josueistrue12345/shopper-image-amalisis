import httpx
import redis
import hashlib
from pathlib import Path
from app.core.config import Settings

UPLOAD_DIR = Path("uploads")
redis_client = redis.from_url(Settings.REDIS_URL) if Settings.REDIS_URL else None
CACHE_TTL = 86400

def get_image_data(path: str) -> bytes:
    """Obtener datos de imagen desde path local o externa con cache"""
    
    # Imagen local
    if path.startswith("/uploads"):
        local_path = UPLOAD_DIR / path.replace("/uploads/", "")
        if not local_path.exists():
            raise FileNotFoundError("Imagen no encontrada")
        
        with open(local_path, "rb") as f:
            return f.read()
    
    # Imagen externa con cache
    cache_key = f"img:{hashlib.md5(path.encode()).hexdigest()}"
    
    if redis_client:
        cached_data = redis_client.get(cache_key)
        if cached_data:
            print("Cache", cache_key)
            return cached_data
    else: 
        print("Redis not available")
    
    # Obtener de S3
    with httpx.Client() as client:
        sign_response = client.get(Settings.AUTH_S3_URL, params={"path": path})
        sign_response.raise_for_status()
        
        if not sign_response.text.strip():
            raise ValueError("Respuesta vacía")
        
        try:
            signed_url = sign_response.json().get("urls")
        except ValueError as e:
            raise ValueError(f"Respuesta inválida: {sign_response.text[:100]}")
        
        if not signed_url or not signed_url[0]:
            raise ValueError("No se pudo firmar la URL")
        
        image_response = client.get(signed_url[0])
        image_response.raise_for_status()
        
        image_data = image_response.content
        
        if redis_client:
            print("Saved response", cache_key)
            redis_client.setex(cache_key, CACHE_TTL, image_data)
        
        return image_data