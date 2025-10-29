# BackOffice Platform

Aplicación full-stack para la gestión académica que combina un backend FastAPI asíncrono con un frontend React/Tailwind. La API expone servicios para usuarios, roles, sedes, espacios, parámetros, sueldos y clases individuales.

## Tech stack

- FastAPI 0.115+ con SQLAlchemy async y Pydantic
- PostgreSQL (principal) con modo mock para desarrollo sin base de datos
- React 19, Vite 7 y Tailwind CSS 4
- Axios con interceptor de autenticación

## Estructura del repositorio

```
backoffice/
├─ rest/                   API FastAPI
│  ├─ controller/          Capas de endpoints
│  ├─ service/             Reglas de negocio
│  ├─ dao/                 Acceso a datos con SQLAlchemy async
│  ├─ models/              Declaraciones ORM
│  ├─ schemas/             Esquemas Pydantic
│  ├─ app.py               Punto de entrada FastAPI
│  └─ database.py          Inicialización y pooling de base de datos
├─ web/                    Frontend React
│  ├─ src/api/             Clientes Axios hacia la API
│  ├─ src/components/      UI reutilizable y formularios CRUD
│  └─ vite.config.js       Configuración de Vite
├─ requirements.txt        Dependencias del backend
├─ README.md
└─ .env                    Variables del backend
```

## Requisitos

- Python 3.11 o superior
- Node.js 20 o superior y npm 10+
- PostgreSQL 14+ (opcional en local; se puede trabajar en modo mock)

## Puesta en marcha

### 1. Backend (FastAPI)

```cmd
cd backoffice
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Configura el archivo `.env` (se incluye uno de ejemplo) con al menos:

```
ENVIRONMENT=development
HOSTED_DATABASE_URL=postgresql://usuario:pass@host:puerto/base
DATABASE_URL=postgresql://usuario:pass@localhost:5432/backoffice_db
```

Para desarrollo puedes dejar `HOSTED_DATABASE_URL` vacío y apuntar `DATABASE_URL` a tu instancia local. Si ninguna conexión es válida, la API opera en modo mock y no realiza escrituras reales.

Inicia el backend:

```cmd
uvicorn rest.app:app --reload --host 0.0.0.0 --port 8000
```

La documentación interactiva queda disponible en `http://localhost:8000/docs`.

### 2. Frontend (React)

```cmd
cd web
npm install
npm run dev
```

El frontend consulta la API usando `axiosInstance`. Para cambiar el host expuesto, ajusta `web/src/api/axiosInstance.js` o crea una variable `VITE_API_BASE_URL` siguiendo las convenciones de Vite.

## Módulos expuestos por la API

| Módulo              | Prefijo                       | Descripción                                    |
| ------------------- | ----------------------------- | ---------------------------------------------- |
| Autenticación       | `/api/v1/auth`                | Login institucional y verificación de usuarios |
| Usuarios            | `/api/v1/usuarios`            | CRUD de usuarios y datos personales            |
| Roles               | `/api/v1/roles`               | Administración de roles y permisos             |
| Parámetros          | `/api/v1/parametros`          | Parámetros configurables del sistema           |
| Sedes               | `/api/v1/sedes`               | Gestión de ubicaciones físicas                 |
| Espacios            | `/api/v1/espacios`            | Aulas y espacios disponibles                   |
| Sueldos             | `/api/v1/sueldos`             | Gestión de nómina y liquidaciones              |
| Usuarios-Carreras   | `/api/v1/usuarios-carreras`   | Relación entre usuarios y carreras             |
| Clases Individuales | `/api/v1/clases-individuales` | Reservas y seguimiento de clases               |

## Conexión a base de datos

`rest/database.py` selecciona la conexión según el entorno:

1. `ENVIRONMENT=development` busca primero `HOSTED_DATABASE_URL`, luego `DATABASE_URL` local.
2. `ENVIRONMENT=production` toma `DATABASE_URL` (normalizado a `postgresql+asyncpg`).
3. Si ninguna conexión es válida, se activa un mock in-memory para evitar caídas durante desarrollo.

## Testing

```cmd
pip install pytest pytest-asyncio httpx
pytest
```

## Contribución

- CONTROLLER MANEJA ERRORES HTTP Y SERVICE NOOO!!!

## Soporte

- Documentación interactiva: `http://localhost:8000/docs`
- Revisión de logs: consola de Uvicorn y navegador
- Issues y mejoras: tablero de GitHub del repositorio
