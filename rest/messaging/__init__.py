"""
Módulo de mensajería RabbitMQ
"""
from .rabbitmq import get_connection, get_channel, close_connection, get_connection_status
from .producer import EventProducer
from .consumer import EventConsumer

__all__ = [
    "get_connection",
    "get_channel",
    "close_connection",
    "get_connection_status",
    "EventProducer",
    "EventConsumer"
]

