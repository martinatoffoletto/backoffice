from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(tags=["JWKS"], prefix="/.well-known")

@router.get("/jwks.json", summary="Obtener JWKS", response_description="JSON Web Key Set")
async def get_jwks():
    """Expone las claves públicas para JWT RS256."""
    pass
