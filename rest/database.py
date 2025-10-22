import os
import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import text  
from dotenv import load_dotenv
from .models.base import Base
from . import models

load_dotenv()
logger = logging.getLogger(__name__)
DATABASE_HOST = os.getenv('DATABASE_HOST', 'localhost')
DATABASE_PORT = os.getenv('DATABASE_PORT', '5432')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'backoffice_db')
DATABASE_USER = os.getenv('DATABASE_USER', 'postgres')
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD', '')

DISABLE_DATABASE = os.getenv('DISABLE_DATABASE', 'false').lower() == 'true'

DATABASE_URL = f"postgresql+asyncpg://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"

# Initialize engine and session only if database is enabled
engine = None
AsyncSessionLocal = None

if not DISABLE_DATABASE:
    engine = create_async_engine(DATABASE_URL, echo=False)
    AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def init_database():
    if DISABLE_DATABASE:
        logger.warning("⚠️ Database is disabled via DISABLE_DATABASE environment variable")
        print("⚠️ Database is disabled - running without database")
        return
        
    if not engine:
        logger.error("❌ Database engine not initialized")
        return
        
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print(f"✓ Database connected: {DATABASE_NAME}")
        await list_tables()
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        print(f"⚠️ Database connection failed: {e}")
        print("🔄 Application will continue without database")
        # Don't raise the exception - let app continue

async def list_tables():
    if DISABLE_DATABASE or not engine:
        return
        
    try:
        async with engine.begin() as conn:
            result = await conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """))
            tables = result.fetchall()
            
            if tables:
                print("✅ Tables found:")
                for table in tables:
                    print(f"   📋 {table[0]}")
            else:
                print("⚠️ No tables found in database")
                
    except Exception as e:
        logger.error(f"Error listing tables: {e}")
        print(f"❌ Error listing tables: {e}")

async def get_db():
    if DISABLE_DATABASE or not AsyncSessionLocal:
        # Return a mock session that does nothing
        yield MockDatabaseSession()
        return
        
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Database session error: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()

async def close_database():
    if DISABLE_DATABASE or not engine:
        print("✓ No database connection to close")
        return
        
    try:
        await engine.dispose()
        print("✓ Database connection closed")
    except Exception as e:
        logger.error(f"Error closing database: {e}")
        print(f"❌ Error closing database: {e}")

# Mock database session for when database is disabled
class MockDatabaseSession:
    """Mock database session that does nothing when database is disabled"""
    
    async def add(self, instance):
        logger.warning("Database disabled - add operation ignored")
        
    async def commit(self):
        logger.warning("Database disabled - commit operation ignored")
        
    async def rollback(self):
        logger.warning("Database disabled - rollback operation ignored")
        
    async def refresh(self, instance):
        logger.warning("Database disabled - refresh operation ignored")
        
    async def execute(self, statement):
        logger.warning("Database disabled - execute operation ignored")
        return MockResult()
        
    async def close(self):
        pass

class MockResult:
    """Mock result for database queries when database is disabled"""
    
    def fetchall(self):
        return []
        
    def fetchone(self):
        return None
        
    def first(self):
        return None
        
    def scalar(self):
        return None