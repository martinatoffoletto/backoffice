from sqlalchemy.orm import Session
from ..models.usuario_rol_model import UsuarioRol
from ..models.usuario_model import Usuario
from ..models.rol_model import Rol
from ..schemas.usuario_rol_schema import UsuarioRol as UsuarioRolSchema, UsuarioConRoles
from typing import List, Optional

class UsuarioRolDAO:
    
    @staticmethod
    def create(db: Session, usuario_rol: UsuarioRolSchema) -> UsuarioRol:
        """Asignar un rol a un usuario"""
        db_usuario_rol = UsuarioRol(
            id_usuario=usuario_rol.id_usuario,
            id_rol=usuario_rol.id_rol
        )
        db.add(db_usuario_rol)
        db.commit()
        db.refresh(db_usuario_rol)
        return db_usuario_rol
    
    @staticmethod
    def get_by_usuario_rol(db: Session, id_usuario: int, id_rol: int) -> Optional[UsuarioRol]:
        """Obtener relación específica usuario-rol"""
        return db.query(UsuarioRol).filter(
            UsuarioRol.id_usuario == id_usuario,
            UsuarioRol.id_rol == id_rol
        ).first()
    
    @staticmethod
    def get_roles_by_usuario(db: Session, id_usuario: int) -> List[UsuarioRol]:
        """Obtener todos los roles de un usuario"""
        return db.query(UsuarioRol).filter(UsuarioRol.id_usuario == id_usuario).all()
    
    @staticmethod
    def get_usuarios_by_rol(db: Session, id_rol: int) -> List[UsuarioRol]:
        """Obtener todos los usuarios que tienen un rol específico"""
        return db.query(UsuarioRol).filter(UsuarioRol.id_rol == id_rol).all()
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[UsuarioRol]:
        """Obtener todas las relaciones usuario-rol"""
        return db.query(UsuarioRol).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_usuario_with_roles_detailed(db: Session, id_usuario: int) -> Optional[UsuarioConRoles]:
        """Obtener usuario con información detallada de sus roles"""
        usuario = db.query(Usuario).filter(
            Usuario.id_usuario == id_usuario,
            Usuario.status == True
        ).first()
        
        if not usuario:
            return None
        
        # Obtener roles activos del usuario
        roles = db.query(Rol.nombre_rol).join(UsuarioRol).filter(
            UsuarioRol.id_usuario == id_usuario,
            Rol.status == True
        ).all()
        
        return UsuarioConRoles(
            id_usuario=usuario.id_usuario,
            nombre=usuario.nombre,
            apellido=usuario.apellido,
            legajo=usuario.legajo,
            roles=[rol.nombre_rol for rol in roles]
        )
    
    @staticmethod
    def get_usuarios_with_rol_name(db: Session, nombre_rol: str) -> List[UsuarioConRoles]:
        """Obtener todos los usuarios que tienen un rol específico por nombre"""
        usuarios_con_rol = db.query(Usuario, Rol.nombre_rol).join(UsuarioRol).join(Rol).filter(
            Rol.nombre_rol == nombre_rol,
            Usuario.status == True,
            Rol.status == True
        ).all()
        
        result = []
        for usuario, rol_nombre in usuarios_con_rol:
            # Obtener todos los roles del usuario
            roles = db.query(Rol.nombre_rol).join(UsuarioRol).filter(
                UsuarioRol.id_usuario == usuario.id_usuario,
                Rol.status == True
            ).all()
            
            result.append(UsuarioConRoles(
                id_usuario=usuario.id_usuario,
                nombre=usuario.nombre,
                apellido=usuario.apellido,
                legajo=usuario.legajo,
                roles=[rol.nombre_rol for rol in roles]
            ))
        
        return result
    
    @staticmethod
    def delete(db: Session, id_usuario: int, id_rol: int) -> bool:
        """Remover un rol específico de un usuario"""
        db_usuario_rol = db.query(UsuarioRol).filter(
            UsuarioRol.id_usuario == id_usuario,
            UsuarioRol.id_rol == id_rol
        ).first()
        
        if db_usuario_rol:
            db.delete(db_usuario_rol)
            db.commit()
            return True
        return False
    
    @staticmethod
    def delete_all_roles_from_usuario(db: Session, id_usuario: int) -> int:
        """Remover todos los roles de un usuario específico"""
        deleted_count = db.query(UsuarioRol).filter(
            UsuarioRol.id_usuario == id_usuario
        ).delete()
        db.commit()
        return deleted_count
    
    @staticmethod
    def delete_all_usuarios_from_rol(db: Session, id_rol: int) -> int:
        """Remover todos los usuarios de un rol específico"""
        deleted_count = db.query(UsuarioRol).filter(
            UsuarioRol.id_rol == id_rol
        ).delete()
        db.commit()
        return deleted_count
    
    @staticmethod
    def exists(db: Session, id_usuario: int, id_rol: int) -> bool:
        """Verificar si existe la relación usuario-rol"""
        return db.query(UsuarioRol).filter(
            UsuarioRol.id_usuario == id_usuario,
            UsuarioRol.id_rol == id_rol
        ).first() is not None
    
    @staticmethod
    def usuario_has_rol(db: Session, id_usuario: int, nombre_rol: str) -> bool:
        """Verificar si un usuario tiene un rol específico por nombre"""
        return db.query(UsuarioRol).join(Rol).filter(
            UsuarioRol.id_usuario == id_usuario,
            Rol.nombre_rol == nombre_rol,
            Rol.status == True
        ).first() is not None