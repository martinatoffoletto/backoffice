from fastapi import FastAPI
from rest.controller.usuarios_controller import router as usuarios_router
from rest.controller.roles_controller import router as roles_router
from rest.controller.espacios_controller import router as espacios_router
from rest.controller.parametros_controller import router as parametros_router
from rest.controller.sueldos_controller import router as sueldos_router
from rest.controller.auth_controller import router as auth_router
from rest.controller.jwks_controller import router as jwks_router

app = FastAPI(title="Backoffice API")
API_PREFIX = "/api/v1"
app.include_router(usuarios_router, prefix=API_PREFIX)
app.include_router(roles_router, prefix=API_PREFIX)
app.include_router(espacios_router, prefix=API_PREFIX)
app.include_router(parametros_router, prefix=API_PREFIX)
app.include_router(sueldos_router, prefix=API_PREFIX)
app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(jwks_router, prefix=API_PREFIX)