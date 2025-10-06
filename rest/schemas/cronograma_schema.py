from pydantic import BaseModel, validator
from typing import List, Optional
from datetime import date, time
from ..models.enums import DayOfWeek, EvaluationType

class ClaseIndividualCreate(BaseModel):
    classNumber: int
    dayOfWeek: DayOfWeek
    classDate: date
    topic: Optional[str] = None
    
    @validator('classNumber')
    def validate_class_number(cls, v):
        if v <= 0:
            raise ValueError('El número de clase debe ser mayor a 0')
        return v

class ClaseIndividualUpdate(BaseModel):
    classNumber: int
    dayOfWeek: DayOfWeek
    classDate: date
    topic: Optional[str] = None
    
    @validator('classNumber')
    def validate_class_number(cls, v):
        if v <= 0:
            raise ValueError('El número de clase debe ser mayor a 0')
        return v

class EvaluacionCreate(BaseModel):
    name: str
    evaluationType: EvaluationType
    evaluationDate: date
    startTime: Optional[time] = None
    endTime: Optional[time] = None
    description: Optional[str] = None
    weight: int = 100
    
    @validator('weight')
    def validate_weight(cls, v):
        if v < 0 or v > 100:
            raise ValueError('El peso debe estar entre 0 y 100')
        return v

class EvaluacionUpdate(BaseModel):
    name: str
    evaluationType: EvaluationType
    evaluationDate: date
    startTime: Optional[time] = None
    endTime: Optional[time] = None
    description: Optional[str] = None
    weight: int = 100
    
    @validator('weight')
    def validate_weight(cls, v):
        if v < 0 or v > 100:
            raise ValueError('El peso debe estar entre 0 y 100')
        return v

class CronogramaCreate(BaseModel):
    courseId: str
    courseName: str
    totalClasses: int
    startDate: date
    endDate: date
    startTime: time
    endTime: time
    classes: List[ClaseIndividualCreate] = []
    evaluations: List[EvaluacionCreate] = []
    
    @validator('totalClasses')
    def validate_total_classes(cls, v):
        if v <= 0:
            raise ValueError('La cantidad total de clases debe ser mayor a 0')
        return v
    
    @validator('endDate')
    def validate_dates(cls, v, values):
        if 'startDate' in values and v <= values['startDate']:
            raise ValueError('La fecha de fin debe ser posterior a la fecha de inicio')
        return v
    
    @validator('endTime')
    def validate_times(cls, v, values):
        if 'startTime' in values and v <= values['startTime']:
            raise ValueError('La hora de fin debe ser posterior a la hora de inicio')
        return v

class CronogramaUpdate(BaseModel):
    courseId: str
    courseName: str
    totalClasses: int
    startDate: date
    endDate: date
    startTime: time
    endTime: time
    classes: List[ClaseIndividualUpdate] = []
    evaluations: List[EvaluacionUpdate] = []
    
    @validator('totalClasses')
    def validate_total_classes(cls, v):
        if v <= 0:
            raise ValueError('La cantidad total de clases debe ser mayor a 0')
        return v
    
    @validator('endDate')
    def validate_dates(cls, v, values):
        if 'startDate' in values and v <= values['startDate']:
            raise ValueError('La fecha de fin debe ser posterior a la fecha de inicio')
        return v
    
    @validator('endTime')
    def validate_times(cls, v, values):
        if 'startTime' in values and v <= values['startTime']:
            raise ValueError('La hora de fin debe ser posterior a la hora de inicio')
        return v