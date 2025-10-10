from pydantic import BaseModel, Field
from typing import Optional


class UsuarioRol(BaseModel):
    id_usuario: int = Field(..., description="ID del usuario")
    id_rol: int = Field(..., description="ID del rol")

    class Config:
        from_attributes = True


# Schema adicional para obtener información completa del usuario con sus roles
class UsuarioConRoles(BaseModel):
    id_usuario: int
    nombre: str
    apellido: str
    legajo: str
    roles: list[str] = Field(default_factory=list, description="Lista de nombres de roles del usuario")

    class Config:
        from_attributes = True
