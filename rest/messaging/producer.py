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
                
                # Extraer información del evento para logging
                event_id = message.get("eventId", "N/A")
                event_type = message.get("eventType", "N/A")
                
                await queue.publish(message_obj)
                
                logger.info(
                    f"✅ Evento publicado exitosamente a cola: eventId={event_id}, "
                    f"eventType={event_type}, queue={queue_name}"
                )
                return True
            
            # Intentar obtener el exchange existente primero (sin declararlo)
            # Esto DEBERIA funcionar incluso si no tenemos permisos de configuración
            exchange = None
            try:
                # Intentar obtener el exchange existente (sin declararlo)
                exchange = await channel.get_exchange(exchange_name)
                logger.debug(f"✅ Exchange obtenido: {exchange_name}")
            except Exception as get_error:
                # Si no existe, intentar declararlo
                # Esto requiere SI y SOLO SI tenemos permisos de configuración
                try:
                    exchange = await channel.declare_exchange(
                        exchange_name,
                        type="topic",
                        durable=True
                    )
                    logger.debug(f"✅ Exchange declarado: {exchange_name}")
                except Exception as declare_error:
                    # Si falla por permisos de configuración, el exchange probablemente ya existe
                    # Intentar obtenerlo de nuevo (puede que el error inicial fuera temporal)
                    error_msg = str(declare_error)
                    if "ACCESS_REFUSED" in error_msg or "configure access" in error_msg.lower():
                        logger.warning(f"⚠️ Sin permisos para declarar exchange '{exchange_name}', asumiendo que existe y obteniéndolo...")
                        try:
                            exchange = await channel.get_exchange(exchange_name)
                        except Exception:
                            # Si aún falla, relanzar el error original de permisos
                            raise declare_error
                    else:
                        # Si es otro error, relanzarlo
                        raise declare_error
            
            message_obj = Message(
                json.dumps(message).encode(),
                delivery_mode=DeliveryMode.PERSISTENT,
                content_type="application/json"
            )
            
            # Extraer información del evento para logging
            event_id = message.get("eventId", "N/A")
            event_type = message.get("eventType", "N/A")
            
            await exchange.publish(message_obj, routing_key=routing_key)
            
            logger.info(
                f"✅ Evento publicado exitosamente: eventId={event_id}, "
                f"eventType={event_type}, exchange={exchange_name}, "
                f"routingKey={routing_key}"
            )
            return True
            
        except Exception as e:
            # Extraer información del evento para logging de error
            event_id = message.get("eventId", "N/A") if isinstance(message, dict) else "N/A"
            event_type = message.get("eventType", "N/A") if isinstance(message, dict) else "N/A"
            
            logger.error(
                f"❌ Error publicando evento: eventId={event_id}, "
                f"eventType={event_type}, exchange={exchange_name}, "
                f"routingKey={routing_key}, error={str(e)}"
            )
            return False

