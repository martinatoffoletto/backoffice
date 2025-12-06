import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional


def build_event(
    event_type: str, 
    payload: Dict[str, Any], 
    occurred_at: Optional[datetime] = None
) -> Dict[str, Any]:
    """
    Construir un evento con el formato estándar requerido
    
    Args:
        event_type: Tipo de evento (ej: "user.created", "user.updated", "user.deleted")
        payload: Datos del evento (payload real)
        occurred_at: Timestamp cuando ocurrió el cambio en la BD (default: ahora)
                    Si no se proporciona, se usa el momento actual
    
    Returns:
        Diccionario con el evento en el formato estándar
        - occurredAt: Timestamp cuando ocurrió el cambio real en la BD
        - emittedAt: Timestamp cuando se emite el evento (ahora)
    """
    # Si no se proporciona occurred_at, usar el momento actual
    if occurred_at is None:
        occurred_at = datetime.now(timezone.utc)
    elif occurred_at.tzinfo is None:
        # Si viene sin timezone, asumir UTC
        occurred_at = occurred_at.replace(tzinfo=timezone.utc)
    
    # emittedAt siempre es el momento actual (cuando se emite el evento)
    emitted_at = datetime.now(timezone.utc)
    
    return {
        "eventId": str(uuid.uuid4()),
        "eventType": event_type,
        "occurredAt": occurred_at.isoformat(),
        "emittedAt": emitted_at.isoformat(),
        "sourceModule": "Backoffice",
        "payload": payload
    }

