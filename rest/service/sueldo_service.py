from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.sueldo_dao import SueldoDAO
from ..dao.usuario_dao import UsuarioDAO
from ..dao.usuario_rol_dao import UsuarioRolDAO
from ..schemas.sueldo_schema import SueldoCreate, SueldoUpdate, Sueldo as SueldoSchema
from ..models.sueldo_model import Sueldo
from typing import List, Optional
from fastapi import HTTPException, status
import uuid

class SueldoService:
    
    @staticmethod
    async def create_sueldo(db: AsyncSession, sueldo: SueldoCreate) -> Sueldo:
        """Crear un nuevo sueldo para una relación usuario-rol"""
        # Verificar que el usuario existe y está activo
        usuario = await UsuarioDAO.get_by_id(db, sueldo.id_usuario)
        if not usuario or not usuario.status:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado o inactivo"
            )
        
        # Verificar que la relación usuario-rol existe
        usuario_rol_exists = await UsuarioRolDAO.exists(db, sueldo.id_usuario, sueldo.id_rol)
        if not usuario_rol_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="La relación usuario-rol no existe"
            )
        
        # Verificar que no existe ya un sueldo activo para esta combinación usuario-rol
        sueldo_exists = await SueldoDAO.exists_usuario_rol_sueldo(db, sueldo.id_usuario, sueldo.id_rol)
        if sueldo_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un sueldo activo para esta combinación usuario-rol"
            )
        
        return await SueldoDAO.create(db, sueldo)
    
    @staticmethod
    async def get_sueldo_by_id(db: AsyncSession, sueldo_id: uuid.UUID) -> Sueldo:
        """Obtener un sueldo por ID"""
        sueldo = await SueldoDAO.get_by_id(db, sueldo_id)
        if not sueldo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sueldo no encontrado"
            )
        return sueldo
    
    @staticmethod
    async def get_sueldos_by_usuario(db: AsyncSession, id_usuario: uuid.UUID) -> List[Sueldo]:
        """Obtener todos los sueldos de un usuario"""
        # Verificar que el usuario existe
        usuario = await UsuarioDAO.get_by_id(db, id_usuario)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        
        return await SueldoDAO.get_sueldos_by_usuario(db, id_usuario)
    
    @staticmethod
    async def get_all_sueldos(db: AsyncSession, skip: int = 0, limit: int = 100, activo_filter: Optional[bool] = None) -> List[Sueldo]:
        """Obtener todos los sueldos con filtros"""
        return await SueldoDAO.get_all(db, skip, limit, activo_filter)
    
    @staticmethod
    async def update_sueldo(db: AsyncSession, sueldo_id: uuid.UUID, sueldo_update: SueldoUpdate) -> Sueldo:
        """Actualizar un sueldo"""
        # Verificar que el sueldo existe
        existing_sueldo = await SueldoDAO.get_by_id(db, sueldo_id)
        if not existing_sueldo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sueldo no encontrado"
            )
        
        updated_sueldo = await SueldoDAO.update(db, sueldo_id, sueldo_update)
        if not updated_sueldo:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al actualizar el sueldo"
            )
        
        return updated_sueldo
    
    @staticmethod
    async def delete_sueldo(db: AsyncSession, sueldo_id: uuid.UUID) -> bool:
        """Eliminar (desactivar) un sueldo"""
        # Verificar que el sueldo existe
        existing_sueldo = await SueldoDAO.get_by_id(db, sueldo_id)
        if not existing_sueldo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sueldo no encontrado"
            )
        
        return await SueldoDAO.soft_delete(db, sueldo_id)
    
    @staticmethod
    async def get_sueldo_by_usuario_rol(db: AsyncSession, id_usuario: uuid.UUID, id_rol: uuid.UUID) -> Optional[Sueldo]:
        """Obtener sueldo específico por usuario y rol"""
        # Verificar que la relación usuario-rol existe
        usuario_rol_exists = await UsuarioRolDAO.exists(db, id_usuario, id_rol)
        if not usuario_rol_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="La relación usuario-rol no existe"
            )
        
        return await SueldoDAO.get_by_usuario_rol(db, id_usuario, id_rol)