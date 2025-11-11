from pydantic import BaseModel, Field
import uuid

class UsuarioCarreraCreate(BaseModel):
    id_usuario: uuid.UUID = Field(..., description="UUID del usuario")
    id_carrera: uuid.UUID = Field(..., description="UUID de la carrera (entidad externa)")

class UsuarioCarrera(BaseModel):
    id_usuario: uuid.UUID = Field(..., description="UUID del usuario")
    id_carrera: uuid.UUID = Field(..., description="UUID de la carrera (entidad externa)")
    status: bool = Field(True, description="Estado del registro (activo/inactivo)")

    class Config:
        from_attributes = True