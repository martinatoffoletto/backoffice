from pydantic import BaseModel

class UsuarioCreate(BaseModel):
    email_universitario: str
    password: str
    nombre: str
    apellido: str
    dni: str
    estado: str
    role_id: str

class UsuarioUpdate(BaseModel):
    email_universitario: str
    password: str
    nombre: str
    apellido: str
    dni: str
    estado: str
    role_id: str
