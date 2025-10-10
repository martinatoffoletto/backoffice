from sqlalchemy.orm import Session
from ..dao.rol_dao import RolDAO
from ..dao.usuario_rol_dao import UsuarioRolDAO
from ..schemas.rol_schema import Rol as RolSchema
from typing import List, Optional
from fastapi import HTTPException, status

class RolService:
    
    def __init__(self, db: Session):
        self.db = db
        self.rol_dao = RolDAO()
        self.usuario_rol_dao = UsuarioRolDAO()
    
    def create_rol(self, rol: RolSchema, created_by: str) -> dict:
        """Crear un nuevo rol con validaciones de negocio"""
        # Validar que no exista un rol con el mismo nombre
        if self.rol_dao.exists_by_nombre(self.db, rol.nombre_rol):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un rol con el nombre '{rol.nombre_rol}'"
            )
        
        # Asignar created_by
        rol.created_by = created_by
        
        # Crear el rol
        new_rol = self.rol_dao.create(self.db, rol)
        
        return {
            "message": "Rol creado exitosamente",
            "rol": new_rol,
            "created_by": created_by
        }
    
    def get_rol_by_id(self, id_rol: int) -> dict:
        """Obtener rol por ID con manejo de errores"""
        rol = self.rol_dao.get_by_id(self.db, id_rol)
        if not rol:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el rol con ID {id_rol}"
            )
        return {"rol": rol}
    
    def get_all_roles(self, skip: int = 0, limit: int = 100) -> dict:
        """Obtener todos los roles activos"""
        roles = self.rol_dao.get_all(self.db, skip, limit)
        total = len(roles)  # En producción podrías usar un count() optimizado
        
        return {
            "roles": roles,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    
    def search_roles(self, nombre_pattern: str, skip: int = 0, limit: int = 100) -> dict:
        """Buscar roles por patrón en el nombre"""
        roles = self.rol_dao.search_by_nombre(self.db, nombre_pattern, skip, limit)
        
        return {
            "roles": roles,
            "search_pattern": nombre_pattern,
            "total_found": len(roles),
            "skip": skip,
            "limit": limit
        }
    
    def update_rol(self, id_rol: int, rol_update: RolSchema, updated_by: str) -> dict:
        """Actualizar rol con validaciones"""
        # Verificar que el rol existe
        existing_rol = self.rol_dao.get_by_id(self.db, id_rol)
        if not existing_rol:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el rol con ID {id_rol}"
            )
        
        # Validar nombre único si se está actualizando
        if rol_update.nombre_rol and rol_update.nombre_rol != existing_rol.nombre_rol:
            if self.rol_dao.exists_by_nombre(self.db, rol_update.nombre_rol):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe un rol con el nombre '{rol_update.nombre_rol}'"
                )
        
        # Asignar updated_by
        rol_update.updated_by = updated_by
        
        # Actualizar
        updated_rol = self.rol_dao.update(self.db, id_rol, rol_update)
        
        return {
            "message": "Rol actualizado exitosamente",
            "rol": updated_rol,
            "updated_by": updated_by
        }
    
    def delete_rol(self, id_rol: int, deleted_by: str) -> dict:
        """Eliminar rol con validaciones de negocio"""
        # Verificar que el rol existe
        rol = self.rol_dao.get_by_id(self.db, id_rol)
        if not rol:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el rol con ID {id_rol}"
            )
        
        # Verificar que no hay usuarios asignados a este rol
        usuarios_con_rol = self.usuario_rol_dao.get_usuarios_by_rol(self.db, id_rol)
        if usuarios_con_rol:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No se puede eliminar el rol porque tiene {len(usuarios_con_rol)} usuarios asignados"
            )
        
        # Eliminar lógicamente
        success = self.rol_dao.soft_delete(self.db, id_rol, deleted_by)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al eliminar el rol"
            )
        
        return {
            "message": f"Rol '{rol.nombre_rol}' eliminado exitosamente",
            "deleted_by": deleted_by
        }
    
    def restore_rol(self, id_rol: int, updated_by: str) -> dict:
        """Restaurar rol eliminado"""
        success = self.rol_dao.restore(self.db, id_rol, updated_by)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró un rol eliminado con ID {id_rol}"
            )
        
        # Obtener el rol restaurado
        rol = self.rol_dao.get_by_id(self.db, id_rol)
        
        return {
            "message": f"Rol '{rol.nombre_rol}' restaurado exitosamente",
            "rol": rol,
            "restored_by": updated_by
        }
    
    def get_rol_statistics(self) -> dict:
        """Obtener estadísticas de roles"""
        all_roles = self.rol_dao.get_all(self.db, skip=0, limit=1000)  # Obtener todos
        
        # Contar usuarios por rol
        roles_with_users = []
        for rol in all_roles:
            usuarios = self.usuario_rol_dao.get_usuarios_by_rol(self.db, rol.id_rol)
            roles_with_users.append({
                "rol": rol,
                "total_usuarios": len(usuarios)
            })
        
        return {
            "total_roles": len(all_roles),
            "roles_detail": roles_with_users,
            "roles_sin_usuarios": [r for r in roles_with_users if r["total_usuarios"] == 0]
        }