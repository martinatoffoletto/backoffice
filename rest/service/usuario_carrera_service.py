from sqlalchemy.ext.asyncio import AsyncSession
from ..dao.usuario_carrera_dao import UsuarioCarreraDAO
from ..dao.usuario_dao import UsuarioDAO
from ..dao.sueldo_dao import SueldoDAO
from ..schemas.usuario_carrera_schema import UsuarioCarrera as UsuarioCarreraSchema, UsuarioCarreraCreate
from typing import List, Optional
from uuid import UUID

class UsuarioCarreraService:
    
    @staticmethod
    async def create_assignment(db: AsyncSession, usuario_carrera: UsuarioCarreraCreate) -> Optional[UsuarioCarreraSchema]:

        usuario = await UsuarioDAO.get_by_id(db, usuario_carrera.id_usuario)
        if not usuario or not usuario.status:
            return None
        
        if usuario.rol and usuario.rol.categoria != "ALUMNO":
            raise ValueError("Solo usuarios con rol ALUMNO pueden tener carrera")
        
        existing = await UsuarioCarreraDAO.get_carrera_by_usuario(db, usuario_carrera.id_usuario, True)
        if existing:
            raise ValueError("El usuario ya tiene una carrera activa asignada")
        
        sueldo = await SueldoDAO.get_sueldo_by_usuario(db, usuario_carrera.id_usuario, True)
        if sueldo:
            raise ValueError("El usuario no puede tener carrera y sueldo simultáneamente")
        
        db_relacion = await UsuarioCarreraDAO.create(db, usuario_carrera)
        return UsuarioCarreraSchema(
            id_usuario=db_relacion.id_usuario,
            id_carrera=db_relacion.id_carrera,
            status=db_relacion.status
        )
    
    @staticmethod
    async def get_all_usuario_carreras(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[UsuarioCarreraSchema]:
        """Obtener todas las relaciones usuario-carrera con filtros"""
        relaciones = await UsuarioCarreraDAO.get_all(db, skip, limit, status_filter)
        return [UsuarioCarreraSchema(id_usuario=rel.id_usuario, id_carrera=rel.id_carrera, status=rel.status) for rel in relaciones]
    
    @staticmethod
    async def update_carrera(db: AsyncSession, id_usuario: UUID, id_carrera_antigua: UUID, id_carrera_nueva: UUID) -> Optional[UsuarioCarreraSchema]:
        """Modificar la carrera asignada a un usuario (solo se cambia el id_carrera)"""
        existing = await UsuarioCarreraDAO.get_by_id(db, id_usuario, id_carrera_antigua, True)
        if not existing:
            return None
        
        if id_carrera_antigua == id_carrera_nueva:
            raise ValueError("La nueva carrera es la misma que la actual")
        
        success = await UsuarioCarreraDAO.delete(db, id_usuario, id_carrera_antigua)
        if not success:
            raise ValueError("Error al eliminar la relación antigua")
        
        nueva_relacion = await UsuarioCarreraDAO.create(db, UsuarioCarreraCreate(
            id_usuario=id_usuario,
            id_carrera=id_carrera_nueva
        ))
        
        return UsuarioCarreraSchema(
            id_usuario=nueva_relacion.id_usuario,
            id_carrera=nueva_relacion.id_carrera,
            status=nueva_relacion.status
        )
    
    @staticmethod
    async def delete_usuario_carrera(db: AsyncSession, id_usuario: UUID, id_carrera: UUID) -> tuple[bool, str]:
        existing = await UsuarioCarreraDAO.get_by_id(db, id_usuario, id_carrera, True)
        if not existing:
            return False, "Relación usuario-carrera no encontrada"
        
        usuario = await UsuarioDAO.get_by_id(db, id_usuario)
        if usuario and usuario.status:
            return False, "No se puede eliminar la carrera de un usuario activo"
        
        success = await UsuarioCarreraDAO.delete(db, id_usuario, id_carrera)
        return success, "" if success else "Error al eliminar la relación"
    
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

