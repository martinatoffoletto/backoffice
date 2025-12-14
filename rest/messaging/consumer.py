import json
from typing import Callable, Optional
from aio_pika import IncomingMessage
from .rabbitmq import get_channel


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
            
            # Obtener exchange existente si se especifica (sin declararlo)
            exchange = None
            if exchange_name:
                try:
                    # Intentar obtener el exchange existente (no requiere permisos de configure)
                    exchange = await channel.get_exchange(exchange_name)
                    print(f"✅ Exchange obtenido: {exchange_name}")
                except Exception as get_error:
                    # Si no existe, intentar declararlo (solo si tenemos permisos)
                    try:
                        exchange = await channel.declare_exchange(
                            exchange_name,
                            type="topic",
                            durable=True
                        )
                        print(f"✅ Exchange declarado: {exchange_name}")
                    except Exception as declare_error:
                        # Si falla por permisos, el exchange probablemente ya existe
                        error_msg = str(declare_error)
                        if "ACCESS_REFUSED" in error_msg or "configure access" in error_msg.lower():
                            print(f"⚠️ Sin permisos para declarar exchange '{exchange_name}', asumiendo que existe...")
                            # Intentar obtenerlo de nuevo
                            exchange = await channel.get_exchange(exchange_name)
                        else:
                            raise declare_error
            
            # Declarar cola
            queue = await channel.declare_queue(queue_name, durable=durable)
            
            # Bind con exchange si existe
            if exchange and routing_key:
                await queue.bind(exchange, routing_key=routing_key)
            
            print(f"✅ Consumiendo cola: {queue_name}")
            
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
                            print(f"❌ Error procesando mensaje: {e}")
                            # Rechazar mensaje y no requeue si hay error
                            await message.nack(requeue=False)
            
        except Exception as e:
            print(f"❌ Error configurando consumidor: {e}")
            raise

