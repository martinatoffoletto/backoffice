from pydantic import BaseModel
from typing import Any

class ParametroCreate(BaseModel):
    scope: str
    key: str
    valueJson: Any
    isActive: bool

class ParametroUpdate(BaseModel):
    scope: str
    key: str
    valueJson: Any
    isActive: bool
