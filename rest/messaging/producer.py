import json
import logging
from typing import Optional, Dict, Any
from aio_pika import Message, DeliveryMode
from .rabbitmq import get_channel

logger = logging.getLogger(__name__)


class EventProducer:
    """Clase para publicar mensajes en RabbitMQ"""
    
    @staticmethod
    async def publish(
        message: Dict[str, Any],
        exchange_name: str = "backoffice.events",
        routing_key: str = "",
        queue_name: Optional[str] = None
    ) -> bool:
        """
        Publicar un mensaje en RabbitMQ
        
        Args:
            message: Diccionario con el contenido del mensaje
            exchange_name: Nombre del exchange (default: "backoffice.events")
            routing_key: Routing key para el mensaje
            queue_name: Si se especifica, publica directamente a la cola
        
        Returns:
            True si se publicó correctamente, False en caso contrario
        """
        try:
            channel = await get_channel()
            
            # Si hay queue_name, publicar directamente a la cola
            if queue_name:
                queue = await channel.declare_queue(queue_name, durable=True)
                message_obj = Message(
                    json.dumps(message).encode(),
                    delivery_mode=DeliveryMode.PERSISTENT,
                    content_type="application/json"
                )
                await queue.publish(message_obj)
                logger.info(f"✅ Mensaje publicado a cola: {queue_name}")
                return True
            
            # Si no, usar exchange
            exchange = await channel.declare_exchange(
                exchange_name,
                type="topic",
                durable=True
            )
            
            message_obj = Message(
                json.dumps(message).encode(),
                delivery_mode=DeliveryMode.PERSISTENT,
                content_type="application/json"
            )
            
            await exchange.publish(message_obj, routing_key=routing_key)
            
            logger.info(f"✅ Mensaje publicado: {exchange_name} -> {routing_key}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error publicando mensaje: {e}")
            return False

