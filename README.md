# BackOffice Platform

Plataforma full-stack para la gestión académica, con backend FastAPI asíncrono y frontend React + Vite + Tailwind. Permite administrar usuarios, roles, sedes, aulas, parámetros, sueldos, carreras y clases individuales.

---

## ¿Qué hace este proyecto?

BackOffice Platform centraliza la gestión académica de una institución:

- Permite CRUD de usuarios, roles, sedes y espacios físicos (aulas, laboratorios, etc).
- Administra parámetros globales, sueldos y la relación usuarios-carreras.
- Gestiona clases individuales y reservas.
- Incluye autenticación JWT y control de acceso por roles.
- El frontend ofrece formularios dinámicos, validaciones y búsqueda avanzada.

---

## Estructura del repositorio

```
backoffice/
├─ rest/                   # Backend FastAPI (API REST)
│  ├─ controller/          # Endpoints y rutas
│  ├─ service/             # Lógica de negocio
│  ├─ dao/                 # Acceso a datos (SQLAlchemy async)
│  ├─ models/              # Modelos ORM
│  ├─ schemas/             # Esquemas Pydantic
│  ├─ app.py               # Punto de entrada FastAPI
│  └─ database.py          # Configuración y pooling de base de datos
├─ web/                    # Frontend React + Vite
│  ├─ src/api/             # Clientes Axios hacia la API
│  ├─ src/components/      # Componentes y formularios reutilizables
│  └─ vite.config.js       # Configuración de Vite
├─ requirements.txt        # Dependencias del backend
├─ README.md
└─ .env                    # Variables de entorno backend
```

---

## Requisitos

- Python 3.11+
- Node.js 20+ y npm 10+
- PostgreSQL 14+ (opcional en local; modo mock disponible)

---

## Archivos `.env` requeridos

### Backend (`.env` en la raíz)

Ejemplo:

```env
ENVIRONMENT=development
HOSTED_DATABASE_URL=postgresql://usuario:pass@host:puerto/base
DATABASE_URL=postgresql://usuario:pass@localhost:5432/backoffice_db
RABBITMQ_URL=amqp://guest:guest@localhost:5672/
```

Puedes dejar `HOSTED_DATABASE_URL` vacío y usar solo `DATABASE_URL` para desarrollo local. Si ninguna conexión es válida, la API opera en modo mock (sin persistencia real).

### Frontend (`web/.env`)

Ejemplo:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Esto define la URL base para Axios en React.

---

## ¿Cómo ejecutar el backend?

1. Instala dependencias:
   ```bash
   cd backoffice
   python -m venv .venv
   source .venv/bin/activate  # o .venv\\Scripts\\activate en Windows
   pip install -r requirements.txt
   ```
2. Configura el archivo `.env` como se indica arriba.
3. Inicia el backend:
   ```bash
   uvicorn rest.app:app --reload --host 0.0.0.0 --port 8000
   ```
4. Accede a la documentación interactiva en: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ¿Cómo ejecutar el frontend?

1. Instala dependencias:
   ```bash
   cd web
   npm install
   ```
2. Crea o edita `web/.env` con la variable `VITE_API_BASE_URL` apuntando al backend.
3. Inicia el frontend:
   ```bash
   npm run dev
   ```
4. Accede a la app en: [http://localhost:5173](http://localhost:5173) (o el puerto que indique Vite)

---

## Descripción de los módulos principales

### Backend (FastAPI)

- **Usuarios**: CRUD, búsqueda avanzada, relación con carreras y roles.
- **Roles**: Definición de permisos y categorías (ADMINISTRADOR, DOCENTE, ALUMNO).
- **Sedes**: Gestión de ubicaciones físicas.
- **Espacios**: Aulas, laboratorios, oficinas, etc. Incluye disponibilidad y reservas.
- **Parámetros**: Configuración global del sistema.
- **Sueldos**: Gestión de nómina y liquidaciones.
- **Clases individuales**: Reservas, seguimiento y estados (programada, dictada, etc).
- **Autenticación**: Login JWT, verificación y control de acceso.

### Frontend (React)

- Formularios dinámicos y validaciones en tiempo real.
- Búsqueda y filtrado de entidades.
- Gestión de sesiones y autenticación.
- Integración con la API mediante Axios y variables de entorno.
- UI moderna con Tailwind y componentes reutilizables.

---

## Endpoints principales de la API

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

---

## Testing

```bash
pip install pytest pytest-asyncio httpx
pytest
```

---

## Contribución y soporte

- Los controladores (controller) manejan los errores HTTP; la lógica de negocio va en service.
- Documentación interactiva: [http://localhost:8000/docs](http://localhost:8000/docs)
- Revisión de logs: consola de Uvicorn y navegador
- Issues y mejoras: tablero de GitHub del repositorio
