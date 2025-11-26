from app.core.celery_app import celery
from datetime import datetime
from app.services.gemini_service import GeminiService
from app.models.analysis import StatusAnalisisEnum
from app.core.database import analysis_db

@celery.task
def process_image_analysis(analysis_id: str, request_data: dict):
    """Procesar análisis de imágenes en segundo plano"""
    print(f"Iniciando análisis: {analysis_id}")
    
    try:
        # Registrar en BD
        images = request_data["images"]
        rules = request_data["rules"]
        total_images = len(images)
        
        print(f"Total imágenes: {total_images}")
        print("Insertando en BD...")
        result = analysis_db["results"].insert_one({
            "_id": analysis_id,
            "status": StatusAnalisisEnum.PROCESANDO.value,
            "progress": 0,
            "total_images": total_images,
            "total_rules": len(rules),
            "image_results": [],
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })
        print(f"Registrado: {result.inserted_id}")
        
        gemini_service = GeminiService()
        
        for i, image in enumerate(images, 1):
            
            # Analizar imagen con progreso
            gemini_service.analyze_image_with_rules(
                image=image,
                rules=rules,
                analysis_id=analysis_id,
                current_image=i,
                total_images=total_images
            )
        
        # Marcar como completado
        analysis_db["results"].update_one(
            {"_id": analysis_id},
            {
                "$set": {
                    "status": StatusAnalisisEnum.COMPLETADO.value,
                    "progress": 100,
                    "completedAt": datetime.now(),
                    "updatedAt": datetime.now()
                }
            }
        )
        return result.inserted_id
        
    except Exception as e:
        print(f"Error en análisis {analysis_id}: {str(e)}")
        # Marcar como error en BD
        analysis_db["results"].update_one(
            {"_id": analysis_id},
            {
                "$set": {
                    "status": StatusAnalisisEnum.ERROR.value,
                    "error": str(e),
                    "completedAt": datetime.now(),
                    "updatedAt": datetime.now()
                }
            }
        )