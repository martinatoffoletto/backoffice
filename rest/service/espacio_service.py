from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.espacio_dao import EspacioDAO
from ..schemas.espacio_schema import EspacioCreate, EspacioUpdate, Espacio, EspacioConSede, ComedorInfo
from typing import List, Optional
import uuid

class EspacioService:
    
    @staticmethod
    async def create_espacio(db: AsyncSession, espacio: EspacioCreate) -> Espacio:
        """Crear un nuevo espacio"""
        # Verificar que no exista un espacio con el mismo nombre en esa sede
        exists = await EspacioDAO.exists_by_nombre_and_sede(db, espacio.nombre, espacio.id_sede)
        if exists:
            raise ValueError(f"Ya existe un espacio con el nombre '{espacio.nombre}' en esta sede")
        
        db_espacio = await EspacioDAO.create(db, espacio)
        return Espacio.model_validate(db_espacio)
    
    @staticmethod
    async def get_espacio_by_id(db: AsyncSession, id_espacio: uuid.UUID) -> Optional[Espacio]:
        """Obtener espacio por ID"""
        db_espacio = await EspacioDAO.get_by_id(db, id_espacio)
        if db_espacio:
            return Espacio.model_validate(db_espacio)
        return None
    
    @staticmethod
    async def get_all_espacios(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[Espacio]:
        """Obtener todos los espacios con filtro opcional por status"""
        db_espacios = await EspacioDAO.get_all(db, skip, limit, status_filter)
        return [Espacio.model_validate(espacio) for espacio in db_espacios]
    
    @staticmethod
    async def get_espacios_by_sede(db: AsyncSession, id_sede: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener espacios por sede"""
        db_espacios = await EspacioDAO.get_by_sede(db, id_sede, skip, limit)
        return [Espacio.model_validate(espacio) for espacio in db_espacios]
    
    @staticmethod
    async def get_espacios_by_tipo(db: AsyncSession, tipo: str, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener espacios por tipo"""
        db_espacios = await EspacioDAO.get_by_tipo(db, tipo, skip, limit)
        return [Espacio.model_validate(espacio) for espacio in db_espacios]
    
    @staticmethod
    async def search_espacios(db: AsyncSession, nombre_pattern: str, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Buscar espacios por patrón en el nombre"""
        db_espacios = await EspacioDAO.search_by_nombre(db, nombre_pattern, skip, limit)
        return [Espacio.model_validate(espacio) for espacio in db_espacios]
    
    @staticmethod
    async def get_espacios_by_capacity(db: AsyncSession, capacidad_minima: int, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener espacios con capacidad mayor a la especificada"""
        db_espacios = await EspacioDAO.get_with_capacity_greater_than(db, capacidad_minima, skip, limit)
        return [Espacio.model_validate(espacio) for espacio in db_espacios]
    
    @staticmethod
    async def filter_espacios(db: AsyncSession, 
                           id_sede: Optional[uuid.UUID] = None,
                           tipo: Optional[str] = None,
                           capacidad_minima: Optional[int] = None,
                           estado: Optional[str] = None,
                           skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener espacios aplicando múltiples filtros"""
        db_espacios = await EspacioDAO.get_by_filters(
            db, id_sede, tipo, capacidad_minima, estado, skip, limit
        )
        return [Espacio.model_validate(espacio) for espacio in db_espacios]
    
    @staticmethod
    async def get_espacio_with_sede(db: AsyncSession, id_espacio: uuid.UUID) -> Optional[EspacioConSede]:
        """Obtener espacio con información de la sede"""
        return await EspacioDAO.get_with_sede_info(db, id_espacio)
    
    @staticmethod
    async def update_espacio(db: AsyncSession, id_espacio: uuid.UUID, espacio_update: EspacioUpdate) -> Optional[Espacio]:
        """Actualizar un espacio existente"""
        # Verificar que el espacio existe
        existing_espacio = await EspacioDAO.get_by_id(db, id_espacio, include_inactive=True)
        if not existing_espacio:
            return None
        
        # Si se está actualizando el nombre, verificar unicidad (la sede no se puede cambiar)
        if espacio_update.nombre is not None:
            nombre_check = espacio_update.nombre
            # Solo verificar si el nombre es diferente al nombre actual
            if nombre_check != existing_espacio.nombre:
                # Usar la sede actual del espacio (no se puede cambiar)
                exists = await EspacioDAO.exists_by_nombre_and_sede(db, nombre_check, existing_espacio.id_sede)
                if exists:
                    raise ValueError(f"Ya existe un espacio con el nombre '{nombre_check}' en esta sede")
        
        db_espacio = await EspacioDAO.update(db, id_espacio, espacio_update)
        if db_espacio:
            return Espacio.model_validate(db_espacio)
        return None
    
    @staticmethod
    async def delete_espacio(db: AsyncSession, id_espacio: uuid.UUID) -> bool:
        """Eliminación lógica de un espacio"""
        return await EspacioDAO.soft_delete(db, id_espacio)
    
    @staticmethod
    async def count_espacios_by_sede(db: AsyncSession, id_sede: uuid.UUID) -> int:
        """Contar espacios activos por sede"""
        return await EspacioDAO.count_by_sede(db, id_sede)
    
    @staticmethod
    async def search(db: AsyncSession, param: str, value: str, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Buscar espacios por diferentes parámetros"""
        param_lower = param.lower()
        espacios = []
        
        if param_lower in ["id", "id_espacio"]:
            try:
                espacio_uuid = uuid.UUID(value)
                espacio = await EspacioDAO.get_by_id(db, espacio_uuid)
                espacios = [espacio] if espacio else []
            except ValueError:
                espacios = []
        
        elif param_lower == "nombre":
            espacios = await EspacioDAO.search_by_nombre(db, value, skip, limit)
        
        elif param_lower == "tipo":
            espacios = await EspacioDAO.get_by_tipo(db, value, skip, limit)
        
        elif param_lower in ["estado", "estado_espacio"]:
            # Buscar por estado
            espacios = await EspacioDAO.get_by_filters(db, estado=value, skip=skip, limit=limit)
        
        elif param_lower == "sede" or param_lower == "id_sede":
            try:
                sede_uuid = uuid.UUID(value)
                espacios = await EspacioDAO.get_by_sede(db, sede_uuid, skip, limit)
            except ValueError:
                espacios = []
        
        elif param_lower == "capacidad":
            try:
                capacidad_min = int(value)
                espacios = await EspacioDAO.get_with_capacity_greater_than(db, capacidad_min, skip, limit)
            except ValueError:
                espacios = []
        
        elif param_lower == "status":
            status_bool = value.lower() in ["true", "1", "active"]
            espacios = await EspacioDAO.get_all(db, skip, limit, status_bool)
        
        return [Espacio.model_validate(espacio) for espacio in espacios if espacio]
    
    @staticmethod
    async def get_comedores_by_sede(db: AsyncSession, id_sede: uuid.UUID) -> List[ComedorInfo]:
        """Obtener comedores de una sede con nombre y capacidad"""
        db_comedores = await EspacioDAO.get_comedores_by_sede(db, id_sede)
        return [
            ComedorInfo(
                nombre=comedor.nombre,
                capacidad=comedor.capacidad
            )
            for comedor in db_comedores
        ]
