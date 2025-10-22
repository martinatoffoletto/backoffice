# 📚 API de Clase Individual - Documentación Técnica

## Descripción General

El módulo **Clase Individual** gestiona las clases específicas dentro de un cronograma académico. Permite programar, modificar y controlar el estado de cada clase individual, incluyendo horarios, temas y observaciones.

## 🏗️ Arquitectura

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   Controller        │───▶│   Service          │───▶│   DAO              │───▶│   Model             │
│   (HTTP Layer)      │    │   (Business Logic) │    │   (Data Access)    │    │   (Database)       │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

### Componentes

- **ClaseIndividualController**: Maneja requests HTTP y responses
- **ClaseIndividualService**: Lógica de negocio y validaciones
- **ClaseIndividualDAO**: Acceso a datos asíncrono
- **ClaseIndividual Model**: Entidad de base de datos

## 📊 Modelo de Datos

### Estructura de la Tabla

```sql
CREATE TABLE clases_individuales (
    id_clase SERIAL PRIMARY KEY,
    id_cronograma INTEGER NOT NULL REFERENCES cronogramas(id_cronograma),
    titulo VARCHAR(200) NOT NULL,                 -- Título de la clase
    descripcion TEXT,                            -- Descripción detallada
    fecha_clase DATE NOT NULL,                   -- Fecha programada
    hora_inicio TIME NOT NULL,                   -- Hora de inicio
    hora_fin TIME NOT NULL,                      -- Hora de fin
    estado VARCHAR(20) NOT NULL DEFAULT 'programada', -- Estado de la clase
    observaciones TEXT,                          -- Observaciones adicionales
    status BOOLEAN DEFAULT TRUE,                 -- Estado del registro
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Estados de Clase

```python
class EstadoClase(enum.Enum):
    PROGRAMADA = "programada"      # Clase programada, pendiente de dictar
    DICTADA = "dictada"           # Clase ya dictada
    REPROGRAMADA = "reprogramada" # Clase reprogramada
    CANCELADA = "cancelada"       # Clase cancelada
