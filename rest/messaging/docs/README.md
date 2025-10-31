# Documentación del Sistema de Mensajería RabbitMQ

Esta documentación describe cómo utilizar el sistema de mensajería RabbitMQ implementado en el backoffice.

## 📋 Tabla de Contenidos

- [Configuración Inicial](#configuración-inicial)
- [Conceptos Básicos](#conceptos-básicos)
- [Publicar Mensajes (Producer)](#publicar-mensajes-producer)
- [Consumir Mensajes (Consumer)](#consumir-mensajes-consumer)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Gestión de Colas](#gestión-de-colas)
- [Solución de Problemas](#solución-de-problemas)

---

## 🔧 Configuración Inicial

### 1. Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 2. Configurar Variables de Entorno

Agregar al archivo `.env`:

```env
RABBITMQ_URL=amqp://guest:guest@localhost:5672/
```

**Formato de URL:**
```
amqp://[usuario]:[contraseña]@[host]:[puerto]/[vhost]
```

**Ejemplos:**
- Local: `amqp://guest:guest@localhost:5672/`
- Producción: `amqp://user:password@rabbitmq.example.com:5672/my_vhost`

### 3. Levantar RabbitMQ (Desarrollo Local)

**Opción 1: Docker Compose (Recomendado)**

```bash
docker-compose up -d rabbitmq
```

**Opción 2: Docker Directo**

```bash
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management-alpine
```

### 4. Verificar Conexión

La aplicación intentará conectarse automáticamente al iniciar. Si RabbitMQ no está disponible, la aplicación seguirá funcionando en modo sin colas (solo mostrará un warning).

**Management UI:** http://localhost:15672
- Usuario: `guest`
- Contraseña: `guest`

---

## 📚 Conceptos Básicos

### Componentes del Sistema

1. **`rabbitmq.py`**: Gestiona la conexión y canales de RabbitMQ
2. **`producer.py`**: Clase `EventProducer` para publicar mensajes
3. **`consumer.py`**: Clase `EventConsumer` para consumir mensajes

### Terminología

- **Exchange**: Punto de enrutamiento que distribuye mensajes
- **Queue**: Cola donde se almacenan los mensajes
- **Routing Key**: Clave que determina a qué cola va el mensaje
- **Binding**: Vinculación entre exchange y queue usando routing key

---

## 📤 Publicar Mensajes (Producer)

### Uso Básico

```python
from rest.messaging.producer import EventProducer

# Publicar a un exchange con routing key
await EventProducer.publish(
    message={
        "event_type": "usuario.creado",
        "usuario_id": "123e4567-e89b-12d3-a456-426614174000",
        "nombre": "Juan",
        "apellido": "Pérez",
        "timestamp": "2024-01-15T10:30:00Z"
    },
    exchange_name="backoffice.events",
    routing_key="usuario.creado"
)
```

### Publicar Directamente a una Cola

```python
await EventProducer.publish(
    message={
        "event_type": "sueldo.calculado",
        "usuario_id": "123e4567-e89b-12d3-a456-426614174000",
        "monto": 50000.00
    },
    queue_name="sueldos.procesados"
)
```

### Parámetros del Método `publish()`

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `message` | `Dict[str, Any]` | ✅ | Diccionario con el contenido del mensaje (se serializa a JSON) |
| `exchange_name` | `str` | ❌ | Nombre del exchange (default: `"backoffice.events"`) |
| `routing_key` | `str` | ❌ | Routing key para enrutar el mensaje (default: `""`) |
| `queue_name` | `Optional[str]` | ❌ | Si se especifica, publica directamente a la cola (ignora exchange) |

### Retorno

- `True`: Mensaje publicado correctamente
- `False`: Error al publicar (ver logs para detalles)

---

## 📥 Consumir Mensajes (Consumer)

### Uso Básico

```python
from rest.messaging.consumer import EventConsumer

async def procesar_evento_usuario(message_data: dict):
    """Callback que procesa cada mensaje recibido"""
    print(f"Evento recibido: {message_data}")
    
    # Tu lógica aquí
    if message_data.get("event_type") == "usuario.creado":
        usuario_id = message_data.get("usuario_id")
        # Procesar creación de usuario...

# Configurar consumidor
await EventConsumer.consume(
    queue_name="usuarios.creados",
    callback=procesar_evento_usuario
)
```

### Consumir desde Exchange con Routing Key

```python
async def procesar_sueldo(message_data: dict):
    # Lógica de procesamiento
    pass

await EventConsumer.consume(
    queue_name="sueldos.procesamiento",
    callback=procesar_sueldo,
    exchange_name="backoffice.events",
    routing_key="sueldo.*"  # Patrón wildcard
)
```

### Parámetros del Método `consume()`

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `queue_name` | `str` | ✅ | Nombre de la cola a consumir |
| `callback` | `Callable[[dict], None]` | ✅ | Función async que procesa cada mensaje |
| `exchange_name` | `Optional[str]` | ❌ | Exchange al cual vincular la cola |
| `routing_key` | `Optional[str]` | ❌ | Routing key para el binding (requiere exchange) |
| `durable` | `bool` | ❌ | Si la cola persiste después de reinicios (default: `True`) |

### Características del Consumidor

- **Ack Automático**: Los mensajes se confirman automáticamente al procesarse
- **Manejo de Errores**: Si el callback falla, el mensaje se rechaza sin requeue
- **Durabilidad**: Las colas son durables por defecto (persisten reinicios)

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Publicar Evento al Crear Usuario

```python
# En rest/service/usuario_service.py
from ..messaging.producer import EventProducer

async def create_user(db: AsyncSession, usuario: UsuarioCreate):
    # ... lógica existente para crear usuario ...
    created_user = await UsuarioDAO.create(db, usuario, ...)
    
    # Publicar evento
    await EventProducer.publish(
        message={
            "event_type": "usuario.creado",
            "usuario_id": str(created_user.id_usuario),
            "nombre": created_user.nombre,
            "apellido": created_user.apellido,
            "email_institucional": created_user.email_institucional,
            "legajo": created_user.legajo,
            "id_rol": str(created_user.id_rol),
            "timestamp": datetime.now().isoformat()
        },
        routing_key="usuario.creado"
    )
    
    return created_user
```

### Ejemplo 2: Publicar Evento al Crear Sueldo

```python
# En rest/service/sueldo_service.py
from ..messaging.producer import EventProducer

async def create_sueldo(db: AsyncSession, sueldo: SueldoBase):
    # ... lógica existente ...
    created_sueldo = await SueldoDAO.create(db, sueldo)
    
    await EventProducer.publish(
        message={
            "event_type": "sueldo.creado",
            "sueldo_id": str(created_sueldo.id_sueldo),
            "usuario_id": str(created_sueldo.id_usuario),
            "sueldo_adicional": float(created_sueldo.sueldo_adicional),
            "cbu": created_sueldo.cbu,
            "timestamp": datetime.now().isoformat()
        },
        routing_key="sueldo.creado"
    )
    
    return created_sueldo
```

### Ejemplo 3: Consumidor como Tarea en Background

```python
# En rest/app.py o en un archivo separado de background tasks
import asyncio
from rest.messaging.consumer import EventConsumer

async def iniciar_consumidores():
    """Iniciar todos los consumidores en background"""
    
    async def procesar_notificaciones(message: dict):
        # Enviar notificaciones por email, etc.
        pass
    
    async def procesar_auditoria(message: dict):
        # Guardar eventos en log de auditoría
        pass
    
    # Iniciar consumidores en paralelo
    await asyncio.gather(
        EventConsumer.consume("notificaciones", procesar_notificaciones),
        EventConsumer.consume("auditoria", procesar_auditoria)
    )

# En el lifespan de FastAPI
@asynccontextmanager
async def lifespan(app: FastAPI):
    # ... código existente ...
    
    # Iniciar consumidores en background
    asyncio.create_task(iniciar_consumidores())
    
    yield
```

### Ejemplo 4: Routing Keys con Patrones

```python
# Publicar eventos relacionados
await EventProducer.publish(
    message={...},
    routing_key="usuario.creado"  # Exacto
)

await EventProducer.publish(
    message={...},
    routing_key="usuario.*"  # Cualquier evento de usuario
)

await EventProducer.publish(
    message={...},
    routing_key="*.creado"  # Cualquier evento de creación
)

# Consumidor que escucha todos los eventos de usuario
await EventConsumer.consume(
    queue_name="todos.usuarios",
    callback=procesar_evento,
    exchange_name="backoffice.events",
    routing_key="usuario.*"
)
```

---

## 🔄 Gestión de Colas

### Ver Colas desde Management UI

1. Acceder a http://localhost:15672
2. Ir a la pestaña "Queues"
3. Ver colas creadas, mensajes pendientes, etc.

### Verificar Estado de Conexión

```python
from rest.messaging.rabbitmq import get_connection_status

status = get_connection_status()
print(status)
# {
#     "connected": True,
#     "channel_active": True
# }
```

### Crear Cola Manualmente (si es necesario)

Las colas se crean automáticamente al publicar o consumir. Si necesitas crearlas manualmente:

```python
from rest.messaging.rabbitmq import get_channel

channel = await get_channel()
queue = await channel.declare_queue("mi.cola", durable=True)
```

---

## 🐛 Solución de Problemas

### Error: "Connection refused"

**Causa**: RabbitMQ no está corriendo o la URL es incorrecta.

**Solución**:
1. Verificar que RabbitMQ esté corriendo: `docker ps` o verificar servicio
2. Verificar URL en `.env`: debe ser `amqp://...`
3. La aplicación seguirá funcionando sin RabbitMQ (solo mostrará warning)

### Error: "Channel closed"

**Causa**: La conexión se perdió.

**Solución**: El sistema intenta reconectar automáticamente. Si persiste, reiniciar la aplicación.

### Mensajes no se reciben

**Verificaciones**:
1. ¿La cola existe? (verificar en Management UI)
2. ¿El routing key coincide?
3. ¿El consumidor está corriendo?
4. ¿Hay mensajes en la cola? (ver en Management UI)

### Performance

**Recomendaciones**:
- Usar colas durables para mensajes importantes
- No acumular demasiados mensajes sin procesar
- Procesar mensajes de forma asíncrona en background tasks

---

## 📝 Notas Importantes

1. **Mensajes Persistentes**: Los mensajes se marcan como persistentes por defecto
2. **Ack Automático**: Los mensajes se confirman automáticamente al procesarse exitosamente
3. **Sin Requeue en Errores**: Si el callback falla, el mensaje se rechaza sin volver a la cola
4. **Modo Sin Colas**: Si RabbitMQ no está disponible, la aplicación funciona normalmente (solo no publica/consume)

---

## 🔗 Recursos Adicionales

- [Documentación oficial de RabbitMQ](https://www.rabbitmq.com/documentation.html)
- [aio-pika Documentation](https://aio-pika.readthedocs.io/)
- [RabbitMQ Patterns](https://www.rabbitmq.com/getstarted.html)

---

## ✅ Checklist de Implementación

- [ ] RabbitMQ instalado y corriendo
- [ ] Variable `RABBITMQ_URL` configurada en `.env`
- [ ] Dependencia `aio-pika` instalada
- [ ] Servicio verificado (la app inicia sin errores)
- [ ] Definir eventos específicos del dominio
- [ ] Implementar publicadores en los servicios correspondientes
- [ ] Implementar consumidores si es necesario

---

**Última actualización**: Enero 2025

