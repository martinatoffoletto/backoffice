from pydantic import BaseModel

class SueldoCreate(BaseModel):
    userId: str
    amount: float

class SueldoUpdate(BaseModel):
    userId: str
    amount: float
