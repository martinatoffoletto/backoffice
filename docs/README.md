# 📚 Documentación BackOffice API

## 🎯 Descripción General

**BackOffice API** es un sistema de gestión académica que permite administrar cronogramas, clases individuales y evaluaciones de manera eficiente y escalable. Construido con FastAPI, PostgreSQL y arquitectura asíncrona.

## 📋 Índice de Documentación

### 📖 Documentación Principal
- [**Módulos Principales**](./modulos_principales.md) - Visión general de Cronograma, ClaseIndividual y Evaluacion
- [**Cronograma API**](./cronograma_api.md) - Documentación técnica completa del módulo Cronograma
- [**Clase Individual API**](./clase_individual_api.md) - Documentación técnica completa del módulo ClaseIndividual
- [**Evaluación API**](./evaluacion_api.md) - Documentación técnica completa del módulo Evaluacion

### 🚀 Guías Rápidas
- [**Instalación y Configuración**](#instalación-y-configuración)
- [**Primeros Pasos**](#primeros-pasos)
- [**Ejemplos de Uso**](#ejemplos-de-uso)
- [**Troubleshooting**](#troubleshooting)

---

## 🏗️ Arquitectura del Sistema

### Patrón de Diseño
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controller    │───▶│   Service       │───▶│   DAO           │───▶│   Model         │
│   (HTTP Layer)  │    │   (Business)    │    │   (Data Access) │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tecnologías Utilizadas

| Componente | Tecnología | Versión | Propósito |
|------------|------------|---------|-----------|
| **Framework** | FastAPI | 0.104+ | API REST asíncrona |
| **Base de Datos** | PostgreSQL | 13+ | Almacenamiento principal |
| **ORM** | SQLAlchemy | 2.0+ | Mapeo objeto-relacional |
| **Validación** | Pydantic | 2.0+ | Validación de datos |
| **Servidor** | Uvicorn | 0.24+ | Servidor ASGI |
| **Testing** | pytest | 7.0+ | Framework de pruebas |

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- Python 3.11+
- PostgreSQL 13+
- Git

### 1. Clonar Repositorio
```bash
git clone <repository-url>
cd backoffice
```

### 2. Crear Entorno Virtual
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Instalar Dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar Base de Datos
```bash
# Copiar archivo de configuración
cp env.example .env

# Editar configuración
nano .env
```

**Configuración mínima en `.env`:**
```bash
# Base de datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=backoffice_db
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_password

# Servidor
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
ENVIRONMENT=development
```

### 5. Inicializar Sistema
```bash
# Crear tablas y datos iniciales
python setup.py

# Verificar instalación
python check_database.py
```

### 6. Ejecutar Servidor
```bash
python run_server.py
```

### 7. Verificar Instalación
- **API**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🎯 Primeros Pasos

### 1. Crear tu Primer Cronograma

```python
import requests

# Configuración
BASE_URL = "http://localhost:8000"
headers = {"Content-Type": "application/json"}

# Datos del cronograma
cronograma_data = {
    "course_id": 101,
    "course_name": "Bases de Datos II",
    "total_classes": 16,
    "fecha_inicio": "2024-02-15",
    "fecha_fin": "2024-06-15",
    "descripcion": "Curso avanzado de bases de datos relacionales"
}

# Crear cronograma
response = requests.post(f"{BASE_URL}/cronogramas/", json=cronograma_data)
cronograma = response.json()["cronograma"]
print(f"Cronograma creado: {cronograma['id_cronograma']}")
```

### 2. Agregar Clases al Cronograma

```python
# Crear clases individuales
clases_data = [
    {
        "id_cronograma": cronograma["id_cronograma"],
        "titulo": "Introducción a Bases de Datos",
        "descripcion": "Conceptos fundamentales",
        "fecha_clase": "2024-02-15",
        "hora_inicio": "09:00:00",
        "hora_fin": "11:00:00",
        "estado": "programada"
    },
    {
        "id_cronograma": cronograma["id_cronograma"],
        "titulo": "Modelado Entidad-Relación",
        "descripcion": "Diseño de esquemas",
        "fecha_clase": "2024-02-22",
        "hora_inicio": "09:00:00",
        "hora_fin": "11:00:00",
        "estado": "programada"
    }
]

for clase_data in clases_data:
    response = requests.post(f"{BASE_URL}/clases-individuales/", json=clase_data)
    print(f"Clase creada: {response.json()['clase']['id_clase']}")
```

### 3. Programar Evaluaciones

```python
# Crear evaluaciones
evaluaciones_data = [
    {
        "id_cronograma": cronograma["id_cronograma"],
        "nombre": "Primer Parcial",
        "descripcion": "Evaluación teórica",
        "fecha": "2024-03-15",
        "hora_inicio": "09:00:00",
        "hora_fin": "11:00:00",
        "tipo": "parcial",
        "ponderacion": 25.00
    },
    {
        "id_cronograma": cronograma["id_cronograma"],
        "nombre": "Examen Final",
        "descripcion": "Evaluación integral",
        "fecha": "2024-06-20",
        "hora_inicio": "09:00:00",
        "hora_fin": "12:00:00",
        "tipo": "final",
        "ponderacion": 50.00
    }
]

for evaluacion_data in evaluaciones_data:
    response = requests.post(f"{BASE_URL}/evaluaciones/", json=evaluacion_data)
    print(f"Evaluación creada: {response.json()['evaluacion']['id_evaluacion']}")
```

---

## 💡 Ejemplos de Uso

### Consultas Avanzadas

```python
# Obtener clases próximas
clases_proximas = requests.get(f"{BASE_URL}/clases-individuales/proximas/?dias=7")
print(f"Clases próximas: {len(clases_proximas.json())}")

# Buscar evaluaciones por tipo
parciales = requests.get(f"{BASE_URL}/evaluaciones/tipo/parcial")
print(f"Parciales: {len(parciales.json())}")

# Obtener estadísticas
stats_cronograma = requests.get(f"{BASE_URL}/cronogramas/stats/")
stats_clases = requests.get(f"{BASE_URL}/clases-individuales/stats/")
stats_evaluaciones = requests.get(f"{BASE_URL}/evaluaciones/stats/")

print("Estadísticas del sistema:")
print(f"Cronogramas: {stats_cronograma.json()}")
print(f"Clases: {stats_clases.json()}")
print(f"Evaluaciones: {stats_evaluaciones.json()}")
```

### Manejo de Errores

```python
try:
    response = requests.post(f"{BASE_URL}/cronogramas/", json=invalid_data)
    response.raise_for_status()
except requests.exceptions.HTTPError as e:
    if e.response.status_code == 400:
        error_detail = e.response.json()["detail"]
        print(f"Error de validación: {error_detail}")
    elif e.response.status_code == 404:
        print("Recurso no encontrado")
    else:
        print(f"Error del servidor: {e.response.status_code}")
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno Completas

```bash
# Base de datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=backoffice_db
DATABASE_USER=postgres
DATABASE_PASSWORD=secure_password

# Servidor
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
ENVIRONMENT=production
WORKERS=4

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json

# Cache (opcional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
```

### Configuración de Producción

```python
# gunicorn.conf.py
bind = "0.0.0.0:8000"
workers = 4
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 100
timeout = 30
keepalive = 2
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: backoffice_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
pytest tests/

# Tests con cobertura
pytest --cov=rest tests/

# Tests de integración
pytest tests/integration/

# Tests de rendimiento
pytest tests/performance/
```

### Casos de Prueba Principales

```python
# tests/test_cronograma.py
def test_crear_cronograma_completo():
    """Test: Flujo completo de creación de cronograma"""
    # 1. Crear cronograma
    # 2. Agregar clases
    # 3. Agregar evaluaciones
    # 4. Verificar estadísticas
    pass

def test_validaciones_negocio():
    """Test: Validaciones de negocio"""
    # 1. Fechas inválidas
    # 2. Conflictos de horarios
    # 3. Ponderaciones excedidas
    pass
```

---

## 📊 Monitoreo y Métricas

### Logs Importantes

```python
# Configurar logging
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('backoffice.log'),
        logging.StreamHandler()
    ]
)
```

### Métricas de Rendimiento

| Métrica | Valor Objetivo | Monitoreo |
|---------|----------------|-----------|
| **Tiempo de respuesta** | < 200ms | Prometheus + Grafana |
| **Throughput** | 1000 req/min | APM |
| **Disponibilidad** | 99.9% | Health checks |
| **Errores** | < 0.1% | Alertas |

### Health Checks

```python
# health_check.py
import requests

def check_api_health():
    """Verificar salud de la API"""
    try:
        response = requests.get("http://localhost:8000/health")
        return response.status_code == 200
    except:
        return False

def check_database_health():
    """Verificar conexión a base de datos"""
    try:
        response = requests.get("http://localhost:8000/cronogramas/stats/")
        return response.status_code == 200
    except:
        return False
```

---

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión a Base de Datos
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo systemctl status postgresql

# Verificar configuración
python check_database.py
```

#### 2. Error de Puerto en Uso
```bash
# Encontrar proceso usando el puerto
lsof -i :8000

# Terminar proceso
kill -9 <PID>
```

#### 3. Error de Dependencias
```bash
# Reinstalar dependencias
pip install -r requirements.txt --force-reinstall

# Verificar versión de Python
python --version
```

#### 4. Error de Permisos
```bash
# Verificar permisos de archivos
chmod +x setup.py run_server.py

# Verificar permisos de base de datos
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE backoffice_db TO postgres;"
```

### Logs de Debug

```python
# Habilitar logs detallados
import logging
logging.getLogger("rest").setLevel(logging.DEBUG)

# Logs específicos
logger = logging.getLogger("rest.database")
logger.debug("Conexión a base de datos establecida")
```

---

## 🤝 Contribución

### Cómo Contribuir

1. **Fork** del repositorio
2. **Crear branch** de feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** cambios: `git commit -m "Agregar nueva funcionalidad"`
4. **Push** al branch: `git push origin feature/nueva-funcionalidad`
5. **Crear Pull Request**

### Estándares de Código

```python
# Usar type hints
def crear_cronograma(data: CronogramaCreate) -> CronogramaResponse:
    """Crear cronograma con validaciones."""
    pass

# Documentar funciones
async def get_cronograma_by_id(
    db: AsyncSession, 
    id_cronograma: int
) -> Tuple[Optional[CronogramaResponse], str]:
    """
    Obtener cronograma por ID.
    
    Args:
        db: Sesión de base de datos
        id_cronograma: ID del cronograma
        
    Returns:
        Tupla con cronograma y mensaje
        
    Raises:
        HTTPException: Si el cronograma no existe
    """
    pass
```

### Testing

```python
# Escribir tests para nuevas funcionalidades
def test_nueva_funcionalidad():
    """Test: Descripción de la funcionalidad"""
    # Arrange
    data = {...}
    
    # Act
    result = funcion_a_testear(data)
    
    # Assert
    assert result.status_code == 200
    assert "expected" in result.json()
```

---

## 📞 Soporte

### Canales de Soporte

- **Documentación**: `/docs` en el servidor
- **Issues**: GitHub Issues
- **Email**: soporte@backoffice.edu
- **Slack**: #backoffice-support

### Recursos Adicionales

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Pydantic Documentation](https://pydantic-docs.helpmanual.io/)

---

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

## 🏆 Reconocimientos

- **FastAPI** por el excelente framework
- **SQLAlchemy** por el ORM robusto
- **PostgreSQL** por la base de datos confiable
- **Pydantic** por la validación de datos

---

*Documentación BackOffice API v1.0 - Generada automáticamente*
