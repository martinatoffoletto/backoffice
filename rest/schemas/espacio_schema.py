from pydantic import BaseModel

class EspacioCreate(BaseModel):
    type: str
    name: str
    description: str

class EspacioUpdate(BaseModel):
    type: str
    name: str
    description: str
