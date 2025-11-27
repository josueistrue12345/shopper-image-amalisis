from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict
from bson import ObjectId

from app.models.checklist import Checklist, Unit, UnitType, Form, ReplieInfo
from app.core.database import inspect_db as db
from app.models.filter import Filter

router = APIRouter()

def str2id_list(lista: str):
    if not lista:
        return []
    return [ObjectId(i.strip()) for i in lista.split(",") if i.strip() and ObjectId.is_valid(i.strip())]

@router.get("/checklists", response_model=List[Checklist])
async def get_checklists(filtros: Filter = Depends()):
    if(filtros.inicio > filtros.final):
        raise HTTPException(400, "La fecha de inicio no puede ser mayor al final")

    query = {
        "dateApplyed": {
            "$gte": filtros.inicio.isoformat(),
            "$lte": filtros.final.isoformat()
        },
        "status": "Concluido"
    }

    tiendas = []
    if filtros.tiendas:
        tiendas = str2id_list(filtros.tiendas)
    elif filtros.grupos:
        cursor_tienda = db["unities"].find({
            "typeUnity": {
                "$in": str2id_list(filtros.grupos)
            }
        })
        tiendas = [doc["_id"] async for doc in cursor_tienda]

    if len(tiendas) > 0:
        query["unityToApply"] = {
            "$in": tiendas
        }
    cursor = db["replies"].find(query).sort("createdAt", -1)
    return [doc async for doc in cursor]

@router.get("/forms", response_model=List[Form])
async def get_forms(ids: str):
    forms = db["forms"].find({
        "_id": {
            "$in": str2id_list(ids)
        }
    })
    return [doc async for doc in forms]

@router.get("/units")
async def get_units():
    unit_types = db["typeunities"].find({})

    units = db["unities"].find({})

    return {
        "units": [Unit(**doc) async for doc in units],
        "types": [UnitType(**doc) async for doc in unit_types]
    }

@router.get("/replies", response_model=Dict[str, ReplieInfo])
async def get_replies(ids: str):
    replies = db["replies"].find({
        "_id": {"$in": str2id_list(ids) }
    })
    
    result = {}

    async for replie in replies:
        store = await db["unities"].find_one({
            "_id": replie["unityToApply"]
        })
        result[str(replie["_id"])] = {
            "replie": replie,
            "store": store
        }
    
    return result