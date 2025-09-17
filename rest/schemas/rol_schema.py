from pydantic import BaseModel

class RolCreate(BaseModel):
    code: str
    name: str
    description: str

class RolUpdate(BaseModel):
    code: str
    name: str
    description: str
