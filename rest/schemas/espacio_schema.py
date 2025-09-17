from pydantic import BaseModel

class EspacioCreate(BaseModel):
    type: str
    code: str
    name: str
    description: str
    capacity: int | None = None
    address: str | None = None

class EspacioUpdate(BaseModel):
    type: str
    code: str
    name: str
    description: str
    capacity: int | None = None
    address: str | None = None

