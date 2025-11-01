from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Importar controllers
from .controller.usuarios_controller import router as usuarios_router
from .controller.roles_controller import router as roles_router
from .controller.espacios_controller import router as espacios_router
from .controller.parametros_controller import router as parametros_router
from .controller.sueldos_controller import router as sueldos_router
from .controller.auth_controller import router as auth_router
from .controller.sedes_controller import router as sedes_router
from .controller.usuarios_carreras_controller import router as usuarios_carreras_router
from .controller.clases_individuales_controller import router as clases_individuales_router

# Importar funciones de base de datos
from .database import init_database, close_database

# Importar funciones de RabbitMQ
from .messaging.rabbitmq import get_connection, close_connection

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: abrir conexión a la base de datos
    await init_database()
    
    # Startup: inicializar RabbitMQ (opcional, no falla si no está disponible)
    try:
        await get_connection()
    except Exception as e:
        logger.warning(f"RabbitMQ no disponible (modo sin colas): {e}")
    
    yield
    
    # Shutdown: cerrar conexión a la base de datos
    await close_database()
    
    # Shutdown: cerrar conexión a RabbitMQ
    try:
        await close_connection()
    except Exception:
        pass

app = FastAPI(title="API de BackOffice", version="1.0.0", lifespan=lifespan)

API_PREFIX = "/api/v1"

# Incluir routers
app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(usuarios_router, prefix=API_PREFIX)
app.include_router(roles_router, prefix=API_PREFIX)
app.include_router(espacios_router, prefix=API_PREFIX)
app.include_router(parametros_router, prefix=API_PREFIX)
app.include_router(sueldos_router, prefix=API_PREFIX)
app.include_router(sedes_router, prefix=API_PREFIX)
app.include_router(usuarios_carreras_router, prefix=API_PREFIX)
app.include_router(clases_individuales_router, prefix=API_PREFIX)
