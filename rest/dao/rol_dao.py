from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from ..models.rol_model import Rol
from ..schemas.rol_schema import RolBase, RolUpdate
from typing import List, Optional
import uuid

class RolDAO:
    
    @staticmethod
    async def create(db: AsyncSession, rol: RolBase) -> Rol:
        """Crear un nuevo rol"""
        db_rol = Rol(
            descripcion=rol.descripcion,
            categoria=rol.categoria,
            subcategoria=rol.subcategoria,
            sueldo_base=rol.sueldo_base,
            status=True  # Siempre se crea como activo
        )
        db.add(db_rol)
        await db.commit()
        await db.refresh(db_rol)
        return db_rol
    
    @staticmethod
    async def get_by_id(db: AsyncSession, id_rol: uuid.UUID, status_filter: Optional[bool] = None) -> Optional[Rol]:
        """Obtener rol por ID"""
        query = select(Rol).where(Rol.id_rol == id_rol)
        if status_filter is not None:
            query = query.where(Rol.status == status_filter)
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def search_by_categoria(db: AsyncSession, categoria_pattern: str, status_filter: Optional[bool] = None) -> List[Rol]:
        query = select(Rol).where(
            Rol.categoria.ilike(f"%{categoria_pattern}%")
        )
        if status_filter is not None:
            query = query.where(Rol.status == status_filter)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_subcategoria(db: AsyncSession, subcategoria: str, status_filter: Optional[bool] = None) -> List[Rol]:
        query = select(Rol).where(
            Rol.subcategoria.ilike(f"%{subcategoria}%")
        )
        if status_filter is not None:
            query = query.where(Rol.status == status_filter)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_categories_with_subcategories(db: AsyncSession, status_filter: Optional[bool] = None) -> List[dict]:
        """Obtener todas las categorías con sus subcategorías agrupadas"""
        query = select(Rol.categoria, Rol.subcategoria).distinct()
        if status_filter is not None:
            query = query.where(Rol.status == status_filter)
        result = await db.execute(query)
        results = result.fetchall()
        
        # Agrupar subcategorías por categoría
        categories_dict = {}
        for categoria, subcategoria in results:
            if categoria:
                if categoria not in categories_dict:
                    categories_dict[categoria] = []
                if subcategoria and subcategoria not in categories_dict[categoria]:
                    categories_dict[categoria].append(subcategoria)
        
        # Convertir a lista de diccionarios
        categories_list = []
        for categoria, subcategorias in categories_dict.items():
            categories_list.append({
                "categoria": categoria,
                "subcategorias": sorted(subcategorias)  # Ordenar subcategorías
            })
        
        return sorted(categories_list, key=lambda x: x["categoria"])  # Ordenar por categoría
    
    @staticmethod
    async def update(db: AsyncSession, id_rol: uuid.UUID, rol_update: RolUpdate) -> Optional[Rol]:
        """Actualizar un rol"""
        update_data = rol_update.model_dump(exclude_unset=True)
        
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

    @staticmethod
    async def get_all(db: AsyncSession, status_filter: Optional[bool] = None) -> List[Rol]:
        """Obtener todos los roles, filtrando por estado cuando se indica."""
        query = select(Rol)
        if status_filter is not None:
            query = query.where(Rol.status == status_filter)
        result = await db.execute(query)
        return result.scalars().all()
    
    
   