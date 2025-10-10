from sqlalchemy.orm import Session
from ..dao.usuario_dao import UsuarioDAO
from ..dao.usuario_rol_dao import UsuarioRolDAO
from ..dao.rol_dao import RolDAO
from ..schemas.usuario_schema import Usuario as UsuarioSchema
from ..schemas.usuario_rol_schema import UsuarioRol as UsuarioRolSchema
from typing import List, Optional
from fastapi import HTTPException, status
import bcrypt

class UsuarioService:
    
    def __init__(self, db: Session):
        self.db = db
        self.usuario_dao = UsuarioDAO()
        self.usuario_rol_dao = UsuarioRolDAO()
        self.rol_dao = RolDAO()
    
    def create_usuario(self, usuario: UsuarioSchema, created_by: str) -> dict:
        """Crear un nuevo usuario con validaciones de negocio"""
        # Validaciones de unicidad
        if self.usuario_dao.exists_by_legajo(self.db, usuario.legajo):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un usuario con el legajo '{usuario.legajo}'"
            )
        
        if self.usuario_dao.exists_by_dni(self.db, usuario.dni):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un usuario con el DNI '{usuario.dni}'"
            )
        
        if self.usuario_dao.exists_by_email(self.db, usuario.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un usuario con el email '{usuario.email}'"
            )
        
        # Encriptar password si se proporciona
        if usuario.password:
            hashed_password = bcrypt.hashpw(usuario.password.encode('utf-8'), bcrypt.gensalt())
            usuario.password = hashed_password.decode('utf-8')
        
        # Asignar created_by
        usuario.created_by = created_by
        
        # Crear el usuario
        new_usuario = self.usuario_dao.create(self.db, usuario)
        
        return {
            "message": "Usuario creado exitosamente",
            "usuario": {
                "id_usuario": new_usuario.id_usuario,
                "legajo": new_usuario.legajo,
                "nombre": new_usuario.nombre,
                "apellido": new_usuario.apellido,
                "email": new_usuario.email,
                "dni": new_usuario.dni
            },
            "created_by": created_by
        }
    
    def get_usuario_by_id(self, id_usuario: int, include_roles: bool = False) -> dict:
        """Obtener usuario por ID con opción de incluir roles"""
        usuario = self.usuario_dao.get_by_id(self.db, id_usuario)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el usuario con ID {id_usuario}"
            )
        
        result = {"usuario": usuario}
        
        if include_roles:
            usuario_con_roles = self.usuario_rol_dao.get_usuario_with_roles_detailed(self.db, id_usuario)
            if usuario_con_roles:
                result["roles"] = usuario_con_roles.roles
        
        return result
    
    def get_all_usuarios(self, skip: int = 0, limit: int = 100, include_roles: bool = False) -> dict:
        """Obtener todos los usuarios activos"""
        usuarios = self.usuario_dao.get_all(self.db, skip, limit)
        
        result = {
            "usuarios": usuarios,
            "total": len(usuarios),
            "skip": skip,
            "limit": limit
        }
        
        if include_roles:
            usuarios_with_roles = []
            for usuario in usuarios:
                usuario_con_roles = self.usuario_rol_dao.get_usuario_with_roles_detailed(self.db, usuario.id_usuario)
                usuarios_with_roles.append({
                    "usuario": usuario,
                    "roles": usuario_con_roles.roles if usuario_con_roles else []
                })
            result["usuarios_with_roles"] = usuarios_with_roles
        
        return result
    
    def search_usuarios(self, search_term: str, skip: int = 0, limit: int = 100) -> dict:
        """Buscar usuarios por nombre, apellido, legajo, DNI o email"""
        usuarios = self.usuario_dao.search_by_nombre(self.db, search_term, skip, limit)
        
        # También buscar por legajo, DNI o email si no se encontraron por nombre
        if not usuarios:
            usuario_by_legajo = self.usuario_dao.get_by_legajo(self.db, search_term)
            if usuario_by_legajo:
                usuarios = [usuario_by_legajo]
            else:
                usuario_by_dni = self.usuario_dao.get_by_dni(self.db, search_term)
                if usuario_by_dni:
                    usuarios = [usuario_by_dni]
                else:
                    usuario_by_email = self.usuario_dao.get_by_email(self.db, search_term)
                    if usuario_by_email:
                        usuarios = [usuario_by_email]
        
        return {
            "usuarios": usuarios,
            "search_term": search_term,
            "total_found": len(usuarios),
            "skip": skip,
            "limit": limit
        }
    
    def update_usuario(self, id_usuario: int, usuario_update: UsuarioSchema, updated_by: str) -> dict:
        """Actualizar usuario con validaciones"""
        # Verificar que el usuario existe
        existing_usuario = self.usuario_dao.get_by_id(self.db, id_usuario)
        if not existing_usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el usuario con ID {id_usuario}"
            )
        
        # Validaciones de unicidad para campos que cambian
        if usuario_update.legajo and usuario_update.legajo != existing_usuario.legajo:
            if self.usuario_dao.exists_by_legajo(self.db, usuario_update.legajo):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe un usuario con el legajo '{usuario_update.legajo}'"
                )
        
        if usuario_update.dni and usuario_update.dni != existing_usuario.dni:
            if self.usuario_dao.exists_by_dni(self.db, usuario_update.dni):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe un usuario con el DNI '{usuario_update.dni}'"
                )
        
        if usuario_update.email and usuario_update.email != existing_usuario.email:
            if self.usuario_dao.exists_by_email(self.db, usuario_update.email):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe un usuario con el email '{usuario_update.email}'"
                )
        
        # Encriptar nueva password si se proporciona
        if usuario_update.password:
            hashed_password = bcrypt.hashpw(usuario_update.password.encode('utf-8'), bcrypt.gensalt())
            usuario_update.password = hashed_password.decode('utf-8')
        
        # Asignar updated_by
        usuario_update.updated_by = updated_by
        
        # Actualizar
        updated_usuario = self.usuario_dao.update(self.db, id_usuario, usuario_update)
        
        return {
            "message": "Usuario actualizado exitosamente",
            "usuario": {
                "id_usuario": updated_usuario.id_usuario,
                "legajo": updated_usuario.legajo,
                "nombre": updated_usuario.nombre,
                "apellido": updated_usuario.apellido,
                "email": updated_usuario.email,
                "dni": updated_usuario.dni
            },
            "updated_by": updated_by
        }
    
    def change_password(self, id_usuario: int, old_password: str, new_password: str, updated_by: str) -> dict:
        """Cambiar password del usuario"""
        usuario = self.usuario_dao.get_by_id(self.db, id_usuario)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el usuario con ID {id_usuario}"
            )
        
        # Verificar password actual
        if not bcrypt.checkpw(old_password.encode('utf-8'), usuario.password.encode('utf-8')):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La contraseña actual es incorrecta"
            )
        
        # Encriptar nueva password
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        
        # Crear objeto para actualizar solo la password
        usuario_update = UsuarioSchema()
        usuario_update.password = hashed_password.decode('utf-8')
        usuario_update.updated_by = updated_by
        
        # Actualizar
        self.usuario_dao.update(self.db, id_usuario, usuario_update)
        
        return {
            "message": "Contraseña actualizada exitosamente",
            "updated_by": updated_by
        }
    
    def assign_role(self, id_usuario: int, id_rol: int, assigned_by: str) -> dict:
        """Asignar rol a usuario"""
        # Verificar que el usuario existe
        usuario = self.usuario_dao.get_by_id(self.db, id_usuario)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el usuario con ID {id_usuario}"
            )
        
        # Verificar que el rol existe
        rol = self.rol_dao.get_by_id(self.db, id_rol)
        if not rol:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el rol con ID {id_rol}"
            )
        
        # Verificar que no esté ya asignado
        if self.usuario_rol_dao.exists(self.db, id_usuario, id_rol):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El usuario ya tiene asignado el rol '{rol.nombre_rol}'"
            )
        
        # Crear la asignación
        usuario_rol = UsuarioRolSchema(id_usuario=id_usuario, id_rol=id_rol)
        new_assignment = self.usuario_rol_dao.create(self.db, usuario_rol)
        
        return {
            "message": f"Rol '{rol.nombre_rol}' asignado exitosamente al usuario '{usuario.nombre} {usuario.apellido}'",
            "assignment": new_assignment,
            "assigned_by": assigned_by
        }
    
    def remove_role(self, id_usuario: int, id_rol: int, removed_by: str) -> dict:
        """Remover rol de usuario"""
        # Verificar que la asignación existe
        if not self.usuario_rol_dao.exists(self.db, id_usuario, id_rol):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontró la asignación de rol especificada"
            )
        
        # Obtener información para el mensaje
        usuario = self.usuario_dao.get_by_id(self.db, id_usuario)
        rol = self.rol_dao.get_by_id(self.db, id_rol)
        
        # Remover la asignación
        success = self.usuario_rol_dao.delete(self.db, id_usuario, id_rol)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al remover el rol del usuario"
            )
        
        return {
            "message": f"Rol '{rol.nombre_rol}' removido exitosamente del usuario '{usuario.nombre} {usuario.apellido}'",
            "removed_by": removed_by
        }
    
    def authenticate_user(self, email: str, password: str) -> dict:
        """Autenticar usuario por email y password"""
        usuario = self.usuario_dao.get_by_email(self.db, email)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )
        
        # Verificar password
        if not bcrypt.checkpw(password.encode('utf-8'), usuario.password.encode('utf-8')):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )
        
        # Obtener roles del usuario
        usuario_con_roles = self.usuario_rol_dao.get_usuario_with_roles_detailed(self.db, usuario.id_usuario)
        
        return {
            "legajo": usuario.legajo,
            "nombre": f"{usuario.nombre} {usuario.apellido}",
            "roles": usuario_con_roles.roles if usuario_con_roles else []
        }
    
    def delete_usuario(self, id_usuario: int, deleted_by: str) -> dict:
        """Eliminar usuario lógicamente"""
        usuario = self.usuario_dao.get_by_id(self.db, id_usuario)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el usuario con ID {id_usuario}"
            )
        
        # Remover todos los roles del usuario primero
        self.usuario_rol_dao.delete_all_roles_from_usuario(self.db, id_usuario)
        
        # Eliminar lógicamente el usuario
        success = self.usuario_dao.soft_delete(self.db, id_usuario, deleted_by)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al eliminar el usuario"
            )
        
        return {
            "message": f"Usuario '{usuario.nombre} {usuario.apellido}' eliminado exitosamente",
            "deleted_by": deleted_by
        }