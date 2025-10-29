from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, and_, or_
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
    async def get_by_id(db: AsyncSession, id_rol: uuid.UUID) -> Optional[Rol]:
        """Obtener rol por ID"""
        query = select(Rol).where(
            and_(Rol.id_rol == id_rol, Rol.status == True)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def search_by_categoria(db: AsyncSession, categoria_pattern: str) -> List[Rol]:
        """Buscar roles por patrón en la categoría (búsqueda parcial)"""
        query = select(Rol).where(
            and_(
                Rol.categoria.ilike(f"%{categoria_pattern}%"),
                Rol.status == True
            )
        )
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_subcategoria(db: AsyncSession, subcategoria: str) -> List[Rol]:
        """Obtener roles por subcategoría (búsqueda parcial)"""
        query = select(Rol).where(
            and_(
                Rol.subcategoria.ilike(f"%{subcategoria}%"),
                Rol.status == True
            )
        )
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_categories_with_subcategories(db: AsyncSession) -> List[dict]:
        """Obtener todas las categorías con sus subcategorías agrupadas"""
        query = select(Rol.categoria, Rol.subcategoria).where(
            and_(Rol.status == True)
        ).distinct()
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
    
    
   