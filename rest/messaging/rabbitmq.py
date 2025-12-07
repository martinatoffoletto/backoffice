import os
import logging
from aio_pika import connect_robust
from aio_pika.abc import AbstractConnection, AbstractChannel
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# Variables de entorno individuales
RABBITMQ_DEFAULT_USER = os.getenv('RABBITMQ_DEFAULT_USER', 'guest')
RABBITMQ_DEFAULT_PASS = os.getenv('RABBITMQ_DEFAULT_PASS', 'guest')
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
RABBITMQ_PORT = os.getenv('RABBITMQ_PORT', '5672')

# Construir URL de conexión
RABBITMQ_URL = f"amqp://{RABBITMQ_DEFAULT_USER}:{RABBITMQ_DEFAULT_PASS}@{RABBITMQ_HOST}:{RABBITMQ_PORT}"

# Estado global
_connection: AbstractConnection | None = None
_channel: AbstractChannel | None = None


async def get_connection() -> AbstractConnection:
    """Obtener o crear conexión a RabbitMQ"""
    global _connection
    
    if _connection is None or _connection.is_closed:
        try:
            _connection = await connect_robust(RABBITMQ_URL)
            logger.info(f"✅ Conexión a RabbitMQ establecida: {RABBITMQ_HOST}:{RABBITMQ_PORT}")
        except Exception as e:
            logger.error(f"❌ Error conectando a RabbitMQ: {e}")
            raise
    
    return _connection


async def get_channel() -> AbstractChannel:
    """Obtener o crear canal de RabbitMQ"""
    global _channel
    
    if _channel is None or _channel.is_closed:
        connection = await get_connection()
        _channel = await connection.channel()
        logger.info("✅ Canal de RabbitMQ creado")
    
    return _channel


async def close_connection():
    """Cerrar conexión a RabbitMQ"""
    global _connection, _channel
    
    if _channel and not _channel.is_closed:
        await _channel.close()
        _channel = None
    
    if _connection and not _connection.is_closed:
        await _connection.close()
        _connection = None
    
    logger.info("✅ Conexión a RabbitMQ cerrada")


def get_connection_status():
    """Obtener estado de la conexión"""
    return {
        "connected": _connection is not None and not _connection.is_closed if _connection else False,
        "channel_active": _channel is not None and not _channel.is_closed if _channel else False
    }

