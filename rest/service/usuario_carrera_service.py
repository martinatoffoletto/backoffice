from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.usuario_carrera_dao import UsuarioCarreraDAO
from ..dao.usuario_dao import UsuarioDAO
from ..schemas.usuario_carrera_schema import UsuarioCarrera as UsuarioCarreraSchema, UsuarioCarreraCreate
from typing import List, Optional
from uuid import UUID
from fastapi import HTTPException, status, Depends
from ..database import get_async_db

class UsuarioCarreraService:
    
    @staticmethod
    async def create_assignment(db: AsyncSession, usuario_carrera: UsuarioCarreraCreate) -> UsuarioCarreraSchema:
        """Asignar una carrera a un usuario"""
        # Verificar que el usuario existe
        usuario = await UsuarioDAO.get_by_id(db, usuario_carrera.id_usuario)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Usuario con ID {usuario_carrera.id_usuario} no encontrado"
            )
        
        # Verificar que no existe ya la asignación
        existing = await UsuarioCarreraDAO.exists(db, usuario_carrera.id_usuario, usuario_carrera.id_carrera)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El usuario ya está asignado a esta carrera"
            )
        
        # Crear la asignación
        return await UsuarioCarreraDAO.create(db, usuario_carrera)
    
    @staticmethod
    async def remove_assignment(db: AsyncSession, id_usuario: UUID, id_carrera: UUID) -> bool:
        """Remover una carrera de un usuario"""
        # Verificar que existe la asignación
        exists = await UsuarioCarreraDAO.exists(db, id_usuario, id_carrera)
        if not exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontró la asignación especificada"
            )
        
        # Remover la asignación
        success = await UsuarioCarreraDAO.delete(db, id_usuario, id_carrera)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al remover la asignación"
            )
        
        return success
    
    @staticmethod
    async def get_carreras_by_usuario(db: AsyncSession, id_usuario: UUID) -> List[UsuarioCarreraSchema]:
        """Obtener todas las carreras de un usuario"""
        # Verificar que el usuario existe
        usuario = await UsuarioDAO.get_by_id(db, id_usuario)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Usuario con ID {id_usuario} no encontrado"
            )
        
        # Obtener las relaciones usuario-carrera
        relations = await UsuarioCarreraDAO.get_carreras_by_usuario(db, id_usuario)
        return [UsuarioCarreraSchema(id_usuario=rel.id_usuario, id_carrera=rel.id_carrera, status=rel.status) for rel in relations]
    
    @staticmethod
    async def get_usuarios_by_carrera(db: AsyncSession, id_carrera: UUID) -> List[UsuarioCarreraSchema]:
        """Obtener todos los usuarios de una carrera"""
        # Obtener las relaciones usuario-carrera
        relations = await UsuarioCarreraDAO.get_usuarios_by_carrera(db, id_carrera)
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
    async def get_usuario_carrera_by_id(db: AsyncSession, id_usuario: UUID, id_carrera: UUID) -> Optional[UsuarioCarreraSchema]:
        """Obtener una relación usuario-carrera por IDs"""
        relacion = await UsuarioCarreraDAO.get_by_id(db, id_usuario, id_carrera)
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
    async def search_usuario_carreras(db: AsyncSession, param: str, value: str, skip: int = 0, limit: int = 100) -> List[UsuarioCarreraSchema]:
        """Buscar relaciones usuario-carrera por diferentes parámetros"""
        relaciones = await UsuarioCarreraDAO.search(db, param, value, skip, limit)
        return [UsuarioCarreraSchema(id_usuario=rel.id_usuario, id_carrera=rel.id_carrera, status=rel.status) for rel in relaciones]

