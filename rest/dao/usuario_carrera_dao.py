from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, delete
from ..models.usuario_carrera_model import UsuarioCarrera
from ..models.usuario_model import Usuario
from ..models.carrera_model import Carrera
from ..schemas.usuario_carrera_schema import UsuarioCarreraCreate, UsuarioConCarreras, CarreraDetallada
from typing import List, Optional
import uuid

class UsuarioCarreraDAO:
    
    @staticmethod
    async def create(db: AsyncSession, usuario_carrera: UsuarioCarreraCreate) -> UsuarioCarrera:
        """Asignar una carrera a un usuario"""
        db_usuario_carrera = UsuarioCarrera(
            id_usuario=usuario_carrera.id_usuario,
            id_carrera=usuario_carrera.id_carrera
        )
        db.add(db_usuario_carrera)
        await db.commit()
        await db.refresh(db_usuario_carrera)
        return db_usuario_carrera
    
    @staticmethod
    async def get_by_usuario_carrera(db: AsyncSession, id_usuario: uuid.UUID, id_carrera: uuid.UUID) -> Optional[UsuarioCarrera]:
        """Obtener relación específica usuario-carrera"""
        query = select(UsuarioCarrera).where(
            and_(
                UsuarioCarrera.id_usuario == id_usuario,
                UsuarioCarrera.id_carrera == id_carrera
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_carreras_by_usuario(db: AsyncSession, id_usuario: uuid.UUID) -> List[UsuarioCarrera]:
        """Obtener todas las carreras de un usuario"""
        query = select(UsuarioCarrera).where(UsuarioCarrera.id_usuario == id_usuario)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_usuario_with_carreras_detailed(db: AsyncSession, id_usuario: uuid.UUID) -> Optional[UsuarioConCarreras]:
        """Obtener usuario con información detallada de sus carreras"""
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
        
        # Obtener carreras activas del usuario con toda su información
        carreras_query = select(Carrera).join(UsuarioCarrera).where(
            and_(
                UsuarioCarrera.id_usuario == id_usuario,
                Carrera.status == True
            )
        )
        carreras_result = await db.execute(carreras_query)
        carreras_list = carreras_result.scalars().all()
        
        carreras_detalladas = []
        for carrera in carreras_list:
            carrera_detallada = CarreraDetallada(
                id_carrera=carrera.id_carrera,
                nombre=carrera.nombre,
                nivel=carrera.nivel.value if carrera.nivel else None,
                duracion_anios=carrera.duracion_anios,
                status=carrera.status
            )
            carreras_detalladas.append(carrera_detallada)
        
        return UsuarioConCarreras(
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
            carreras=carreras_detalladas
        )
    
    @staticmethod
    async def delete(db: AsyncSession, id_usuario: uuid.UUID, id_carrera: uuid.UUID) -> bool:
        """Remover una carrera específica de un usuario"""
        delete_query = delete(UsuarioCarrera).where(
            and_(
                UsuarioCarrera.id_usuario == id_usuario,
                UsuarioCarrera.id_carrera == id_carrera
            )
        )
        result = await db.execute(delete_query)
        await db.commit()
        return result.rowcount > 0
    
    @staticmethod
    async def exists(db: AsyncSession, id_usuario: uuid.UUID, id_carrera: uuid.UUID) -> bool:
        """Verificar si existe la relación usuario-carrera"""
        query = select(UsuarioCarrera).where(
            and_(
                UsuarioCarrera.id_usuario == id_usuario,
                UsuarioCarrera.id_carrera == id_carrera
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none() is not None