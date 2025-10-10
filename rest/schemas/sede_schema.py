from pydantic import BaseModel, Field
from typing import Optional


class Sede(BaseModel):
    id_sede: Optional[int] = Field(None, description="Identificador único de la sede")
    nombre: str = Field(..., description="Nombre único de la sede")
    ubicacion: str = Field(..., description="Dirección o detalle físico de la sede")
    status: bool = Field(True, description="Estado de la sede (activo/inactivo)")

    class Config:
        from_attributes = True
