from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.sueldo_dao import SueldoDAO
from ..dao.usuario_dao import UsuarioDAO
from ..schemas.sueldo_schema import SueldoBase, SueldoUpdate, Sueldo as SueldoSchema
from ..models.sueldo_model import Sueldo
from typing import List, Optional, Tuple
import uuid

class SueldoService:
    
    @staticmethod
    async def can_create_sueldo(db: AsyncSession, sueldo: SueldoBase) -> Tuple[bool, str]:
        """Verificar si se puede crear un sueldo para un usuario"""
        # Verificar que el usuario existe y está activo
        usuario = await UsuarioDAO.get_by_id(db, sueldo.id_usuario)
        if not usuario or not usuario.status:
            return False, "Usuario no encontrado o inactivo"
        
        # Verificar que el rol del usuario no sea ALUMNO
        if usuario.rol and usuario.rol.categoria == "ALUMNO":
            return False, "No se puede crear un sueldo para un usuario con rol de ALUMNO"
        
        # Verificar que no existe ya un sueldo activo para este usuario
        sueldo_exists = await SueldoDAO.exists_by_usuario(db, sueldo.id_usuario)
        if sueldo_exists:
            return False, "Ya existe un sueldo activo para este usuario"
        
        return True, ""
    
    @staticmethod
    async def create_sueldo(db: AsyncSession, sueldo: SueldoBase) -> Optional[Sueldo]:
        """Crear un nuevo sueldo para un usuario"""
        can_create, _ = await SueldoService.can_create_sueldo(db, sueldo)
        if not can_create:
            return None
        
        return await SueldoDAO.create(db, sueldo)
    
    @staticmethod
    async def get_sueldo_by_id(db: AsyncSession, sueldo_id: uuid.UUID) -> Optional[Sueldo]:
        """Obtener un sueldo por ID"""
        return await SueldoDAO.get_by_id(db, sueldo_id)
    
    @staticmethod
    async def get_sueldo_by_usuario(db: AsyncSession, id_usuario: uuid.UUID) -> Optional[Sueldo]:
        """Obtener el sueldo activo único de un usuario"""
        # Verificar que el usuario existe
        usuario = await UsuarioDAO.get_by_id(db, id_usuario)
        if not usuario:
            return None
        
        return await SueldoDAO.get_sueldo_by_usuario(db, id_usuario)
    
    @staticmethod
    async def get_all_sueldos(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[Sueldo]:
        """Obtener todos los sueldos con filtros"""
        return await SueldoDAO.get_all(db, skip, limit, status_filter)
    
    @staticmethod
    async def update_sueldo(db: AsyncSession, sueldo_id: uuid.UUID, sueldo_update: SueldoUpdate) -> Optional[Sueldo]:
        """Actualizar un sueldo"""
        # Verificar que el sueldo existe
        existing_sueldo = await SueldoDAO.get_by_id(db, sueldo_id)
        if not existing_sueldo:
            return None
        
        return await SueldoDAO.update(db, sueldo_id, sueldo_update)
    
    @staticmethod
    async def delete_sueldo(db: AsyncSession, sueldo_id: uuid.UUID) -> bool:
        """Eliminar (desactivar) un sueldo"""
        # Verificar que el sueldo existe
        existing_sueldo = await SueldoDAO.get_by_id(db, sueldo_id)
        if not existing_sueldo:
            return False
        
        return await SueldoDAO.soft_delete(db, sueldo_id)
    
    @staticmethod
    async def search_sueldos(db: AsyncSession, param: str, value: str, skip: int = 0, limit: int = 100) -> List[Sueldo]:
        """Buscar sueldos por diferentes parámetros"""
        return await SueldoDAO.search(db, param, value, skip, limit)