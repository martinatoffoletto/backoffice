# BackOffice API 🎓

Sistema de gestión educativa completo con API REST desarrollado en FastAPI, SQLAlchemy y PostgreSQL.

## 🚀 Características

- **Gestión de Usuarios**: Administración completa de usuarios con roles y permisos
- **Autenticación**: Sistema de login con email/password y gestión de roles
- **Parámetros del Sistema**: Configuración centralizada y editable
- **Gestión de Sedes**: Administración de ubicaciones físicas
- **Espacios/Aulas**: Gestión de aulas con características técnicas
- **Sueldos**: Registro y gestión de nómina del personal
- **Cronogramas**: Programación de horarios y actividades
- **Clases Individuales**: Gestión de clases personalizadas
- **Evaluaciones**: Sistema de calificaciones y seguimiento académico

## 📁 Estructura del Proyecto

```
backoffice/
├── rest/
│   ├── controller/          # Controladores REST (endpoints)
│   ├── service/            # Lógica de negocio
│   ├── dao/                # Acceso a datos
│   ├── models/             # Modelos SQLAlchemy
│   ├── schemas/            # Esquemas Pydantic
│   ├── app.py              # Aplicación principal
│   ├── database.py         # Configuración de BD
│   └── create_sample_data.py
├── requirements.txt        # Dependencias Python
├── .env.example           # Variables de entorno de ejemplo
├── setup.py               # Script de inicialización
├── run_server.py          # Script para ejecutar el servidor
└── README.md              # Este archivo
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Python 3.8 o superior
- PostgreSQL (opcional, se puede usar SQLite para desarrollo)
- pip (gestor de paquetes de Python)

### 1. Clonar el repositorio

```bash
git clone https://github.com/martinatoffoletto/backoffice.git
cd backoffice
```

### 2. Crear entorno virtual (recomendado)

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tu configuración
# DATABASE_URL=postgresql://user:password@localhost:5432/backoffice_db
# O para desarrollo simple:
# DATABASE_URL=sqlite:///./backoffice.db
```

### 5. Inicializar el sistema

```bash
python setup.py
```

Este script:

- Crea las tablas de la base de datos
- Genera datos de ejemplo
- Configura el entorno inicial

### 6. Ejecutar el servidor

```bash
python run_server.py
```

El servidor estará disponible en:

- **API**: http://localhost:8000
- **Documentación Swagger**: http://localhost:8000/docs
- **Documentación ReDoc**: http://localhost:8000/redoc

## 🔧 Configuración de Base de Datos

### PostgreSQL (Producción)

```env
DATABASE_URL=postgresql://username:password@localhost:5432/backoffice_db
```

### SQLite (Desarrollo)

```env
DATABASE_URL=sqlite:///./backoffice.db
```

## 📚 API Endpoints

### Autenticación

- `POST /api/v1/auth/login` - Iniciar sesión
- `GET /api/v1/auth/validate/{email}` - Validar acceso
- `POST /api/v1/auth/logout` - Cerrar sesión

### Usuarios

- `GET /api/v1/usuarios` - Obtener usuarios
- `POST /api/v1/usuarios` - Crear usuario
- `GET /api/v1/usuarios/{id}` - Obtener usuario por ID
- `PUT /api/v1/usuarios/{id}` - Actualizar usuario
- `DELETE /api/v1/usuarios/{id}` - Eliminar usuario

### Roles

- `GET /api/v1/roles` - Obtener roles
- `POST /api/v1/roles` - Crear rol
- `GET /api/v1/roles/{id}` - Obtener rol por ID
- `PUT /api/v1/roles/{id}` - Actualizar rol
- `DELETE /api/v1/roles/{id}` - Eliminar rol

### Otros Módulos

- **Parámetros**: `/api/v1/parametros`
- **Sedes**: `/api/v1/sedes`
- **Espacios**: `/api/v1/espacios`
- **Sueldos**: `/api/v1/sueldos`
- **Cronogramas**: `/api/v1/cronogramas`

## 🏗️ Arquitectura

El sistema sigue una arquitectura en capas:

```
Controller → Service → DAO → Database
```

- **Controllers**: Manejan requests HTTP y responses
- **Services**: Contienen la lógica de negocio y validaciones
- **DAOs**: Acceso directo a la base de datos
- **Models**: Definición de entidades SQLAlchemy
- **Schemas**: Validación y serialización con Pydantic

## 🔐 Autenticación y Autorización

### Sistema de Roles

- **Administrador**: Acceso completo al sistema
- **Profesor**: Gestión de cronogramas, clases y evaluaciones
- **Estudiante**: Consulta de cronogramas y evaluaciones
- **Secretaria**: Gestión de usuarios, espacios y cronogramas

### Autenticación

```python
# Ejemplo de login
POST /api/v1/auth/login
{
    "email": "user@example.com",
    "password": "password123"
}

# Respuesta
{
    "legajo": "12345",
    "nombre": "Juan Pérez",
    "roles": ["Administrador", "Profesor"]
}
```

## 🗃️ Modelos de Datos

### Principales Entidades

- **Usuario**: Información personal y credenciales
- **Rol**: Roles del sistema con permisos
- **UsuarioRol**: Relación many-to-many usuarios-roles
- **Sede**: Ubicaciones físicas de la institución
- **Espacio**: Aulas/espacios con características técnicas
- **Cronograma**: Programación de actividades
- **Sueldo**: Gestión de nómina
- **Evaluacion**: Calificaciones académicas

## 🧪 Datos de Ejemplo

El sistema incluye datos de ejemplo:

```python
# Usuarios predefinidos
admin@backoffice.com (Administrador)
profesor@backoffice.com (Profesor)
estudiante@backoffice.com (Estudiante)

# Password por defecto: "admin123"
```

## 🚀 Despliegue

### Con Docker (Recomendado)

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "run_server.py"]
```

### Con Gunicorn

```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker rest.app:app --bind 0.0.0.0:8000
```

## 🔧 Desarrollo

### Estructura de Archivos

```bash
# Crear nuevo controller
touch rest/controller/nuevo_controller.py

# Crear nuevo service
touch rest/service/nuevo_service.py

# Crear nuevo DAO
touch rest/dao/nuevo_dao.py

# Crear nuevo modelo
touch rest/models/nuevo_model.py

# Crear nuevo schema
touch rest/schemas/nuevo_schema.py
```

### Testing

```bash
# Instalar dependencias de testing
pip install pytest pytest-asyncio httpx

# Ejecutar tests
pytest tests/
```

## 📖 Documentación

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación en `/docs`
2. Verifica los logs del servidor
3. Consulta los issues en GitHub
4. Contacta al equipo de desarrollo

---

**Desarrollado con ❤️ para la gestión educativa moderna**
