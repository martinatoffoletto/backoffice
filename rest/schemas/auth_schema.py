from pydantic import BaseModel, EmailStr
from typing import List

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    nombre: str
    apellido: str
    legajo: str
    roles: List[str]
    
    class Config:
        from_attributes = True