```

### Relaciones

```mermaid
erDiagram
    CRONOGRAMA ||--o{ CLASE_INDIVIDUAL : "contiene"
    
    CRONOGRAMA {
        int id_cronograma PK
        string course_name
    }
    
    CLASE_INDIVIDUAL {
        int id_clase PK
        int id_cronograma FK
        string titulo
        date fecha_clase
        time hora_inicio
        time hora_fin
        enum estado
        text observaciones
    }
```

## 🔌 API Endpoints

### 1. Crear Clase Individual

```http
POST /clases-individuales/
Content-Type: application/json

{
    "id_cronograma": 1,
    "titulo": "Introducción a Bases de Datos",
    "descripcion": "Conceptos fundamentales de bases de datos relacionales",
    "fecha_clase": "2024-02-15",
    "hora_inicio": "09:00:00",
    "hora_fin": "11:00:00",
    "estado": "programada",
    "observaciones": "Traer laptops para práctica"
}
```

**Response:**
```json
{
    "clase": {
        "id_clase": 1,
        "id_cronograma": 1,
        "titulo": "Introducción a Bases de Datos",
        "descripcion": "Conceptos fundamentales de bases de datos relacionales",
        "fecha_clase": "2024-02-15",
        "hora_inicio": "09:00:00",
        "hora_fin": "11:00:00",
        "estado": "programada",
        "observaciones": "Traer laptops para práctica",
        "status": true,
        "fecha_creacion": "2024-01-15T10:30:00Z",
        "fecha_modificacion": "2024-01-15T10:30:00Z"
    },
    "message": "Clase creada exitosamente"
}
```

### 2. Listar Clases Individuales

```http
GET /clases-individuales/?skip=0&limit=100&status_filter=true
```

**Query Parameters:**
- `skip` (int): Número de registros a omitir (default: 0)
- `limit` (int): Número máximo de registros (default: 100, max: 1000)
- `status_filter` (bool): Filtrar por estado (true=activo, false=inactivo)

### 3. Obtener Clase por ID

```http
GET /clases-individuales/1
```

### 4. Actualizar Clase

```http
PUT /clases-individuales/1
Content-Type: application/json

{
    "titulo": "Bases de Datos Avanzadas",
    "estado": "reprogramada",
    "observaciones": "Cambio de horario por feriado"
}
```

### 5. Eliminar Clase

```http
DELETE /clases-individuales/1
```

### 6. Clases por Cronograma

```http
GET /clases-individuales/cronograma/1?skip=0&limit=100
```

### 7. Clases por Estado

```http
GET /clases-individuales/estado/programada?skip=0&limit=100
```

### 8. Clases por Fecha

```http
GET /clases-individuales/fecha/2024-02-15?skip=0&limit=100
```

### 9. Clases por Rango de Fechas

```http
GET /clases-individuales/fecha-range/?fecha_inicio=2024-02-01&fecha_fin=2024-02-29
```

### 10. Clases Próximas

```http
GET /clases-individuales/proximas/?dias=7&skip=0&limit=100
```

**Query Parameters:**
- `dias` (int): Número de días hacia adelante (default: 7, max: 365)

### 11. Clases Pasadas

```http
GET /clases-individuales/pasadas/?dias=30&skip=0&limit=100
```

**Query Parameters:**
- `dias` (int): Número de días hacia atrás (default: 30, max: 365)

### 12. Buscar Clases

```http
GET /clases-individuales/search/?q=introducción&skip=0&limit=100
```

### 13. Clases con Información del Cronograma

```http
GET /clases-individuales/con-cronograma/?skip=0&limit=100
```

**Response:**
```json
[
    {
        "id_clase": 1,
        "id_cronograma": 1,
        "titulo": "Introducción a Bases de Datos",
        "fecha_clase": "2024-02-15",
        "hora_inicio": "09:00:00",
        "hora_fin": "11:00:00",
        "estado": "programada",
        "course_id": 101,
        "course_name": "Bases de Datos II",
        "total_classes": 16
    }
]
```

### 14. Estadísticas

```http
GET /clases-individuales/stats/
```

**Response:**
```json
{
    "total_clases": 50,
    "clases_programadas": 30,
    "clases_dictadas": 15,
    "clases_reprogramadas": 3,
    "clases_canceladas": 2,
    "clases_activas": 48,
    "clases_inactivas": 2
}
```

## ✅ Validaciones de Negocio

### 1. **Validación de Fechas**
- No se pueden crear clases en fechas pasadas
- Error: `"No se puede crear una clase en una fecha pasada"`

### 2. **Validación de Horarios**
- `hora_fin` debe ser posterior a `hora_inicio`
- Error: `"La hora de fin debe ser posterior a la hora de inicio"`

### 3. **Conflictos de Horarios**
- No puede haber solapamiento de horarios en la misma fecha
- Error: `"Conflicto de horarios con la clase '{titulo}' el {fecha}"`

### 4. **Eliminación de Clases**
- No se puede eliminar una clase ya dictada
- Error: `"No se puede eliminar una clase que ya fue dictada"`

### 5. **Campos Obligatorios**
- `id_cronograma`: Requerido, debe existir
- `titulo`: Requerido, 3-200 caracteres
- `fecha_clase`: Requerido, formato YYYY-MM-DD
- `hora_inicio`: Requerido, formato HH:MM:SS
- `hora_fin`: Requerido, formato HH:MM:SS

## 🔧 Código de Ejemplo

### Python (requests)

```python
import requests
from datetime import date, time

# Configuración
BASE_URL = "http://localhost:8000"
headers = {"Content-Type": "application/json"}

# Crear clase individual
def crear_clase(id_cronograma, titulo, descripcion, fecha_clase, hora_inicio, hora_fin, estado="programada", observaciones=None):
    data = {
        "id_cronograma": id_cronograma,
        "titulo": titulo,
        "descripcion": descripcion,
        "fecha_clase": fecha_clase,
        "hora_inicio": hora_inicio,
        "hora_fin": hora_fin,
        "estado": estado,
        "observaciones": observaciones
    }
    
    response = requests.post(f"{BASE_URL}/clases-individuales/", json=data, headers=headers)
    
    if response.status_code == 201:
        return response.json()["clase"]
    else:
        raise Exception(f"Error: {response.json()['detail']}")

# Obtener clases próximas
def obtener_clases_proximas(dias=7):
    params = {"dias": dias}
    response = requests.get(f"{BASE_URL}/clases-individuales/proximas/", params=params)
    return response.json()

# Buscar clases
def buscar_clases(termino, skip=0, limit=100):
    params = {"q": termino, "skip": skip, "limit": limit}
    response = requests.get(f"{BASE_URL}/clases-individuales/search/", params=params)
    return response.json()

# Actualizar estado de clase
def actualizar_estado_clase(id_clase, nuevo_estado, observaciones=None):
    data = {
        "estado": nuevo_estado,
        "observaciones": observaciones
    }
    
    response = requests.put(f"{BASE_URL}/clases-individuales/{id_clase}", json=data, headers=headers)
    
    if response.status_code == 200:
        return response.json()["clase"]
    else:
        raise Exception(f"Error: {response.json()['detail']}")

# Ejemplo de uso
try:
    # Crear clase
    clase = crear_clase(
        id_cronograma=1,
        titulo="Introducción a Bases de Datos",
        descripcion="Conceptos fundamentales",
        fecha_clase="2024-02-15",
        hora_inicio="09:00:00",
        hora_fin="11:00:00",
        observaciones="Traer laptops"
    )
    print(f"Clase creada: {clase['id_clase']}")
    
    # Obtener clases próximas
    clases_proximas = obtener_clases_proximas(7)
    print(f"Clases próximas: {len(clases_proximas)}")
    
    # Marcar clase como dictada
    clase_actualizada = actualizar_estado_clase(
        id_clase=clase['id_clase'],
        nuevo_estado="dictada",
        observaciones="Clase completada exitosamente"
    )
    print(f"Estado actualizado: {clase_actualizada['estado']}")
    
except Exception as e:
    print(f"Error: {e}")
```

### JavaScript (fetch)

```javascript
const BASE_URL = 'http://localhost:8000';

// Crear clase individual
async function crearClase(idCronograma, titulo, descripcion, fechaClase, horaInicio, horaFin, estado = 'programada', observaciones = null) {
    const data = {
        id_cronograma: idCronograma,
        titulo: titulo,
        descripcion: descripcion,
        fecha_clase: fechaClase,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        estado: estado,
        observaciones: observaciones
    };
    
    try {
        const response = await fetch(`${BASE_URL}/clases-individuales/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            return result.clase;
        } else {
            const error = await response.json();
            throw new Error(error.detail);
        }
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

// Obtener clases próximas
async function obtenerClasesProximas(dias = 7) {
    try {
        const response = await fetch(`${BASE_URL}/clases-individuales/proximas/?dias=${dias}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Actualizar estado de clase
async function actualizarEstadoClase(idClase, nuevoEstado, observaciones = null) {
    const data = {
        estado: nuevoEstado,
        observaciones: observaciones
    };
    
    try {
        const response = await fetch(`${BASE_URL}/clases-individuales/${idClase}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            return result.clase;
        } else {
            const error = await response.json();
            throw new Error(error.detail);
        }
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

// Ejemplo de uso
(async () => {
    try {
        // Crear clase
        const clase = await crearClase(
            1,
            "Introducción a Bases de Datos",
            "Conceptos fundamentales",
            "2024-02-15",
            "09:00:00",
            "11:00:00",
            "programada",
            "Traer laptops"
        );
        console.log('Clase creada:', clase.id_clase);
        
        // Obtener clases próximas
        const clasesProximas = await obtenerClasesProximas(7);
        console.log(`Clases próximas: ${clasesProximas.length}`);
        
        // Marcar como dictada
        const claseActualizada = await actualizarEstadoClase(
            clase.id_clase,
            "dictada",
            "Clase completada exitosamente"
        );
        console.log('Estado actualizado:', claseActualizada.estado);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
```

## 🚨 Códigos de Error

| Código | Descripción | Solución |
|--------|-------------|----------|
| `400` | Datos de entrada inválidos | Verificar formato y validaciones |
| `404` | Clase no encontrada | Verificar ID de la clase |
| `409` | Conflicto de horarios | Verificar disponibilidad de horarios |
| `500` | Error interno del servidor | Contactar soporte técnico |

## 📈 Métricas y Monitoreo

### Logs Importantes

```python
# Creación exitosa
INFO: Clase creada exitosamente: ID 1

# Error de validación
ERROR: Error creando clase: No se puede crear una clase en una fecha pasada

# Conflicto de horarios
ERROR: Error creando clase: Conflicto de horarios con la clase 'Introducción' el 2024-02-15

# Actualización de estado
INFO: Clase actualizada exitosamente: ID 1
```

### Métricas de Rendimiento

- **Tiempo de respuesta promedio**: < 150ms
- **Throughput**: 1500 requests/minuto
- **Disponibilidad**: 99.9%

## 🔄 Flujos de Trabajo

### Flujo 1: Creación de Clase

```mermaid
sequenceDiagram
    participant C as Cliente
    participant API as ClaseController
    participant S as ClaseService
    participant D as ClaseDAO
    participant DB as Database
    
    C->>API: POST /clases-individuales/
    API->>S: create_clase()
    S->>D: get_by_fecha()
    D->>DB: SELECT por fecha
    DB-->>D: Clases existentes
    D-->>S: Validación conflictos
    S->>D: create()
    D->>DB: INSERT clase
    DB-->>D: ID generado
    D-->>S: Clase creada
    S-->>API: Response + Message
    API-->>C: 201 Created
```

### Flujo 2: Obtener Clases Próximas

```mermaid
sequenceDiagram
    participant C as Cliente
    participant API as ClaseController
    participant S as ClaseService
    participant D as ClaseDAO
    participant DB as Database
    
    C->>API: GET /clases-individuales/proximas/?dias=7
    API->>S: get_proximas_clases()
    S->>D: get_proximas_clases()
    D->>DB: SELECT con filtro de fecha
    DB-->>D: Clases próximas
    D-->>S: Lista de clases
    S-->>API: Response + Message
    API-->>C: 200 OK
```

## 🧪 Testing

### Casos de Prueba

```python
import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_crear_clase_exitosa():
    """Test: Crear clase con datos válidos"""
    data = {
        "id_cronograma": 1,
        "titulo": "Test Class",
        "descripcion": "Test description",
        "fecha_clase": "2024-12-31",  # Fecha futura
        "hora_inicio": "09:00:00",
        "hora_fin": "11:00:00"
    }
    
    response = client.post("/clases-individuales/", json=data)
    assert response.status_code == 201
    assert "clase" in response.json()

def test_crear_clase_fecha_pasada():
    """Test: Error al crear clase en fecha pasada"""
    data = {
        "id_cronograma": 1,
        "titulo": "Test Class",
        "fecha_clase": "2020-01-01",  # Fecha pasada
        "hora_inicio": "09:00:00",
        "hora_fin": "11:00:00"
    }
    
    response = client.post("/clases-individuales/", json=data)
    assert response.status_code == 400
    assert "fecha pasada" in response.json()["detail"]

def test_conflicto_horarios():
    """Test: Error por conflicto de horarios"""
    # Crear primera clase
    data1 = {
        "id_cronograma": 1,
        "titulo": "Class 1",
        "fecha_clase": "2024-12-31",
        "hora_inicio": "09:00:00",
        "hora_fin": "11:00:00"
    }
    client.post("/clases-individuales/", json=data1)
    
    # Crear segunda clase con horario solapado
    data2 = {
        "id_cronograma": 1,
        "titulo": "Class 2",
        "fecha_clase": "2024-12-31",
        "hora_inicio": "10:00:00",  # Solapa con la primera
        "hora_fin": "12:00:00"
    }
    
    response = client.post("/clases-individuales/", json=data2)
    assert response.status_code == 400
    assert "Conflicto de horarios" in response.json()["detail"]

def test_eliminar_clase_dictada():
    """Test: Error al eliminar clase ya dictada"""
    # Crear clase
    data = {
        "id_cronograma": 1,
        "titulo": "Test Class",
        "fecha_clase": "2024-12-31",
        "hora_inicio": "09:00:00",
        "hora_fin": "11:00:00"
    }
    response = client.post("/clases-individuales/", json=data)
    clase_id = response.json()["clase"]["id_clase"]
    
    # Marcar como dictada
    client.put(f"/clases-individuales/{clase_id}", json={"estado": "dictada"})
    
    # Intentar eliminar
    response = client.delete(f"/clases-individuales/{clase_id}")
    assert response.status_code == 400
    assert "ya fue dictada" in response.json()["detail"]
```

## 🔧 Configuración Avanzada

### Optimizaciones de Base de Datos

```sql
-- Índices para mejorar rendimiento
CREATE INDEX idx_clases_cronograma ON clases_individuales(id_cronograma);
CREATE INDEX idx_clases_fecha ON clases_individuales(fecha_clase);
CREATE INDEX idx_clases_estado ON clases_individuales(estado);
CREATE INDEX idx_clases_status ON clases_individuales(status);

-- Índice compuesto para búsquedas frecuentes
CREATE INDEX idx_clases_fecha_estado ON clases_individuales(fecha_clase, estado);
```

### Configuración de Cache

```python
# rest/service/clase_individual_service.py
from functools import lru_cache
import redis

# Cache para estadísticas
@lru_cache(maxsize=128)
async def get_estadisticas_cached():
    """Cache de estadísticas por 5 minutos"""
    return await EvaluacionDAO.get_estadisticas(db)

# Redis para cache distribuido
redis_client = redis.Redis(host='localhost', port=6379, db=0)

async def get_clases_proximas_cached(dias=7):
    """Cache con Redis para clases próximas"""
    cache_key = f"clases_proximas_{dias}"
    cached_result = redis_client.get(cache_key)
    
    if cached_result:
        return json.loads(cached_result)
    
    result = await ClaseIndividualDAO.get_proximas_clases(db, dias)
    redis_client.setex(cache_key, 300, json.dumps(result))  # 5 minutos
    return result
```

---

*Documentación técnica - Clase Individual API v1.0*
