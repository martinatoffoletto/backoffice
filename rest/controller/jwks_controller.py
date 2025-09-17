from fastapi import APIRouter, status, Depends
from rest.service.auth_service import get_current_user
from fastapi.responses import JSONResponse

router = APIRouter(tags=["JWKS"], prefix="/.well-known")

@router.get(
    "/jwks.json",
    summary="Obtener JWKS",
    description="Expone las claves públicas para JWT RS256 en formato JWKS (JSON Web Key Set).\n\nEste endpoint permite a los clientes obtener las claves públicas necesarias para validar la firma de los tokens JWT emitidos por nosotros.\n\nFuncionamiento:\n- Nuestro backend firma los JWT usando una clave privada.\n- Los modulos externos pueden consultar este endpoint para obtener la clave pública.\n- Usando la clave pública, pueden verificar que el JWT fue emitido por nosotros y que no fue modificado.\n\nAsí, la clave privada sirve para firmar y la pública para verificar la autenticidad de los tokens.",
    response_description="JSON Web Key Set",
    responses={
        200: {"description": "JWKS obtenido exitosamente"},
        500: {"description": "Error interno del servidor"}
    }
)
async def get_jwks(user=Depends(get_current_user)):
    """Expone las claves públicas para JWT RS256."""
    pass
