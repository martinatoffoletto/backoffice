from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, and_, or_
from ..models.rol_model import Rol, CategoriaRol
from ..schemas.rol_schema import RolCreate, RolUpdate
from typing import List, Optional
import uuid

class RolDAO:
    
    @staticmethod
    async def create(db: AsyncSession, rol: RolCreate) -> Rol:
        """Crear un nuevo rol"""
        db_rol = Rol(
            nombre_rol=rol.nombre_rol,
            descripcion=rol.descripcion,
            subcategoria=rol.subcategoria,
            sueldo_base=rol.sueldo_base,
            status=rol.status
        )
        db.add(db_rol)
        await db.commit()
        await db.refresh(db_rol)
        return db_rol
    
    @staticmethod
    async def get_by_id(db: AsyncSession, id_rol: uuid.UUID) -> Optional[Rol]:
        """Obtener rol por ID"""
        query = select(Rol).where(
            and_(Rol.id_rol == id_rol, Rol.status == True)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_nombre(db: AsyncSession, nombre_rol: str) -> Optional[Rol]:
        """Obtener rol por nombre exacto"""
        query = select(Rol).where(
            and_(Rol.nombre_rol == nombre_rol, Rol.status == True)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_categoria(db: AsyncSession, categoria: CategoriaRol, skip: int = 0, limit: int = 100) -> List[Rol]:
        """Obtener roles por categoría/subcategoría"""
        query = select(Rol).where(
            and_(Rol.subcategoria == categoria, Rol.status == True)
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_subcategoria(db: AsyncSession, subcategoria: CategoriaRol, skip: int = 0, limit: int = 100) -> List[Rol]:
        """Obtener roles por subcategoría (alias de get_by_categoria para consistencia)"""
        return await RolDAO.get_by_categoria(db, subcategoria, skip, limit)
    
    @staticmethod
    async def get_all(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Rol]:
        """Obtener todos los roles activos"""
        query = select(Rol).where(Rol.status == True).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_all_categories(db: AsyncSession) -> List[str]:
        # Retorna los valores del enum CategoriaRol
        return [categoria.value for categoria in CategoriaRol]
    
    @staticmethod
    async def get_roles_by_categories_in_use(db: AsyncSession) -> List[dict]:
        query = select(Rol.subcategoria).where(
            and_(Rol.status == True, Rol.subcategoria.isnot(None))
        ).distinct()
        result = await db.execute(query)
        results = result.scalars().all()
        
        categories_in_use = []
        for subcategoria in results:
            if subcategoria:
                categories_in_use.append({
                    "categoria": subcategoria.value,
                    "enum_value": subcategoria
                })
        
        return categories_in_use
    
    @staticmethod
    async def search_by_nombre(db: AsyncSession, nombre_pattern: str, skip: int = 0, limit: int = 100) -> List[Rol]:
        """Buscar roles por patrón en el nombre (búsqueda parcial)"""
        query = select(Rol).where(
            and_(
                Rol.nombre_rol.ilike(f"%{nombre_pattern}%"),
                Rol.status == True
            )
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def update(db: AsyncSession, id_rol: uuid.UUID, rol_update: RolUpdate) -> Optional[Rol]:
        """Actualizar un rol"""
        update_data = rol_update.dict(exclude_unset=True)
        
        if update_data:
            query = update(Rol).where(Rol.id_rol == id_rol).values(**update_data)
            await db.execute(query)
            await db.commit()
        
        return await RolDAO.get_by_id(db, id_rol)
    
    @staticmethod
    async def soft_delete(db: AsyncSession, id_rol: uuid.UUID) -> bool:
        """Eliminación lógica: cambiar status a False"""
        query = update(Rol).where(Rol.id_rol == id_rol).values(status=False)
        result = await db.execute(query)
        await db.commit()
        return result.rowcount > 0
    
    
   