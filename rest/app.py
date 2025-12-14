import asyncio
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
from .controller.sedes_controller import router as sedes_router
from .controller.usuarios_carreras_controller import router as usuarios_carreras_router
from .controller.clases_individuales_controller import router as clases_individuales_router

# Importar funciones de base de datos
from .database import init_database, close_database

# Importar funciones de RabbitMQ
from .messaging.rabbitmq import get_connection, close_connection
from .messaging.consumer import EventConsumer
from .messaging.handlers.proposal_handler import handle_proposal_event

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: abrir conexión a la base de datos
    await init_database()
    
    # Startup: inicializar RabbitMQ (opcional, no falla si no está disponible)
    consumer_task = None
    try:
        await get_connection()
        
        # Iniciar consumidor de eventos de propuestas en background
        async def start_proposal_consumer():
            """Inicia el consumidor de eventos de propuestas"""
            try:
                await EventConsumer.consume(
                    queue_name="backoffice.queue",
                    callback=handle_proposal_event,
                    exchange_name="proposal.event",
                    routing_key="proposal.created",
                    durable=True
                )
            except asyncio.CancelledError:
                print("🛑 Consumidor de propuestas cancelado")
                raise
            except Exception as e:
                print(f"⚠️ Error en consumidor de propuestas: {e}")
        
        # Ejecutar consumidor en background
        consumer_task = asyncio.create_task(start_proposal_consumer())
        print("✅ Consumidor de eventos de propuestas iniciado") # DEBUG
        
    except Exception as e:
        print(f"⚠️ RabbitMQ no disponible (modo sin colas): {e}")
    
    yield
    
    # Shutdown: cerrar conexión a la base de datos
    await close_database()
    
    # Shutdown: cerrar conexión a RabbitMQ
    try:
        await close_connection()
    except Exception:
        pass

app = FastAPI(title="API de BackOffice", version="1.0.0", lifespan=lifespan)

# Configurar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # React dev server alternativo
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://backoffice-production-ui.up.railway.app", 
        "https://backoffice-production-df78.up.railway.app"
        
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permite todos los headers
)

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
