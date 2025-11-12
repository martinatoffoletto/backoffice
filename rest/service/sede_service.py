from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.sede_dao import SedeDAO
from ..schemas.sede_schema import SedeCreate, SedeUpdate, Sede
from typing import List, Optional
import uuid
from fastapi import HTTPException, status

class SedeService:
    
    @staticmethod
    async def create_sede(db: AsyncSession, sede: SedeCreate) -> dict:
        """Crear una nueva sede con validaciones"""
        # Validación de unicidad de nombre
        if await SedeDAO.exists_by_nombre(db, sede.nombre):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe una sede con el nombre '{sede.nombre}'"
            )
        
        # Crear la sede
        new_sede = await SedeDAO.create(db, sede)
        
        return {
            "message": "Sede creada exitosamente",
            "sede": Sede.model_validate(new_sede)
        }
    
    @staticmethod
    async def get_sede_by_id(db: AsyncSession, id_sede: uuid.UUID) -> dict:
        """Obtener sede por ID"""
        sede = await SedeDAO.get_by_id(db, id_sede)
        if not sede:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Sede con ID {id_sede} no encontrada"
            )
        
        return {
            "sede": Sede.model_validate(sede)
        }
    
    @staticmethod
    async def get_sede_by_nombre(db: AsyncSession, nombre: str) -> dict:
        """Obtener sede por nombre"""
        sede = await SedeDAO.get_by_nombre(db, nombre)
        if not sede:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Sede con nombre '{nombre}' no encontrada"
            )
        
        return {
            "sede": Sede.model_validate(sede)
        }
    
    @staticmethod
    async def get_all_sedes(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> dict:
        """Obtener todas las sedes con filtro opcional por status"""
        sedes = await SedeDAO.get_all(db, skip, limit, status_filter)
        
        return {
            "message": f"Se encontraron {len(sedes)} sedes",
            "sedes": [Sede.model_validate(sede) for sede in sedes],
            "count": len(sedes),
            "skip": skip,
            "limit": limit
        }
    
    @staticmethod
    async def search_sedes_by_nombre(db: AsyncSession, nombre_pattern: str, skip: int = 0, limit: int = 100) -> dict:
        """Buscar sedes por patrón en el nombre"""
        sedes = await SedeDAO.search_by_nombre(db, nombre_pattern, skip, limit)
        
        return {
            "message": f"Se encontraron {len(sedes)} sedes con nombre que contiene '{nombre_pattern}'",
            "sedes": [Sede.model_validate(sede) for sede in sedes],
            "search_pattern": nombre_pattern,
            "count": len(sedes),
            "skip": skip,
            "limit": limit
        }
    
    @staticmethod
    async def search_sedes_by_ubicacion(db: AsyncSession, ubicacion_pattern: str, skip: int = 0, limit: int = 100) -> dict:
        """Buscar sedes por patrón en la ubicación"""
        sedes = await SedeDAO.search_by_ubicacion(db, ubicacion_pattern, skip, limit)
        
        return {
            "message": f"Se encontraron {len(sedes)} sedes con ubicación que contiene '{ubicacion_pattern}'",
            "sedes": [Sede.model_validate(sede) for sede in sedes],
            "search_pattern": ubicacion_pattern,
            "count": len(sedes),
            "skip": skip,
            "limit": limit
        }
    
    @staticmethod
    async def update_sede(db: AsyncSession, id_sede: uuid.UUID, sede_update: SedeUpdate) -> dict:
        """Actualizar una sede existente"""
        # Verificar que existe
        existing_sede = await SedeDAO.get_by_id(db, id_sede, include_inactive=True)
        if not existing_sede:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Sede con ID {id_sede} no encontrada"
            )
        
        # Validar unicidad del nombre si se está actualizando
        if sede_update.nombre and sede_update.nombre != existing_sede.nombre:
            if await SedeDAO.exists_by_nombre(db, sede_update.nombre):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe una sede con el nombre '{sede_update.nombre}'"
                )
        
        # Actualizar
        updated_sede = await SedeDAO.update(db, id_sede, sede_update)
        
        return {
            "message": "Sede actualizada exitosamente",
            "sede": Sede.model_validate(updated_sede)
        }
    
    @staticmethod
    async def delete_sede(db: AsyncSession, id_sede: uuid.UUID) -> dict:
        """Eliminación lógica de una sede"""
        # Verificar que existe
        sede = await SedeDAO.get_by_id(db, id_sede)
        if not sede:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Sede con ID {id_sede} no encontrada"
            )
        
        # Eliminar lógicamente
        success = await SedeDAO.soft_delete(db, id_sede)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al eliminar la sede"
            )
        
        return {
            "message": "Sede eliminada exitosamente",
            "id_sede": id_sede
        }
    
    @staticmethod
    async def search(db: AsyncSession, param: str, value: str, skip: int = 0, limit: int = 100) -> List[Sede]:
        """Buscar sedes por diferentes parámetros"""
        param_lower = param.lower()
        sedes = []
        
        if param_lower in ["id", "id_sede"]:
            try:
                sede_uuid = uuid.UUID(value)
                sede = await SedeDAO.get_by_id(db, sede_uuid)
                sedes = [sede] if sede else []
            except ValueError:
                sedes = []
        
        elif param_lower in ["nombre", "search"]:
            sedes = await SedeDAO.search_by_nombre(db, value, skip, limit)
        
        elif param_lower == "ubicacion":
            sedes = await SedeDAO.search_by_ubicacion(db, value, skip, limit)
        
        elif param_lower == "status":
            status_bool = value.lower() in ["true", "1", "active"]
            sedes = await SedeDAO.get_all(db, skip, limit, status_bool)
        
        return [Sede.model_validate(s) for s in sedes if s]
