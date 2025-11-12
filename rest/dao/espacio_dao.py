from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, and_, join
from ..models.espacio_model import Espacio
from ..models.sede_model import Sede
from ..schemas.espacio_schema import EspacioCreate, EspacioUpdate, EspacioConSede
from typing import List, Optional
import uuid

class EspacioDAO:
    
    @staticmethod
    async def create(db: AsyncSession, espacio: EspacioCreate) -> Espacio:
        """Crear un nuevo espacio"""
        db_espacio = Espacio(
            nombre=espacio.nombre,
            id_sede=espacio.id_sede,
            tipo=espacio.tipo,
            capacidad=espacio.capacidad,
            ubicacion=espacio.ubicacion,
            estado=espacio.estado
        )
        db.add(db_espacio)
        await db.commit()
        await db.refresh(db_espacio)
        return db_espacio
    
    @staticmethod
    async def get_by_id(db: AsyncSession, id_espacio: uuid.UUID, include_inactive: bool = False) -> Optional[Espacio]:
        """Obtener espacio por ID"""
        query = select(Espacio).where(Espacio.id_espacio == id_espacio)
        if not include_inactive:
            query = query.where(Espacio.status == True)
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_all(db: AsyncSession, skip: int = 0, limit: int = 100, status_filter: Optional[bool] = None) -> List[Espacio]:
        """Obtener todos los espacios con filtro opcional por status"""
        query = select(Espacio)
        
        if status_filter is not None:
            query = query.where(Espacio.status == status_filter)
        else:
            query = query.where(Espacio.status == True)
        
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_sede(db: AsyncSession, id_sede: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener espacios por sede"""
        query = select(Espacio).where(
            and_(
                Espacio.id_sede == id_sede,
                Espacio.status == True
            )
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_tipo(db: AsyncSession, tipo: str, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener espacios por tipo"""
        query = select(Espacio).where(
            and_(
                Espacio.tipo == tipo,
                Espacio.status == True
            )
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def search_by_nombre(db: AsyncSession, nombre_pattern: str, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Buscar espacios por patrón en el nombre"""
        query = select(Espacio).where(
            and_(
                Espacio.nombre.ilike(f"%{nombre_pattern}%"),
                Espacio.status == True
            )
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_with_capacity_greater_than(db: AsyncSession, capacidad_minima: int, skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener espacios con capacidad mayor a la especificada"""
        query = select(Espacio).where(
            and_(
                Espacio.capacidad >= capacidad_minima,
                Espacio.status == True
            )
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_filters(db: AsyncSession, 
                      id_sede: Optional[uuid.UUID] = None,
                      tipo: Optional[str] = None,
                      capacidad_minima: Optional[int] = None,
                      estado: Optional[str] = None,
                      skip: int = 0, limit: int = 100) -> List[Espacio]:
        """Obtener espacios aplicando múltiples filtros"""
        conditions = [Espacio.status == True]
        
        if id_sede is not None:
            conditions.append(Espacio.id_sede == id_sede)
        if tipo is not None:
            conditions.append(Espacio.tipo == tipo)
        if capacidad_minima is not None:
            conditions.append(Espacio.capacidad >= capacidad_minima)
        if estado is not None:
            conditions.append(Espacio.estado == estado)
        
        query = select(Espacio).where(and_(*conditions)).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_with_sede_info(db: AsyncSession, id_espacio: uuid.UUID) -> Optional[EspacioConSede]:
        """Obtener espacio con información de la sede"""
        query = select(
            Espacio.id_espacio,
            Espacio.nombre,
            Espacio.tipo,
            Espacio.capacidad,
            Espacio.ubicacion,
            Espacio.estado,
            Espacio.status,
            Sede.nombre.label('sede_nombre'),
            Sede.ubicacion.label('sede_ubicacion')
        ).join(Sede).where(
            and_(
                Espacio.id_espacio == id_espacio,
                Espacio.status == True,
                Sede.status == True
            )
        )
        
        result = await db.execute(query)
        row = result.first()
        
        if not row:
            return None
        
        return EspacioConSede(
            id_espacio=row.id_espacio,
            nombre=row.nombre,
            tipo=row.tipo,
            capacidad=row.capacidad,
            ubicacion=row.ubicacion,
            estado=row.estado,
            status=row.status,
            sede_nombre=row.sede_nombre,
            sede_ubicacion=row.sede_ubicacion
        )
    
    @staticmethod
    async def update(db: AsyncSession, id_espacio: uuid.UUID, espacio_update: EspacioUpdate) -> Optional[Espacio]:
        """Actualizar un espacio existente"""
        update_data = espacio_update.model_dump(exclude_unset=True)
        
        if update_data:
            query = update(Espacio).where(Espacio.id_espacio == id_espacio).values(**update_data)
            await db.execute(query)
            await db.commit()
        
        return await EspacioDAO.get_by_id(db, id_espacio, include_inactive=True)
    
    @staticmethod
    async def soft_delete(db: AsyncSession, id_espacio: uuid.UUID) -> bool:
        """Eliminación lógica de un espacio"""
        query = update(Espacio).where(Espacio.id_espacio == id_espacio).values(status=False)
        result = await db.execute(query)
        await db.commit()
        return result.rowcount > 0
    
    @staticmethod
    async def exists_by_nombre_and_sede(db: AsyncSession, nombre: str, id_sede: uuid.UUID) -> bool:
        """Verificar si existe un espacio con ese nombre en esa sede"""
        query = select(Espacio).where(
            and_(
                Espacio.nombre == nombre,
                Espacio.id_sede == id_sede
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none() is not None
    
    @staticmethod
    async def count_by_sede(db: AsyncSession, id_sede: uuid.UUID) -> int:
        """Contar espacios activos por sede"""
        query = select(Espacio).where(
            and_(
                Espacio.id_sede == id_sede,
                Espacio.status == True
            )
        )
        result = await db.execute(query)
        return len(result.scalars().all())
    
    @staticmethod
    async def get_comedores_by_sede(db: AsyncSession, id_sede: uuid.UUID) -> List[Espacio]:
        """Obtener comedores de una sede (espacios cuyo nombre contiene 'comedor')"""
        query = select(Espacio).where(
            and_(
                Espacio.id_sede == id_sede,
                Espacio.nombre.ilike("%comedor%"),
                Espacio.status == True
            )
        )
        result = await db.execute(query)
        return result.scalars().all()