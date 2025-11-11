from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.usuario_carrera_dao import UsuarioCarreraDAO
from ..dao.usuario_dao import UsuarioDAO
from ..schemas.usuario_carrera_schema import UsuarioCarrera as UsuarioCarreraSchema, UsuarioCarreraCreate
from typing import List, Optional
from uuid import UUID

class UsuarioCarreraService:
    
    @staticmethod
    async def create_assignment(db: AsyncSession, usuario_carrera: UsuarioCarreraCreate) -> Optional[UsuarioCarreraSchema]:
        """Asignar una carrera a un usuario"""
        # Verificar que el usuario existe
        usuario = await UsuarioDAO.get_by_id(db, usuario_carrera.id_usuario)
        if not usuario:
            return None
        
        # Verificar que no existe ya la asignación
        existing = await UsuarioCarreraDAO.exists(db, usuario_carrera.id_usuario, usuario_carrera.id_carrera)
        if existing:
            raise ValueError("El usuario ya está asignado a esta carrera")
        
        # Crear la asignación
        db_relacion = await UsuarioCarreraDAO.create(db, usuario_carrera)
        return UsuarioCarreraSchema(
            id_usuario=db_relacion.id_usuario,
            id_carrera=db_relacion.id_carrera,
            status=db_relacion.status
        )
    
    @staticmethod
    async def remove_assignment(db: AsyncSession, id_usuario: UUID, id_carrera: UUID) -> bool:
        """Remover una carrera de un usuario"""
        # Verificar que existe la asignación
        exists = await UsuarioCarreraDAO.exists(db, id_usuario, id_carrera)
        if not exists:
            return False
        
        # Remover la asignación
        success = await UsuarioCarreraDAO.delete(db, id_usuario, id_carrera)
        return success
    
    @staticmethod
    async def get_carrera_by_usuario(db: AsyncSession, id_usuario: UUID, status_filter: Optional[bool] = None) -> Optional[UsuarioCarreraSchema]:
        """Obtener la carrera activa única de un usuario"""
        # Verificar que el usuario existe
        usuario = await UsuarioDAO.get_by_id(db, id_usuario)
        if not usuario:
            return None
        
        relacion = await UsuarioCarreraDAO.get_carrera_by_usuario(db, id_usuario, status_filter)
        if not relacion:
            return None
        return UsuarioCarreraSchema(id_usuario=relacion.id_usuario, id_carrera=relacion.id_carrera, status=relacion.status)
    
    @staticmethod
    async def get_usuarios_by_carrera(db: AsyncSession, id_carrera: UUID, status_filter: Optional[bool] = None) -> List[UsuarioCarreraSchema]:
        """Obtener todos los usuarios de una carrera"""
        # Obtener las relaciones usuario-carrera
        relations = await UsuarioCarreraDAO.get_usuarios_by_carrera(db, id_carrera, status_filter)
        return [UsuarioCarreraSchema(id_usuario=rel.id_usuario, id_carrera=rel.id_carrera, status=rel.status) for rel in relations]
    
    @staticmethod
    async def check_assignment_exists(db: AsyncSession, id_usuario: UUID, id_carrera: UUID) -> bool:
        """Verificar si existe una asignación específica"""
        return await UsuarioCarreraDAO.exists(db, id_usuario, id_carrera)
    
    @staticmethod
    async def get_all_usuario_carreras(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[UsuarioCarreraSchema]:
        """Obtener todas las relaciones usuario-carrera con filtros"""
        relaciones = await UsuarioCarreraDAO.get_all(db, skip, limit, status_filter)
        return [UsuarioCarreraSchema(id_usuario=rel.id_usuario, id_carrera=rel.id_carrera, status=rel.status) for rel in relaciones]
    
    @staticmethod
    async def get_usuario_carrera_by_id(db: AsyncSession, id_usuario: UUID, id_carrera: UUID, status_filter: Optional[bool] = None) -> Optional[UsuarioCarreraSchema]:
        """Obtener una relación usuario-carrera por IDs"""
        relacion = await UsuarioCarreraDAO.get_by_id(db, id_usuario, id_carrera, status_filter)
        if relacion:
            return UsuarioCarreraSchema(id_usuario=relacion.id_usuario, id_carrera=relacion.id_carrera, status=relacion.status)
        return None
    
    @staticmethod
    async def delete_usuario_carrera(db: AsyncSession, id_usuario: UUID, id_carrera: UUID) -> bool:
        """Eliminar una relación usuario-carrera"""
        # Verificar que la relación existe
        existing = await UsuarioCarreraDAO.get_by_id(db, id_usuario, id_carrera)
        if not existing:
            return False
        
        return await UsuarioCarreraDAO.delete(db, id_usuario, id_carrera)
    
    @staticmethod
    async def search_usuario_carreras(db: AsyncSession, param: str, value: str, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[UsuarioCarreraSchema]:
        """Buscar relaciones usuario-carrera por diferentes parámetros"""
        relaciones = await UsuarioCarreraDAO.search(db, param, value, skip, limit)
        
        # Aplicar filtro adicional de status si está presente
        if status_filter is not None:
            relaciones = [rel for rel in relaciones if rel and rel.status == status_filter]
        else:
            relaciones = [rel for rel in relaciones if rel]
        
        return [UsuarioCarreraSchema(id_usuario=rel.id_usuario, id_carrera=rel.id_carrera, status=rel.status) for rel in relaciones]

