import os
import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import text
from dotenv import load_dotenv
from .models.base import Base
from . import models 

load_dotenv()
logger = logging.getLogger(__name__)

ENVIRONMENT = os.getenv('ENVIRONMENT', 'production').lower()
HOSTED_DATABASE_URL = os.getenv('HOSTED_DATABASE_URL', '')
LOCAL_DATABASE_URL = os.getenv('DATABASE_URL', '')

engine = None
AsyncSessionLocal = None
CONNECTION_TYPE = "No inicializado"


def _normalize_to_asyncpg(url: str) -> str:
    if not url:
        return url
    if url.startswith("postgres://"):
        return "postgresql+asyncpg://" + url[len("postgres://"):]
    if url.startswith("postgresql://"):
        return "postgresql+asyncpg://" + url[len("postgresql://"):]
    return url


async def _test_connection(url: str) -> bool:
    try:
        test_engine = create_async_engine(
            url, 
            echo=False,
            connect_args={"ssl": True} if "render.com" in url else {}
        )
        async with test_engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        await test_engine.dispose()
        return True
    except Exception as e:
        logger.warning(f"Connection failed: {e}")
        return False


async def _get_database_url() -> tuple[str, str]:
    if ENVIRONMENT == 'development':
        if HOSTED_DATABASE_URL:
            hosted_url = _normalize_to_asyncpg(HOSTED_DATABASE_URL)
            if await _test_connection(hosted_url):
                return hosted_url, "Hosteada (Render)"
        
        if LOCAL_DATABASE_URL:
            local_url = _normalize_to_asyncpg(LOCAL_DATABASE_URL)
            if await _test_connection(local_url):
                return local_url, "Local"
        
        return "", "Mock (desarrollo)"
    
    else:  # PRODUCTION
        render_url = os.getenv('DATABASE_URL', HOSTED_DATABASE_URL).strip()
        if render_url:
            normalized_url = _normalize_to_asyncpg(render_url)
            if await _test_connection(normalized_url):
                return normalized_url, "Hosteada (Producción)"
        
        return "", "Mock (producción - error)"


async def init_database():
    global engine, AsyncSessionLocal, CONNECTION_TYPE
    
    try:
        database_url, connection_type = await _get_database_url()
        CONNECTION_TYPE = connection_type
        
        if database_url:
            connect_args = {}
            if "render.com" in database_url:
                connect_args["ssl"] = True
                
            engine = create_async_engine(
                database_url,
                echo=False,
                pool_pre_ping=True,
                pool_recycle=1800,
                connect_args=connect_args
            )
            AsyncSessionLocal = async_sessionmaker(
                engine, 
                class_=AsyncSession, 
                expire_on_commit=False
            )
            
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
                
            print(f"✅ Base de datos inicializada: {CONNECTION_TYPE}")
            await _list_tables()
            
        else:
            print("🔄 Ejecutando en modo mock")
            
    except Exception as e:
        logger.error(f"Error inicializando base de datos: {e}")
        print("🔄 Continuando en modo mock")
        CONNECTION_TYPE = "Mock (error en inicialización)"


async def _list_tables():
    if not engine:
        return
    try:
        async with engine.begin() as conn:
            result = await conn.execute(text("""
                SELECT table_name FROM information_schema.tables 
                WHERE table_schema = 'public' ORDER BY table_name;
            """))
            tables = result.fetchall()
            if tables:
                print("📋 Tablas encontradas:")
                for table in tables:
                    print(f"   • {table[0]}")
    except Exception as e:
        logger.error(f"Error listando tablas: {e}")


async def get_async_db():
    if not AsyncSessionLocal:
        yield MockDatabaseSession()
        return
        
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Error en sesión de base de datos: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()


async def close_database():
    global engine
    if engine:
        try:
            await engine.dispose()
            print("✅ Conexión cerrada")
        except Exception as e:
            logger.error(f"Error cerrando base de datos: {e}")


def get_connection_status():
    return {
        "type": CONNECTION_TYPE,
        "engine_active": engine is not None,
        "session_active": AsyncSessionLocal is not None
    }


class MockDatabaseSession:
    async def add(self, instance): pass
    async def commit(self): pass
    async def rollback(self): pass
    async def refresh(self, instance): pass
    async def execute(self, statement): return MockResult()
    async def close(self): pass


class MockResult:
    def fetchall(self): return []
    def fetchone(self): return None
    def first(self): return None
    def scalar(self): return None
    def scalar_one_or_none(self): return None
    def scalars(self): return MockScalars()


class MockScalars:
    def all(self): return []
    def first(self): return None