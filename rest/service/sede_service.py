from sqlalchemy.orm import Session
from ..dao.sede_dao import SedeDAO
from ..schemas.sede_schema import Sede as SedeSchema
from typing import List, Optional
from ..database import get_db
from fastapi import HTTPException, status, Depends

class SedeService:
    
    def __init__(self, db: Session):
        self.db = db
        self.sede_dao = SedeDAO()
    
    def create_sede(self, sede: SedeSchema, created_by: str) -> dict:
        """Crear una nueva sede con validaciones"""
        # Validaciones de unicidad
        if self.sede_dao.exists_by_codigo(self.db, sede.codigo_sede):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe una sede con el código '{sede.codigo_sede}'"
            )
        
        if sede.email and self.sede_dao.exists_by_email(self.db, sede.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe una sede con el email '{sede.email}'"
            )
        
        if sede.telefono and self.sede_dao.exists_by_telefono(self.db, sede.telefono):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe una sede con el teléfono '{sede.telefono}'"
            )
        
        # Asignar created_by
        sede.created_by = created_by
        
        # Crear la sede
        new_sede = self.sede_dao.create(self.db, sede)
        
        return {
            "message": "Sede creada exitosamente",
            "sede": new_sede,
            "created_by": created_by
        }
    
    def get_sede_by_id(self, id_sede: int) -> dict:
        """Obtener sede por ID"""
        sede = self.sede_dao.get_by_id(self.db, id_sede)
        if not sede:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la sede con ID {id_sede}"
            )
        return {"sede": sede}
    
    def get_sede_by_codigo(self, codigo_sede: str) -> dict:
        """Obtener sede por código"""
        sede = self.sede_dao.get_by_codigo(self.db, codigo_sede)
        if not sede:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la sede con código '{codigo_sede}'"
            )
        return {"sede": sede}
    
    def get_all_sedes(self, skip: int = 0, limit: int = 100) -> dict:
        """Obtener todas las sedes activas"""
        sedes = self.sede_dao.get_all(self.db, skip, limit)
        
        return {
            "sedes": sedes,
            "total": len(sedes),
            "skip": skip,
            "limit": limit
        }
    
    def search_sedes(self, search_term: str, search_type: str = "nombre", skip: int = 0, limit: int = 100) -> dict:
        """Buscar sedes por diferentes criterios"""
        if search_type == "nombre":
            sedes = self.sede_dao.search_by_nombre(self.db, search_term, skip, limit)
        elif search_type == "direccion":
            sedes = self.sede_dao.search_by_direccion(self.db, search_term, skip, limit)
        elif search_type == "ciudad":
            sedes = self.sede_dao.get_by_ciudad(self.db, search_term, skip, limit)
        elif search_type == "provincia":
            sedes = self.sede_dao.get_by_provincia(self.db, search_term, skip, limit)
        else:
            # Búsqueda general en nombre y dirección
            sedes_nombre = self.sede_dao.search_by_nombre(self.db, search_term, skip, limit)
            sedes_direccion = self.sede_dao.search_by_direccion(self.db, search_term, skip, limit)
            
            # Combinar resultados sin duplicados
            sedes_ids = set()
            sedes = []
            for s in sedes_nombre + sedes_direccion:
                if s.id_sede not in sedes_ids:
                    sedes.append(s)
                    sedes_ids.add(s.id_sede)
        
        return {
            "sedes": sedes,
            "search_term": search_term,
            "search_type": search_type,
            "total_found": len(sedes),
            "skip": skip,
            "limit": limit
        }
    
    def get_sedes_by_tipo(self, tipo_sede: str, skip: int = 0, limit: int = 100) -> dict:
        """Obtener sedes por tipo"""
        sedes = self.sede_dao.get_by_tipo(self.db, tipo_sede, skip, limit)
        
        return {
            "sedes": sedes,
            "tipo_sede": tipo_sede,
            "total": len(sedes),
            "skip": skip,
            "limit": limit
        }
    
    def get_sedes_with_capacity(self, capacidad_minima: int, skip: int = 0, limit: int = 100) -> dict:
        """Obtener sedes con capacidad mayor a la especificada"""
        sedes = self.sede_dao.get_with_capacity_greater_than(self.db, capacidad_minima, skip, limit)
        
        return {
            "sedes": sedes,
            "capacidad_minima": capacidad_minima,
            "total_found": len(sedes),
            "skip": skip,
            "limit": limit
        }
    
    def update_sede(self, id_sede: int, sede_update: SedeSchema, updated_by: str) -> dict:
        """Actualizar sede con validaciones"""
        # Verificar que la sede existe
        existing_sede = self.sede_dao.get_by_id(self.db, id_sede)
        if not existing_sede:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la sede con ID {id_sede}"
            )
        
        # Validaciones de unicidad para campos que cambian
        if sede_update.codigo_sede and sede_update.codigo_sede != existing_sede.codigo_sede:
            if self.sede_dao.exists_by_codigo(self.db, sede_update.codigo_sede):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe una sede con el código '{sede_update.codigo_sede}'"
                )
        
        if sede_update.email and sede_update.email != existing_sede.email:
            if self.sede_dao.exists_by_email(self.db, sede_update.email):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe una sede con el email '{sede_update.email}'"
                )
        
        if sede_update.telefono and sede_update.telefono != existing_sede.telefono:
            if self.sede_dao.exists_by_telefono(self.db, sede_update.telefono):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe una sede con el teléfono '{sede_update.telefono}'"
                )
        
        # Asignar updated_by
        sede_update.updated_by = updated_by
        
        # Actualizar
        updated_sede = self.sede_dao.update(self.db, id_sede, sede_update)
        
        return {
            "message": "Sede actualizada exitosamente",
            "sede": updated_sede,
            "updated_by": updated_by
        }
    
    def delete_sede(self, id_sede: int, deleted_by: str) -> dict:
        """Eliminar sede lógicamente"""
        sede = self.sede_dao.get_by_id(self.db, id_sede)
        if not sede:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la sede con ID {id_sede}"
            )
        
        # TODO: Verificar que no hay espacios activos en esta sede
        # espacios_activos = self.espacio_dao.get_by_sede(self.db, id_sede, limit=1)
        # if espacios_activos:
        #     raise HTTPException(
        #         status_code=status.HTTP_400_BAD_REQUEST,
        #         detail="No se puede eliminar la sede porque tiene espacios activos"
        #     )
        
        # Eliminar lógicamente
        success = self.sede_dao.soft_delete(self.db, id_sede, deleted_by)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al eliminar la sede"
            )
        
        return {
            "message": f"Sede '{sede.nombre_sede}' eliminada exitosamente",
            "deleted_by": deleted_by
        }
    
    def restore_sede(self, id_sede: int, updated_by: str) -> dict:
        """Restaurar sede eliminada"""
        success = self.sede_dao.restore(self.db, id_sede, updated_by)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró una sede eliminada con ID {id_sede}"
            )
        
        # Obtener la sede restaurada
        sede = self.sede_dao.get_by_id(self.db, id_sede)
        
        return {
            "message": f"Sede '{sede.nombre_sede}' restaurada exitosamente",
            "sede": sede,
            "restored_by": updated_by
        }
    
    def get_sedes_statistics(self) -> dict:
        """Obtener estadísticas de sedes"""
        all_sedes = self.sede_dao.get_all(self.db, skip=0, limit=1000)
        
        # Estadísticas por tipo
        tipos = self.sede_dao.get_all_tipos(self.db)
        sedes_por_tipo = {}
        for tipo in tipos:
            sedes_por_tipo[tipo] = len(self.sede_dao.get_by_tipo(self.db, tipo, limit=1000))
        
        # Estadísticas por ubicación
        ciudades = self.sede_dao.get_all_ciudades(self.db)
        provincias = self.sede_dao.get_all_provincias(self.db)
        
        sedes_por_ciudad = {}
        for ciudad in ciudades:
            sedes_por_ciudad[ciudad] = len(self.sede_dao.get_by_ciudad(self.db, ciudad, limit=1000))
        
        sedes_por_provincia = {}
        for provincia in provincias:
            sedes_por_provincia[provincia] = len(self.sede_dao.get_by_provincia(self.db, provincia, limit=1000))
        
        return {
            "total_sedes": len(all_sedes),
            "por_tipo": sedes_por_tipo,
            "por_ciudad": sedes_por_ciudad,
            "por_provincia": sedes_por_provincia,
            "tipos_disponibles": tipos,
            "ciudades": ciudades,
            "provincias": provincias,
            "capacidad_total": sum(s.capacidad_maxima or 0 for s in all_sedes),
            "capacidad_promedio": sum(s.capacidad_maxima or 0 for s in all_sedes) / len(all_sedes) if all_sedes else 0
        }
    
def get_sede_service(db: Session = Depends(get_db)) -> SedeService:
    return SedeService(db)