# Schemas para el módulo BackOffice

from .rol_schema import (
    Rol,
    RolBase,
    RolCreate,
    RolUpdate,
    CategoriaRol
)

from .usuario_schema import (
    Usuario,
    UsuarioCreate,
    UsuarioUpdate
)

from .usuario_rol_schema import (
    UsuarioRol,
    UsuarioRolCreate,
    UsuarioConRoles,
    RolDetallado
)

from .parametro_schema import Parametro

from .sede_schema import Sede

from .espacio_schema import (
    Espacio,
    EspacioConSede,
    TipoEspacio,
    EstadoEspacio
)

from .sueldo_schema import (
    Sueldo,
    SueldoBase,
    SueldoCreate,
    SueldoUpdate
)

from .cronograma_schema import Cronograma

from .clase_individual_schema import (
    ClaseIndividual,
    ClaseConCronograma,
    EstadoClase
)

from .evaluacion_schema import (
    Evaluacion,
    EvaluacionConCronograma,
    TipoEvaluacion
)

from .evaluacion_schema import (
    Evaluacion,
    EvaluacionConCronograma,
    TipoEvaluacion
)

from .carrera_schema import (
    Carrera,
    CarreraCreate,
    CarreraUpdate,
    NivelCarrera
)
from .usuario_carrera_schema import UsuarioCarrera as SchemaUsuarioCarrera


__all__ = [
    # Schemas principales
    "Rol", "RolBase", "RolCreate", "RolUpdate",
    "Usuario", "UsuarioCreate", "UsuarioUpdate",
    "UsuarioRol", "UsuarioRolCreate",
    "Parametro",
    "Sede",
    "Espacio",
    "Sueldo", "SueldoBase", "SueldoCreate", "SueldoUpdate",
    "Cronograma",
    "ClaseIndividual",
    "Evaluacion",
    "Carrera",
    "UsuarioCarrera"

    # Schemas adicionales
    "UsuarioConRoles", "RolDetallado",
    "EspacioConSede", 
    "ClaseConCronograma",
    "EvaluacionConCronograma",
    
    # Enums
    "CategoriaRol",
    
    # Enums
    "TipoEspacio",
    "EstadoEspacio",
    "EstadoClase",
    "TipoEvaluacion",
    "NivelCarrera"
]