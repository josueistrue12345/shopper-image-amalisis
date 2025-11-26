from fastapi import APIRouter, HTTPException
from typing import List
from bson import ObjectId
from datetime import datetime

router = APIRouter()
from app.core.database import analysis_db as db
from app.models.prompt import Prompt, PromptBase, PromptCreate

collection = db["prompts"]

@router.post("/prompts", response_model=Prompt)
async def create_prompt(data: PromptCreate):
    prompt_dict = data.model_dump()
    
    result = collection.insert_one(prompt_dict)
    created = collection.find_one({"_id": result.inserted_id})
    return Prompt(**created)

@router.get("/prompts", response_model=List[Prompt])
async def get_prompts(activo: bool = None):
    filter_dict = {}
    if activo is not None:
        filter_dict["activo"] = activo
    
    prompts = list(collection.find(filter_dict))
    return [Prompt(**prompt) for prompt in prompts]

@router.get("/prompts/{id}", response_model=Prompt)
async def get_prompt(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="ID inválido")
    
    prompt = collection.find_one({"_id": ObjectId(id)})
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt no encontrado")
    
    return Prompt(**prompt)

@router.put("/prompts/{id}", response_model=Prompt)
async def update_prompt(id: str, data: PromptBase):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="ID inválido")
    
    update_dict = data.model_dump(exclude_none=True)
    if update_dict:
        update_dict["updatedAt"] = datetime.now()
        
        result = collection.update_one(
            {"_id": ObjectId(id)}, 
            {"$set": update_dict }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Prompt no encontrado")
    
    updated = collection.find_one({"_id": ObjectId(id)})
    return Prompt(**updated)

@router.delete("/prompts/{id}")
async def delete_prompt(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="ID inválido")
    
    result = collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Prompt no encontrado")
    
    return {"message": "Prompt eliminado correctamente"}