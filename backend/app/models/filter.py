from pydantic import BaseModel
from typing import Optional, List
from datetime import date

from fastapi import Query

class Filter(BaseModel):
    inicio: date
    final: date
    tiendas: Optional[str] = None
    grupos: Optional[str] = None
