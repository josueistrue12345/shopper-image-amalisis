from typing import List

from google import genai
from google.genai import types

from PIL import Image
import io
from app.models.analysis import RuleResult, ImageAnalysisResult, ImageData
from app.core.config import Settings
from app.core.database import analysis_db as db
from app.services.image_service import get_image_data
from datetime import datetime

from bson import ObjectId
from app.core.broadcast import send_message
import os
import json

class GeminiService:
    def __init__(self):
        self.api_key = Settings.GEMINI_API_KEY
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
            self.model_name = "gemini-2.5-flash"
    
    def get_rule_prompt(self, rule_id: str, reference_images: List[str]) -> str:
        """Obtener prompt específico para cada regla"""
        data = db["prompts"].find_one({
            "_id": ObjectId(rule_id)
        })
        if not data:
            raise Exception(f"Prompt no encontrado para la regla {rule_id}")
        prompt = data["text"] if 'text' in data else "Analiza esta imagen."

        response_format_path = os.path.join(os.path.dirname(__file__), "respuesta.txt")
        try:
            with open(response_format_path, 'r', encoding='utf-8') as f:
                response_format = f.read().strip()
            prompt += f"\n\n{response_format}"
        except FileNotFoundError:
            prompt += "\n\nFormato de respuesta: JSON"

        if reference_images:
            prompt += f"\n\nTienes {len(reference_images)} imágenes de referencia"
        
        return prompt
    
    def analyze_image_with_rules(self, image: dict, rules: List[dict], analysis_id: str = None, current_image: int = 0, total_images: int = 1) -> ImageAnalysisResult:
        """Analizar una imagen con múltiples reglas"""
        
        if not self.api_key or not self.client:
            raise Exception(f"GEMINI_API_KEY no configurada")
        
        # Obtener datos de imagen
        image_data = get_image_data(image["path"])
        image_part = types.Part.from_bytes(
            data=image_data,
            mime_type="image/jpeg" 
        )
        rule_results = []
        
        for rule in rules:
            rule_id = rule["id"]
            reference_images = rule.get("references", [])
            
            # Generar prompt y analizar con Gemini
            prompt = self.get_rule_prompt(rule_id, reference_images)
            contents = [prompt, image_part]
            
            # Agregar imágenes de referencia si existen
            if reference_images:
                for ref_path in reference_images:
                    try:
                        ref_data = get_image_data(ref_path)
                        ref_part = types.Part.from_bytes(
                            data=ref_data,
                            mime_type="image/jpeg"
                        )
                        contents.append(ref_part)
                    except Exception as e:
                        print(f"Error cargando imagen de referencia {ref_path}: {e}")
            
            try:
                # Generar contenido con imagen y prompt
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=contents
                )
                if response.text:
                    try:
                        # Parser JSON
                        json_response = json.loads(response.text)
                        complies = json_response.get("complies", False)
                        details = json_response.get("description", response.text)
                        confidence = float(json_response.get("accuracy", 0.0))
                    except json.JSONDecodeError:
                        complies = "sí cumple" in response.text.lower()
                        details = response.text
                        confidence = 0.5
                else:
                    complies = False
                    details = "No se recibió respuesta del modelo"
                    confidence = 0.0
                
            except Exception as e:
                complies = False
                details = f"Error en análisis: {str(e)}"
                confidence = 0.0
            
            rule_result = RuleResult(
                rule_id=rule_id,
                name=rule["name"],
                complies=complies,
                details=details,
                accuraccy=confidence
            )
            
            rule_results.append(rule_result)
        
        # Actualizar progreso
        if analysis_id:
            progress = int((current_image / total_images) * 100)
            db["results"].update_one(
                {"_id": analysis_id},
                {
                    "$set": {
                        "progress": progress,
                        "updatedAt": datetime.now()
                    }
                }
            )
            send_message(analysis_id, str(progress))
        
        result = ImageAnalysisResult(
            image=ImageData(**image),
            rule_results=rule_results
        )
        
        # Actualizar resultado
        if analysis_id:
            db["results"].update_one(
                {"_id": analysis_id},
                {
                    "$push": {"image_results": result.model_dump()},
                    "$set": {"updatedAt": datetime.now()}
                }
            )
        
        return result