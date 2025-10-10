# Schemas para el módulo BackOffice

from .rol_schema import Rol

from .usuario_schema import Usuario

from .usuario_rol_schema import (
    UsuarioRol,
    UsuarioConRoles
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
    SueldoDetallado
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

__all__ = [
    # Schemas principales
    "Rol",
    "Usuario", 
    "UsuarioRol",
    "Parametro",
    "Sede",
    "Espacio",
    "Sueldo",
    "Cronograma",
    "ClaseIndividual",
    "Evaluacion",
    
    # Schemas adicionales
    "UsuarioConRoles",
    "EspacioConSede", 
    "SueldoDetallado",
    "ClaseConCronograma",
    "EvaluacionConCronograma",
    
    # Enums
    "TipoEspacio",
    "EstadoEspacio",
    "EstadoClase",
    "TipoEvaluacion"
]