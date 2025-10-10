from pydantic import BaseModel, Field
from typing import Optional


class Rol(BaseModel):
    id_rol: Optional[int] = Field(None, description="Identificador único del rol")
    nombre_rol: str = Field(..., description="Nombre único del rol")
    descripcion: Optional[str] = Field(None, description="Descripción opcional del rol")
    status: bool = Field(True, description="Estado del rol (activo/inactivo)")

    class Config:
        from_attributes = True
