from pydantic import BaseModel
from ..models.enums import UserRole, UserState

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthPayload(BaseModel):
    userId: str
    email: str
    firstName: str
    lastName: str
    dni: str
    role: UserRole
    state: UserState
    message: str = "Authentication successful"