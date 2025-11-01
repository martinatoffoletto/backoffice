import json
import logging
from typing import Callable, Optional
from aio_pika import IncomingMessage
from .rabbitmq import get_channel

logger = logging.getLogger(__name__)


class EventConsumer:
    """Clase para consumir mensajes de RabbitMQ"""
    
    @staticmethod
    async def consume(
        queue_name: str,
        callback: Callable[[dict], None],
        exchange_name: Optional[str] = None,
        routing_key: Optional[str] = None,
        durable: bool = True
    ):
        """
        Configurar consumo de una cola
        
        Args:
            queue_name: Nombre de la cola
            callback: Función async que procesa el mensaje (recibe un dict)
            exchange_name: Exchange (opcional)
            routing_key: Routing key para bind (opcional)
            durable: Si la cola persiste después de reinicios
        """
        try:
            channel = await get_channel()
            
            # Declarar exchange si se especifica
            exchange = None
            if exchange_name:
                exchange = await channel.declare_exchange(
                    exchange_name,
                    type="topic",
                    durable=True
                )
            
            # Declarar cola
            queue = await channel.declare_queue(queue_name, durable=durable)
            
            # Bind con exchange si existe
            if exchange and routing_key:
                await queue.bind(exchange, routing_key=routing_key)
            
            logger.info(f"✅ Consumiendo cola: {queue_name}")
            
            # Consumir mensajes
            async with queue.iterator() as queue_iter:
                async for message in queue_iter:
                    async with message.process():
                        try:
                            # Deserializar mensaje
                            message_data = json.loads(message.body.decode())
                            
                            # Procesar con callback
                            await callback(message_data)
                            
                        except Exception as e:
                            logger.error(f"❌ Error procesando mensaje: {e}")
                            # Rechazar mensaje y no requeue si hay error
                            await message.nack(requeue=False)
                            
        except Exception as e:
            logger.error(f"❌ Error configurando consumidor: {e}")
            raise

