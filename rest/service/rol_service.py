from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.rol_dao import RolDAO
from ..schemas.rol_schema import RolCreate, RolUpdate, CategoriaRol
from ..models.rol_model import Rol
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
import uuid

class RolService:
    
    @staticmethod
    async def create_rol(db: AsyncSession, rol: RolCreate) -> Optional[Rol]:
        """Crear un nuevo rol"""
        # Verificar si ya existe un rol con el mismo nombre
        existing_rol = await RolDAO.get_by_nombre(db, rol.nombre_rol)
        if existing_rol:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Role with name '{rol.nombre_rol}' already exists"
            )
        
        return await RolDAO.create(db, rol)
    
    @staticmethod
    async def get_all_roles(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Rol]:
        """Obtener todos los roles activos"""
        return await RolDAO.get_all(db, skip, limit)
    
    @staticmethod
    async def get_rol_by_id(db: AsyncSession, rol_id: uuid.UUID) -> Optional[Rol]:
        """Obtener un rol por ID"""
        rol = await RolDAO.get_by_id(db, rol_id)
        if not rol:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Role with ID {rol_id} not found"
            )
        return rol
    
    @staticmethod
    async def search_roles(db: AsyncSession, param: str, value: str, skip: int = 0, limit: int = 100) -> List[Rol]:
        """Buscar roles por diferentes parámetros"""
        param_lower = param.lower()
        
        if param_lower == "id":
            try:
                rol_id = uuid.UUID(value)
                rol = await RolDAO.get_by_id(db, rol_id)
                return [rol] if rol else []
            except ValueError:
                return []
        
        elif param_lower in ["nombre", "nombre_rol"]:
            return await RolDAO.search_by_nombre(db, value, skip, limit)
        
        elif param_lower in ["categoria", "subcategoria"]:
            try:
                categoria = CategoriaRol(value.lower())
                return await RolDAO.get_by_categoria(db, categoria, skip, limit)
            except ValueError:
                return []
        
        return []
    
    @staticmethod
    async def update_rol(db: AsyncSession, rol_id: uuid.UUID, rol_update: RolUpdate) -> Optional[Rol]:
        """Actualizar un rol existente"""
        # Verificar si el rol existe
        existing_rol = await RolDAO.get_by_id(db, rol_id)
        if not existing_rol:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Role with ID {rol_id} not found"
            )
        
        # Si se está actualizando el nombre, verificar que no exista otro rol con ese nombre
        if rol_update.nombre_rol and rol_update.nombre_rol != existing_rol.nombre_rol:
            existing_name = await RolDAO.get_by_nombre(db, rol_update.nombre_rol)
            if existing_name and existing_name.id_rol != rol_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Role with name '{rol_update.nombre_rol}' already exists"
                )
        
        return await RolDAO.update(db, rol_id, rol_update)
    
    @staticmethod
    async def delete_rol(db: AsyncSession, rol_id: uuid.UUID) -> bool:
        """Eliminar (desactivar) un rol"""
        existing_rol = await RolDAO.get_by_id(db, rol_id)
        if not existing_rol:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Role with ID {rol_id} not found"
            )
        
        return await RolDAO.soft_delete(db, rol_id)
    
    @staticmethod
    async def get_all_categories(db: AsyncSession) -> List[str]:
        """Obtener todas las categorías de roles disponibles"""
        return await RolDAO.get_all_categories(db)
    
    @staticmethod
    async def get_categories_in_use(db: AsyncSession) -> List[Dict[str, Any]]:
        """Obtener las categorías que están siendo utilizadas"""
        return await RolDAO.get_roles_by_categories_in_use(db)
    
    @staticmethod
    async def get_roles_by_category(db: AsyncSession, categoria: str, skip: int = 0, limit: int = 100) -> List[Rol]:
        """Obtener roles por categoría"""
        try:
            categoria_enum = CategoriaRol(categoria.lower())
            return await RolDAO.get_by_categoria(db, categoria_enum, skip, limit)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid category: {categoria}. Valid categories: {[c.value for c in CategoriaRol]}"
            )