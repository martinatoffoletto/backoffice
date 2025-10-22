from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, delete
from ..models.usuario_rol_model import UsuarioRol
from ..models.usuario_model import Usuario
from ..models.rol_model import Rol
from ..schemas.usuario_rol_schema import UsuarioRolCreate, UsuarioConRoles, RolDetallado
from typing import List, Optional
import uuid

class UsuarioRolDAO:
    
    @staticmethod
    async def create(db: AsyncSession, usuario_rol: UsuarioRolCreate) -> UsuarioRol:
        """Asignar un rol a un usuario"""
        db_usuario_rol = UsuarioRol(
            id_usuario=usuario_rol.id_usuario,
            id_rol=usuario_rol.id_rol
        )
        db.add(db_usuario_rol)
        await db.commit()
        await db.refresh(db_usuario_rol)
        return db_usuario_rol
    
    @staticmethod
    async def get_by_usuario_rol(db: AsyncSession, id_usuario: uuid.UUID, id_rol: uuid.UUID) -> Optional[UsuarioRol]:
        """Obtener relación específica usuario-rol"""
        query = select(UsuarioRol).where(
            and_(
                UsuarioRol.id_usuario == id_usuario,
                UsuarioRol.id_rol == id_rol
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_roles_by_usuario(db: AsyncSession, id_usuario: uuid.UUID) -> List[UsuarioRol]:
        """Obtener todos los roles de un usuario"""
        query = select(UsuarioRol).where(UsuarioRol.id_usuario == id_usuario)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_usuario_with_roles_detailed(db: AsyncSession, id_usuario: uuid.UUID) -> Optional[UsuarioConRoles]:
        """Obtener usuario con información detallada de sus roles"""
        # Obtener usuario
        usuario_query = select(Usuario).where(
            and_(
                Usuario.id_usuario == id_usuario,
                Usuario.status == True
            )
        )
        usuario_result = await db.execute(usuario_query)
        usuario = usuario_result.scalar_one_or_none()
        
        if not usuario:
            return None
        
        # Obtener roles activos del usuario con toda su información
        roles_query = select(Rol).join(UsuarioRol).where(
            and_(
                UsuarioRol.id_usuario == id_usuario,
                Rol.status == True
            )
        )
        roles_result = await db.execute(roles_query)
        roles_list = roles_result.scalars().all()
        
        roles_detallados = []
        for rol in roles_list:
            rol_detallado = RolDetallado(
                id_rol=rol.id_rol,
                nombre_rol=rol.nombre_rol,
                descripcion=rol.descripcion,
                subcategoria=rol.subcategoria.value if rol.subcategoria else None,
                sueldo_base=rol.sueldo_base,
                status=rol.status
            )
            roles_detallados.append(rol_detallado)
        
        return UsuarioConRoles(
            id_usuario=usuario.id_usuario,
            nombre=usuario.nombre,
            apellido=usuario.apellido,
            legajo=usuario.legajo,
            dni=usuario.dni,
            correo_institucional=usuario.correo_institucional,
            correo_personal=usuario.correo_personal,
            telefono_personal=usuario.telefono_personal,
            fecha_alta=usuario.fecha_alta.isoformat() if usuario.fecha_alta else None,
            status=usuario.status,
            roles=roles_detallados
        )
    
    @staticmethod
    async def delete(db: AsyncSession, id_usuario: uuid.UUID, id_rol: uuid.UUID) -> bool:
        """Remover un rol específico de un usuario"""
        delete_query = delete(UsuarioRol).where(
            and_(
                UsuarioRol.id_usuario == id_usuario,
                UsuarioRol.id_rol == id_rol
            )
        )
        result = await db.execute(delete_query)
        await db.commit()
        return result.rowcount > 0
    
    @staticmethod
    async def exists(db: AsyncSession, id_usuario: uuid.UUID, id_rol: uuid.UUID) -> bool:
        """Verificar si existe la relación usuario-rol"""
        query = select(UsuarioRol).where(
            and_(
                UsuarioRol.id_usuario == id_usuario,
                UsuarioRol.id_rol == id_rol
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none() is not None