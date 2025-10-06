from pydantic import BaseModel, validator
from ..models.enums import Position

class SueldoCreate(BaseModel):
    userId: str
    cbu: str
    position: Position
    baseSalary: float
    yearsOfService: int = 0
    seniorityMultiplier: float = 1.0000
    
    @validator('cbu')
    def validate_cbu(cls, v):
        if len(v) != 22 or not v.isdigit():
            raise ValueError('CBU debe tener exactamente 22 dígitos')
        return v
    
    @validator('yearsOfService')
    def validate_years(cls, v):
        if v < 0:
            raise ValueError('Los años de antigüedad no pueden ser negativos')
        return v
    
    @validator('seniorityMultiplier')
    def validate_multiplier(cls, v):
        if v < 1.0:
            raise ValueError('El multiplicador de antigüedad debe ser mayor o igual a 1.0')
        return v

class SueldoUpdate(BaseModel):
    userId: str
    cbu: str
    position: Position
    baseSalary: float
    yearsOfService: int
    seniorityMultiplier: float
    
    @validator('cbu')
    def validate_cbu(cls, v):
        if len(v) != 22 or not v.isdigit():
            raise ValueError('CBU debe tener exactamente 22 dígitos')
        return v
    
    @validator('yearsOfService')
    def validate_years(cls, v):
        if v < 0:
            raise ValueError('Los años de antigüedad no pueden ser negativos')
        return v
    
    @validator('seniorityMultiplier')
    def validate_multiplier(cls, v):
        if v < 1.0:
            raise ValueError('El multiplicador de antigüedad debe ser mayor o igual a 1.0')
        return v
