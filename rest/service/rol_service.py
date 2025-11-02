from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from ..dao.rol_dao import RolDAO
from ..schemas.rol_schema import RolBase, RolUpdate
from ..models.rol_model import Rol
from typing import List, Optional, Dict, Any, Tuple
import uuid

class RolService:
    
    @staticmethod
    async def create_rol(db: AsyncSession, rol: RolBase) -> Tuple[Optional[Rol], Optional[str]]:
        """Crear un nuevo rol"""
        try:
            created_rol = await RolDAO.create(db, rol)
            return created_rol, None
        except IntegrityError as e:
            error_message = str(e.orig)
            if "categoria" in error_message and "subcategoria" not in error_message:
                return None, f"Ya existe un rol con la categoría '{rol.categoria}'"
            elif "uq_rol_categoria_subcategoria" in error_message:
                return None, f"Ya existe la subcategoría '{rol.subcategoria}' en la categoría '{rol.categoria}'"
            else:
                return None, "Error de integridad al crear el rol"
    
    @staticmethod
    async def search_roles(db: AsyncSession, param: str, value: str, status_filter: Optional[bool] = None) -> List[Rol]:
        """Buscar roles por ID, categoría o subcategoría"""
        param_lower = param.lower()
        
        if param_lower == "id":
            try:
                rol_id = uuid.UUID(value)
                rol = await RolDAO.get_by_id(db, rol_id, status_filter)
                return [rol] if rol else []
            except ValueError:
                return []
        
        elif param_lower == "categoria":
            return await RolDAO.search_by_categoria(db, value, status_filter)
        
        elif param_lower == "subcategoria":
            return await RolDAO.get_by_subcategoria(db, value, status_filter)
        
        return []
    
    @staticmethod
    async def update_rol(db: AsyncSession, rol_id: uuid.UUID, rol_update: RolUpdate) -> Tuple[Optional[Rol], Optional[str]]:
        """Actualizar un rol existente"""
        # Verificar que el rol existe
        existing_rol = await RolDAO.get_by_id(db, rol_id, True)
        if not existing_rol:
            return None, "Rol no encontrado"
        
        try:
            updated_rol = await RolDAO.update(db, rol_id, rol_update)
            return updated_rol, None
        except IntegrityError as e:
            error_message = str(e.orig)
            if "categoria" in error_message and "subcategoria" not in error_message:
                return None, f"Ya existe un rol con la categoría '{rol_update.categoria}'"
            elif "uq_rol_categoria_subcategoria" in error_message:
                return None, f"Ya existe la subcategoría '{rol_update.subcategoria}' en la categoría especificada"
            else:
                return None, "Error de integridad al actualizar el rol"
    
    @staticmethod
    async def delete_rol(db: AsyncSession, rol_id: uuid.UUID) -> Tuple[bool, Optional[str]]:
        """Eliminar (desactivar) un rol"""
        # Verificar que el rol existe
        existing_rol = await RolDAO.get_by_id(db, rol_id, True)
        if not existing_rol:
            return False, "Rol no encontrado"
        
        success = await RolDAO.soft_delete(db, rol_id)
        return success, None
    
    @staticmethod
    async def get_categories_with_subcategories(db: AsyncSession, status_filter: Optional[bool] = None) -> List[Dict[str, Any]]:
        """Obtener todas las categorías con sus subcategorías"""
        return await RolDAO.get_categories_with_subcategories(db, status_filter)

    @staticmethod
    async def get_all_roles(db: AsyncSession, status_filter: Optional[bool] = None) -> List[Rol]:
        """Obtener todos los roles con filtro opcional por estado"""
        return await RolDAO.get_all(db, status_filter)