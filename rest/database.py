import asyncpg
import os
from dotenv import load_dotenv
from fastapi import HTTPException

# Cargar variables de entorno
load_dotenv()

# Pool de conexiones
connection_pool = None

async def init_database():
    """Inicializa el pool de conexiones a la base de datos PostgreSQL"""
    global connection_pool
    
    # Configuración de la base de datos
    DATABASE_HOST = os.getenv('DATABASE_HOST', 'localhost')
    DATABASE_PORT = os.getenv('DATABASE_PORT', '5432')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'backoffice_db')
    DATABASE_USER = os.getenv('DATABASE_USER', 'postgres')
    DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD', '')
    
    # Si no hay configuración de DB en producción, no intentar conectar
    if not DATABASE_PASSWORD and os.getenv('ENVIRONMENT') == 'production':
        print("⚠️ Base de datos no configurada en producción. Ejecutando sin DB.")
        return
    
    try:
        connection_pool = await asyncpg.create_pool(
            host=DATABASE_HOST,
            port=DATABASE_PORT,
            database=DATABASE_NAME,
            user=DATABASE_USER,
            password=DATABASE_PASSWORD,
            min_size=1,
            max_size=10
        )
        print(f"✓ Conexión exitosa a la base de datos: {DATABASE_NAME}")
        await list_existing_tables()
        
    except Exception as e:
        print(f"⚠️ No se pudo conectar a la base de datos: {e}")
        print("📱 La aplicación seguirá ejecutándose sin base de datos")
        # No hacer raise, permitir que la app siga

async def get_db():
    """Dependency para obtener una conexión a la base de datos"""
    if connection_pool is None:
        raise HTTPException(
            status_code=503, 
            detail="Base de datos no disponible"
        )
    
    async with connection_pool.acquire() as connection:
        yield connection

async def list_existing_tables():
    """Lista todas las tablas existentes en la base de datos"""
    if connection_pool is None:
        print("✗ Pool de conexiones no inicializado")
        return []
    
    try:
        async with connection_pool.acquire() as connection:
            # Consulta para obtener todas las tablas del esquema public
            query = """
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                ORDER BY table_name;
            """
            rows = await connection.fetch(query)
            tables = [row['table_name'] for row in rows]
            
            if tables:
                print(f"📋 Tablas encontradas en la base de datos ({len(tables)}):")
                for table in tables:
                    print(f"   • {table}")
            else:
                print("📋 No se encontraron tablas en la base de datos")
            
            return tables
            
    except Exception as e:
        print(f"✗ Error al listar las tablas: {e}")
        return []

async def close_database():
    """Cierra el pool de conexiones a la base de datos"""
    global connection_pool
    
    if connection_pool:
        await connection_pool.close()
        print("✓ Conexión a la base de datos cerrada")

def get_connection_pool():
    """Retorna el pool de conexiones actual"""
    print( "Returning connection pool:", connection_pool)
    return connection_pool

