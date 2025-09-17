from pydantic import BaseModel

class SueldoCreate(BaseModel):
    user_id: str
    monto: float
    fecha_desde: str
    fecha_hasta: str = None

class SueldoUpdate(BaseModel):
    user_id: str
    monto: float
    fecha_desde: str
    fecha_hasta: str = None
