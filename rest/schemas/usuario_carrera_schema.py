from pydantic import BaseModel, Field
from uuid import UUID

class UsuarioCarrera(BaseModel):
    id_usuario: UUID = Field(..., description="ID del usuario (UUID)")
    id_carrera: UUID = Field(..., description="ID de la carrera (UUID)")

    class Config:
        from_attributes = True
