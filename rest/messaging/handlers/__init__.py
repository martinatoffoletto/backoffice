"""
Handlers para procesar eventos de RabbitMQ
"""
from .proposal_handler import handle_proposal_event

__all__ = ["handle_proposal_event"]
