from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(tags=["Auth"], prefix="/auth")

@router.post("/token", summary="Emitir token JWT", response_description="Token JWT emitido")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Verifica credenciales y emite un token JWT."""
    pass


