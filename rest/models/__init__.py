# Models para el módulo BackOffice
from .rol_model import Rol
from .usuario_model import Usuario
from .usuario_rol_model import UsuarioRol
from .parametro_model import Parametro
from .sede_model import Sede
from .espacio_model import Espacio, TipoEspacio, EstadoEspacio
from .sueldo_model import Sueldo
from .cronograma_model import Cronograma
from .clase_individual_model import ClaseIndividual, EstadoClase
from .evaluacion_model import Evaluacion, TipoEvaluacion

# Base común para todos los models
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

__all__ = [
    # Models principales
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
    
    # Enums
    "TipoEspacio",
    "EstadoEspacio",
    "EstadoClase",
    "TipoEvaluacion",
    
    # Base
    "Base"
]