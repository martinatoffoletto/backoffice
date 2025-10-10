from sqlalchemy.orm import Session, joinedload
from ..models.usuario_model import Usuario
from ..models.usuario_rol_model import UsuarioRol
from ..models.rol_model import Rol
from ..schemas.usuario_schema import Usuario as UsuarioSchema
from ..schemas.usuario_rol_schema import UsuarioConRoles
from typing import List, Optional
from datetime import datetime

class UsuarioDAO:
    
    @staticmethod
    def create(db: Session, usuario: UsuarioSchema) -> Usuario:
        """Crear un nuevo usuario"""
        db_usuario = Usuario(
            nombre=usuario.nombre,
            apellido=usuario.apellido,
            legajo=usuario.legajo,
            dni=usuario.dni,
            correo_institucional=usuario.correo_institucional,
            correo_personal=str(usuario.correo_personal),
            telefono_laboral=usuario.telefono_laboral,
            telefono_personal=usuario.telefono_personal,
            status=usuario.status
        )
        db.add(db_usuario)
        db.commit()
        db.refresh(db_usuario)
        return db_usuario
    
    @staticmethod
    def get_by_id(db: Session, id_usuario: int) -> Optional[Usuario]:
        """Obtener usuario por ID"""
        return db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Usuario]:
        """Obtener todos los usuarios activos"""
        return db.query(Usuario).filter(Usuario.status == True).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_legajo(db: Session, legajo: str) -> Optional[Usuario]:
        """Obtener usuario por legajo"""
        return db.query(Usuario).filter(Usuario.legajo == legajo).first()
    
    @staticmethod
    def get_by_dni(db: Session, dni: str) -> Optional[Usuario]:
        """Obtener usuario por DNI"""
        return db.query(Usuario).filter(Usuario.dni == dni).first()
    
    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[Usuario]:
        """Obtener usuario por email (personal o institucional)"""
        return db.query(Usuario).filter(
            (Usuario.correo_personal == email) | 
            (Usuario.correo_institucional == email)
        ).first()
    
    @staticmethod
    def search_by_nombre(db: Session, nombre: str) -> List[Usuario]:
        """Buscar usuarios por nombre o apellido (coincidencia parcial)"""
        return db.query(Usuario).filter(
            (Usuario.nombre.ilike(f"%{nombre}%") | 
             Usuario.apellido.ilike(f"%{nombre}%")),
            Usuario.status == True
        ).all()
    
    @staticmethod
    def get_with_roles(db: Session, id_usuario: int) -> Optional[UsuarioConRoles]:
        """Obtener usuario con sus roles"""
        usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
        if not usuario:
            return None
        
        # Obtener roles del usuario
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
    def update(db: Session, id_usuario: int, usuario_update: UsuarioSchema) -> Optional[Usuario]:
        """Actualizar un usuario"""
        db_usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
        if db_usuario:
            if usuario_update.nombre is not None:
                db_usuario.nombre = usuario_update.nombre
            if usuario_update.apellido is not None:
                db_usuario.apellido = usuario_update.apellido
            if usuario_update.legajo is not None:
                db_usuario.legajo = usuario_update.legajo
            if usuario_update.dni is not None:
                db_usuario.dni = usuario_update.dni
            if usuario_update.correo_institucional is not None:
                db_usuario.correo_institucional = usuario_update.correo_institucional
            if usuario_update.correo_personal is not None:
                db_usuario.correo_personal = str(usuario_update.correo_personal)
            if usuario_update.telefono_laboral is not None:
                db_usuario.telefono_laboral = usuario_update.telefono_laboral
            if usuario_update.telefono_personal is not None:
                db_usuario.telefono_personal = usuario_update.telefono_personal
            if usuario_update.status is not None:
                db_usuario.status = usuario_update.status
            
            db.commit()
            db.refresh(db_usuario)
        return db_usuario
    
    @staticmethod
    def soft_delete(db: Session, id_usuario: int) -> bool:
        """Soft delete: marcar usuario como inactivo"""
        db_usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
        if db_usuario:
            db_usuario.status = False
            db.commit()
            return True
        return False
    
    @staticmethod
    def exists_by_legajo(db: Session, legajo: str, exclude_id: Optional[int] = None) -> bool:
        """Verificar si existe un usuario con el legajo dado"""
        query = db.query(Usuario).filter(Usuario.legajo == legajo)
        if exclude_id:
            query = query.filter(Usuario.id_usuario != exclude_id)
        return query.first() is not None
    
    @staticmethod
    def exists_by_dni(db: Session, dni: str, exclude_id: Optional[int] = None) -> bool:
        """Verificar si existe un usuario con el DNI dado"""
        query = db.query(Usuario).filter(Usuario.dni == dni)
        if exclude_id:
            query = query.filter(Usuario.id_usuario != exclude_id)
        return query.first() is not None
    
    @staticmethod
    def exists_by_email(db: Session, email: str, exclude_id: Optional[int] = None) -> bool:
        """Verificar si existe un usuario con el email dado"""
        query = db.query(Usuario).filter(
            (Usuario.correo_personal == email) | 
            (Usuario.correo_institucional == email)
        )
        if exclude_id:
            query = query.filter(Usuario.id_usuario != exclude_id)
        return query.first() is not None