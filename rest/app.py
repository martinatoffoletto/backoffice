from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Importar controllers
from .controller.usuarios_controller import router as usuarios_router
from .controller.roles_controller import router as roles_router
from .controller.espacios_controller import router as espacios_router
from .controller.parametros_controller import router as parametros_router
from .controller.sueldos_controller import router as sueldos_router
from .controller.auth_controller import router as auth_router
from .controller.cronogramas_controller import router as cronogramas_router

# Importar funciones de base de datos
from .database import init_database, close_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: abrir conexión a la base de datos
    await init_database()
    yield
    # Shutdown: cerrar conexión a la base de datos
    await close_database()

app = FastAPI(title="API de BackOffice", version="1.0.0", lifespan=lifespan)

API_PREFIX = "/api/v1"

# Incluir routers
app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(usuarios_router, prefix=API_PREFIX)
app.include_router(roles_router, prefix=API_PREFIX)
app.include_router(espacios_router, prefix=API_PREFIX)
app.include_router(parametros_router, prefix=API_PREFIX)
app.include_router(sueldos_router, prefix=API_PREFIX)
app.include_router(cronogramas_router, prefix=API_PREFIX)
