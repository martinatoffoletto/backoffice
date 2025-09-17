from pydantic import BaseModel

class EspacioCreate(BaseModel):
    tipo: str
    nombre: str
    descripcion: str

class EspacioUpdate(BaseModel):
    tipo: str
    nombre: str
    descripcion: str
