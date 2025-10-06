from pydantic import BaseModel
from ..models.enums import UserRole, UserState

class UsuarioCreate(BaseModel):
    email: str
    password: str
    firstName: str
    lastName: str
    dni: str
    state: UserState = UserState.ACTIVO
    role: UserRole = UserRole.ALUMNO

class UsuarioUpdate(BaseModel):
    email: str
    password: str
    firstName: str
    lastName: str
    dni: str
    state: UserState
    role: UserRole
