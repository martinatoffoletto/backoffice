from pydantic import BaseModel

class UsuarioCreate(BaseModel):
    email: str
    password: str
    firstName: str
    lastName: str
    dni: str
    state: str
    roleId: str

class UsuarioUpdate(BaseModel):
    email: str
    password: str
    firstName: str
    lastName: str
    dni: str
    state: str
    roleId: str
