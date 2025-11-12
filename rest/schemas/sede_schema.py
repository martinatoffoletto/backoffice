from pydantic import BaseModel, Field
from typing import Optional
import uuid


class Sede(BaseModel):
    id_sede: Optional[uuid.UUID] = Field(None, description="Identificador único de la sede")
    nombre: str = Field(..., max_length=100, description="Nombre único de la sede")
    ubicacion: str = Field(..., description="Dirección o detalle físico de la sede")
    status: bool = Field(True, description="Estado de la sede (activo/inactivo)")

    class Config:
        from_attributes = True


class SedeCreate(BaseModel):
    nombre: str = Field(..., max_length=100, description="Nombre único de la sede")
    ubicacion: str = Field(..., description="Dirección o detalle físico de la sede")

    class Config:
        from_attributes = True


class SedeUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=100, description="Nombre único de la sede")
    ubicacion: Optional[str] = Field(None, description="Dirección o detalle físico de la sede")
    status: Optional[bool] = Field(None, description="Estado de la sede (activo/inactivo)")

    class Config:
        from_attributes = True
