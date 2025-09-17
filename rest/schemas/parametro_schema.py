from pydantic import BaseModel
from typing import Any

class ParametroCreate(BaseModel):
    scope: str
    key: str
    value_json: Any
    is_active: bool

class ParametroUpdate(BaseModel):
    scope: str
    key: str
    value_json: Any
    is_active: bool
