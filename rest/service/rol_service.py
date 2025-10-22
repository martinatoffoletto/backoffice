from sqlalchemy.orm import Session
from ..dao.rol_dao import RolDAO
from ..dao.usuario_rol_dao import UsuarioRolDAO
from ..schemas.rol_schema import RolCreate, RolUpdate, CategoriaRol
from ..models.rol_model import Rol
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
import uuid

class RolService:
    
    @staticmethod
    def create_rol(db: Session, rol: RolCreate) -> Optional[Rol]:
        """Crear un nuevo rol"""
        rol_dao = RolDAO()
        
        # Verificar si ya existe un rol con el mismo nombre
        existing_rol = rol_dao.get_by_nombre(db, rol.nombre_rol)
        if existing_rol:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Role with name '{rol.nombre_rol}' already exists"
            )
        
        return rol_dao.create(db, rol)
    
    @staticmethod
    def get_all_roles(db: Session, skip: int = 0, limit: int = 100) -> List[Rol]:
        """Obtener todos los roles activos"""
        rol_dao = RolDAO()
        return rol_dao.get_all(db, skip, limit)
    
    @staticmethod
    def get_rol_by_id(db: Session, rol_id: uuid.UUID) -> Optional[Rol]:
        """Obtener un rol por ID"""
        rol_dao = RolDAO()
        rol = rol_dao.get_by_id(db, rol_id)
        if not rol:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Role with ID {rol_id} not found"
            )
        return rol
    
    @staticmethod
    def search_roles(db: Session, param: str, value: str, skip: int = 0, limit: int = 100) -> List[Rol]:
        """Buscar roles por diferentes parámetros"""
        rol_dao = RolDAO()
        param_lower = param.lower()
        
        if param_lower == "id":
            try:
                rol_id = uuid.UUID(value)
                rol = rol_dao.get_by_id(db, rol_id)
                return [rol] if rol else []
            except ValueError:
                return []
        
        elif param_lower in ["nombre", "nombre_rol"]:
            return rol_dao.search_by_nombre(db, value, skip, limit)
        
        elif param_lower in ["categoria", "subcategoria"]:
            try:
                categoria = CategoriaRol(value.lower())
                return rol_dao.get_by_categoria(db, categoria, skip, limit)
            except ValueError:
                return []
        
        return []
    
    @staticmethod
    def update_rol(db: Session, rol_id: uuid.UUID, rol_update: RolUpdate) -> Optional[Rol]:
        """Actualizar un rol existente"""
        rol_dao = RolDAO()
        
        # Verificar si el rol existe
        existing_rol = rol_dao.get_by_id(db, rol_id)
        if not existing_rol:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Role with ID {rol_id} not found"
            )
        
        # Si se está actualizando el nombre, verificar que no exista otro rol con ese nombre
        if rol_update.nombre_rol and rol_update.nombre_rol != existing_rol.nombre_rol:
            existing_name = rol_dao.get_by_nombre(db, rol_update.nombre_rol)
            if existing_name and existing_name.id_rol != rol_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Role with name '{rol_update.nombre_rol}' already exists"
                )
        
        return rol_dao.update(db, rol_id, rol_update)
    
    @staticmethod
    def delete_rol(db: Session, rol_id: uuid.UUID) -> bool:
        """Eliminar (desactivar) un rol"""
        rol_dao = RolDAO()
        
        existing_rol = rol_dao.get_by_id(db, rol_id)
        if not existing_rol:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Role with ID {rol_id} not found"
            )
    
        
        return rol_dao.soft_delete(db, rol_id)
    
    @staticmethod
    def get_all_categories(db: Session) -> List[str]:
        """Obtener todas las categorías de roles disponibles"""
        rol_dao = RolDAO()
        return rol_dao.get_all_categories(db)
    
    @staticmethod
    def get_categories_in_use(db: Session) -> List[Dict[str, Any]]:
        """Obtener las categorías que están siendo utilizadas"""
        rol_dao = RolDAO()
        return rol_dao.get_roles_by_categories_in_use(db)
    
    @staticmethod
    def get_roles_by_category(db: Session, categoria: str, skip: int = 0, limit: int = 100) -> List[Rol]:
        """Obtener roles por categoría"""
        rol_dao = RolDAO()
        try:
            categoria_enum = CategoriaRol(categoria.lower())
            return rol_dao.get_by_categoria(db, categoria_enum, skip, limit)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid category: {categoria}. Valid categories: {[c.value for c in CategoriaRol]}"
            )