# Schemas para el módulo BackOffice

from .auth_schema import (
    LoginRequest,
    AuthResponse
)

from .rol_schema import (
    Rol,
    RolBase,
    RolUpdate
)

from .usuario_schema import (
    Usuario,
    UsuarioCreate,
    UsuarioUpdate
)

from .usuario_carrera_schema import (
    UsuarioCarrera,
    UsuarioCarreraCreate
)

from .parametro_schema import (
    Parametro,
    ParametroCreate,
    ParametroUpdate
)

from .sede_schema import (
    Sede,
    SedeCreate,
    SedeUpdate
)

from .espacio_schema import (
    Espacio,
    EspacioCreate,
    EspacioUpdate,
    EspacioConSede,
    TipoEspacio,
    EstadoEspacio
)

from .sueldo_schema import (
    Sueldo,
    SueldoBase,
    SueldoUpdate
)

from .clase_individual_schema import (
    ClaseIndividual,
    ClaseIndividualCreate,
    ClaseIndividualUpdate,
    ClaseIndividualResponse,
    ClaseEstadisticas,
    EstadoClase,
    TipoClase
)

__all__ = [
    # Auth
    "LoginRequest",
    "AuthResponse",
    
    # Rol
    "Rol",
    "RolBase", 
    "RolUpdate",
    
    # Usuario
    "Usuario",
    "UsuarioCreate",
    "UsuarioUpdate",
    
    # Usuario Carrera
    "UsuarioCarrera",
    "UsuarioCarreraCreate",
    
    # Parametro
    "Parametro",
    "ParametroCreate",
    "ParametroUpdate",
    
    # Sede
    "Sede",
    "SedeCreate",
    "SedeUpdate",
    
    # Espacio
    "Espacio",
    "EspacioCreate",
    "EspacioUpdate",
    "EspacioConSede",
    "TipoEspacio",
    "EstadoEspacio",
    
    # Sueldo
    "Sueldo",
    "SueldoBase",
    "SueldoCreate", 
    "SueldoUpdate",
    
    # Clase Individual
    "ClaseIndividual",
    "ClaseIndividualCreate",
    "ClaseIndividualUpdate",
    "ClaseIndividualResponse",
    "ClaseEstadisticas",
    "EstadoClase",
    "TipoClase"
]