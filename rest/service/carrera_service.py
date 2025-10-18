from sqlalchemy.orm import Session
from ..dao.carrera_dao import CarreraDAO
from ..schemas.carrera_schema import CarreraCreate, CarreraUpdate
from typing import List, Optional
from uuid import UUID
from fastapi import HTTPException, status, Depends
from ..database import get_db

class CarreraService:
    
    def __init__(self, db: Session):
        self.db = db
        self.carrera_dao = CarreraDAO()
    
    def create_carrera(self, carrera: CarreraCreate, created_by: str) -> dict:
        if self.carrera_dao.exists_by_nombre(self.db, carrera.nombre):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe una carrera con el nombre '{carrera.nombre}'"
            )
        
        new_carrera = self.carrera_dao.create(self.db, carrera)
        
        return {
            "message": "Carrera creada exitosamente",
            "carrera": new_carrera,
            "created_by": created_by
        }
    
    def get_carrera_by_id(self, id_carrera: UUID) -> dict:
        carrera = self.carrera_dao.get_by_id(self.db, id_carrera)
        if not carrera:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la carrera con ID {id_carrera}"
            )
        return {"carrera": carrera}
    
    def get_all_carreras(self, skip: int = 0, limit: int = 100) -> dict:
        carreras = self.carrera_dao.get_all(self.db, skip, limit)
        return {
            "carreras": carreras,
            "total": len(carreras),
            "skip": skip,
            "limit": limit
        }
    
    def search_carreras(self, nombre_pattern: str, skip: int = 0, limit: int = 100) -> dict:
        carreras = self.carrera_dao.search_by_nombre(self.db, nombre_pattern, skip, limit)
        return {
            "carreras": carreras,
            "search_pattern": nombre_pattern,
            "total_found": len(carreras),
            "skip": skip,
            "limit": limit
        }
    
    def update_carrera(self, id_carrera: UUID, carrera_update: CarreraUpdate, updated_by: str) -> dict:
        existing_carrera = self.carrera_dao.get_by_id(self.db, id_carrera)
        if not existing_carrera:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la carrera con ID {id_carrera}"
            )
        
        if carrera_update.nombre and carrera_update.nombre != existing_carrera.nombre:
            if self.carrera_dao.exists_by_nombre(self.db, carrera_update.nombre):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe una carrera con el nombre '{carrera_update.nombre}'"
                )
        
        updated_carrera = self.carrera_dao.update(self.db, id_carrera, carrera_update)
        
        return {
            "message": "Carrera actualizada exitosamente",
            "carrera": updated_carrera,
            "updated_by": updated_by
        }
    
    def delete_carrera(self, id_carrera: UUID, deleted_by: str) -> dict:
        carrera = self.carrera_dao.get_by_id(self.db, id_carrera)
        if not carrera:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró la carrera con ID {id_carrera}"
            )
        
        # TODO: Validar que no haya usuarios activos en esta carrera
        
        success = self.carrera_dao.soft_delete(self.db, id_carrera)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al eliminar la carrera"
            )
        
        return {
            "message": f"Carrera '{carrera.nombre}' eliminada exitosamente",
            "deleted_by": deleted_by
        }

def get_carrera_service(db: Session = Depends(get_db)) -> CarreraService:
    return CarreraService(db)
