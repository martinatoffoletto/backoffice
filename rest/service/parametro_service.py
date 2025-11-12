from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.parametro_dao import ParametroDAO
from ..schemas.parametro_schema import ParametroCreate, ParametroUpdate, Parametro
from typing import List, Optional, Dict
from fastapi import HTTPException, status
import uuid

class ParametroService:
    
    @staticmethod
    async def create_parametro(db: AsyncSession, parametro: ParametroCreate) -> dict:
        """Crear un nuevo parámetro del sistema"""
        # Validar que no exista un parámetro con el mismo nombre
        if await ParametroDAO.exists_by_nombre(db, parametro.nombre):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un parámetro con el nombre '{parametro.nombre}'"
            )
        
        # Crear el parámetro
        new_parametro = await ParametroDAO.create(db, parametro)
        
        return {
            "message": "Parámetro creado exitosamente",
            "parametro": Parametro.model_validate(new_parametro)
        }
    
    @staticmethod
    async def get_parametro_by_id(db: AsyncSession, id_parametro: uuid.UUID) -> dict:
        """Obtener parámetro por ID"""
        parametro = await ParametroDAO.get_by_id(db, id_parametro)
        if not parametro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el parámetro con ID {id_parametro}"
            )
        return {
            "parametro": Parametro.model_validate(parametro)
        }
    
    @staticmethod
    async def get_parametro_by_nombre(db: AsyncSession, nombre: str) -> dict:
        """Obtener parámetro por nombre"""
        parametro = await ParametroDAO.get_by_nombre(db, nombre)
        if not parametro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el parámetro con nombre '{nombre}'"
            )
        return {
            "parametro": Parametro.model_validate(parametro)
        }
    
    @staticmethod
    async def get_parametro_valores(db: AsyncSession, nombre: str) -> dict:
        """Obtener los valores de un parámetro"""
        valores = await ParametroDAO.get_valores_by_nombre(db, nombre)
        if valores is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el parámetro con nombre '{nombre}'"
            )
        return {"nombre": nombre, "valores": valores}
    
    @staticmethod
    async def get_all_parametros(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> dict:
        """Obtener todos los parámetros con filtro opcional por status"""
        parametros = await ParametroDAO.get_all(db, skip, limit, status_filter)
        
        return {
            "message": f"Se encontraron {len(parametros)} parámetros",
            "parametros": [Parametro.model_validate(p) for p in parametros],
            "count": len(parametros),
            "skip": skip,
            "limit": limit
        }
    
    @staticmethod
    async def get_parametros_by_tipo(db: AsyncSession, tipo: str, skip: int = 0, limit: int = 100) -> dict:
        """Obtener parámetros por tipo"""
        parametros = await ParametroDAO.get_by_tipo(db, tipo, skip, limit)
        
        return {
            "message": f"Se encontraron {len(parametros)} parámetros del tipo '{tipo}'",
            "parametros": [Parametro.model_validate(p) for p in parametros],
            "tipo": tipo,
            "count": len(parametros),
            "skip": skip,
            "limit": limit
        }

    @staticmethod
    async def search_parametros_by_nombre(db: AsyncSession, nombre_pattern: str, skip: int = 0, limit: int = 100) -> dict:
        """Buscar parámetros por nombre"""
        parametros = await ParametroDAO.search_by_nombre(db, nombre_pattern, skip, limit)
        
        return {
            "message": f"Se encontraron {len(parametros)} parámetros que contienen '{nombre_pattern}'",
            "parametros": [Parametro.model_validate(p) for p in parametros],
            "search_pattern": nombre_pattern,
            "count": len(parametros),
            "skip": skip,
            "limit": limit
        }
    
    @staticmethod
    async def update_parametro(db: AsyncSession, id_parametro: uuid.UUID, parametro_update: ParametroUpdate) -> dict:
        """Actualizar parámetro con validaciones"""
        # Verificar que existe
        existing_parametro = await ParametroDAO.get_by_id(db, id_parametro, include_inactive=True)
        if not existing_parametro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el parámetro con ID {id_parametro}"
            )
        
        # Validar unicidad del nombre si se está actualizando
        if parametro_update.nombre and parametro_update.nombre != existing_parametro.nombre:
            if await ParametroDAO.exists_by_nombre(db, parametro_update.nombre, exclude_id=id_parametro):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe un parámetro con el nombre '{parametro_update.nombre}'"
                )
        
        # Actualizar
        updated_parametro = await ParametroDAO.update(db, id_parametro, parametro_update)
        
        return {
            "message": "Parámetro actualizado exitosamente",
            "parametro": Parametro.model_validate(updated_parametro)
        }
    
    @staticmethod
    async def delete_parametro(db: AsyncSession, id_parametro: uuid.UUID) -> dict:
        """Eliminar parámetro lógicamente"""
        # Verificar que existe
        parametro = await ParametroDAO.get_by_id(db, id_parametro)
        if not parametro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el parámetro con ID {id_parametro}"
            )
        
        # Eliminar lógicamente
        success = await ParametroDAO.soft_delete(db, id_parametro)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al eliminar el parámetro"
            )
        
        return {
            "message": f"Parámetro '{parametro.nombre}' eliminado exitosamente",
            "id_parametro": id_parametro
        }
    
    @staticmethod
    async def get_all_tipos(db: AsyncSession) -> List[str]:
        """Obtener todos los tipos de parámetros disponibles"""
        return await ParametroDAO.get_all_tipos(db)
    
    @staticmethod
    async def search(db: AsyncSession, param: str, value: str, skip: int = 0, limit: int = 100) -> List[Parametro]:
        """Buscar parámetros por diferentes parámetros"""
        param_lower = param.lower()
        parametros = []
        
        if param_lower in ["id", "id_parametro"]:
            try:
                parametro_uuid = uuid.UUID(value)
                parametro = await ParametroDAO.get_by_id(db, parametro_uuid)
                parametros = [parametro] if parametro else []
            except ValueError:
                parametros = []
        
        elif param_lower in ["nombre", "search"]:
            parametros = await ParametroDAO.search_by_nombre(db, value, skip, limit)
        
        elif param_lower == "tipo":
            parametros = await ParametroDAO.get_by_tipo(db, value, skip, limit)
        
        elif param_lower == "status":
            status_bool = value.lower() in ["true", "1", "active"]
            parametros = await ParametroDAO.get_all(db, skip, limit, status_bool)
        
        return [Parametro.model_validate(p) for p in parametros if p]