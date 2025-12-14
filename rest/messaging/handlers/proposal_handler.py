"""
Handler para eventos de propuestas
"""
import json
from typing import Dict, Any


async def handle_proposal_event(event_data: Dict[str, Any]) -> None:
    """
    Procesa eventos relacionados con propuestas.
    
    Por ahora solo loguea el evento recibido. En el futuro aquí se implementará
    la lógica de negocio para procesar las propuestas.
    
    Args:
        event_data: Diccionario con los datos del evento recibido
    """
    try:
        # Extraer información del evento
        event_type = event_data.get("eventType")
        payload = event_data.get("payload", {})
        
        print(f"📨 Evento recibido: {event_type}")
        print(f"   Event ID: {event_data.get('eventId')}")
        print(f"   Correlation ID: {event_data.get('correlationId')}")
        print(f"   Ocurred At: {event_data.get('occurredAt')}")
        print(f"   Source Module: {event_data.get('sourceModule')}")
        
        # Log del payload según el tipo de evento
        if event_type == "ProposalCreated":
            print(f"   📋 Propuesta creada:")
            print(f"      - Proposal ID: {payload.get('proposalId')}")
            print(f"      - Teacher ID: {payload.get('teacherId')}")
            print(f"      - Subject ID: {payload.get('subjectId')}")
            print(f"      - Occurred At: {payload.get('occurredAt')}")
        
        # TODO: Aquí se implementará la lógica de negocio
        # Por ejemplo: guardar en base de datos, notificar, etc.
        
    except Exception as e:
        print(f"❌ Error procesando evento de propuesta: {e}")
        print(f"   Event data: {json.dumps(event_data, indent=2)}")
        raise
