from sqlalchemy.orm import Session
from ..dao.parametro_dao import ParametroDAO
from ..schemas.parametro_schema import Parametro as ParametroSchema
from typing import List, Optional, Dict
from fastapi import HTTPException, status, Depends
from ..database import get_db # Importar get_db

class ParametroService:
    
    def __init__(self, db: Session):
        self.db = db
        self.parametro_dao = ParametroDAO()
    
    def create_parametro(self, parametro: ParametroSchema, created_by: str) -> dict:
        """Crear un nuevo parámetro del sistema"""
        # Validar que no exista un parámetro con el mismo nombre
        if self.parametro_dao.exists_by_nombre(self.db, parametro.nombre):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un parámetro con el nombre '{parametro.nombre}'"
            )
        
        # (El DAO se encarga de 'created_by' si se lo pasamos en el schema, 
        # pero el schema 'Parametro' no tiene 'created_by'.
        # Lo ideal sería tener un 'ParametroCreate' schema que lo incluya)
        
        # Crear el parámetro
        new_parametro = self.parametro_dao.create(self.db, parametro)
        
        return {
            "message": "Parámetro creado exitosamente",
            "parametro": new_parametro,
            "created_by": created_by # Devolvemos el usuario, aunque no se guarde
        }
    
    def get_parametro_by_id(self, id_parametro: int) -> dict:
        """Obtener parámetro por ID"""
        parametro = self.parametro_dao.get_by_id(self.db, id_parametro)
        if not parametro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el parámetro con ID {id_parametro}"
            )
        return {"parametro": parametro}
    
    def get_parametro_by_nombre(self, nombre: str) -> dict:
        """Obtener parámetro por nombre"""
        parametro = self.parametro_dao.get_by_nombre(self.db, nombre)
        if not parametro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el parámetro con nombre '{nombre}'"
            )
        return {"parametro": parametro}
    
    def get_parametro_valores(self, nombre: str) -> dict:
        """Obtener los valores de un parámetro"""
        valores = self.parametro_dao.get_valores_by_nombre(self.db, nombre)
        if valores is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el parámetro con nombre '{nombre}'"
            )
        return {"nombre": nombre, "valores": valores}
    
    def get_all_parametros(self, skip: int = 0, limit: int = 100) -> dict:
        """Obtener todos los parámetros activos"""
        parametros = self.parametro_dao.get_all(self.db, skip, limit)
        
        return {
            "parametros": parametros,
            "total": len(parametros),
            "skip": skip,
            "limit": limit
        }
    
    def get_parametros_by_tipo(self, tipo: str, skip: int = 0, limit: int = 100) -> dict:
        """Obtener parámetros por tipo"""
        parametros = self.parametro_dao.get_by_tipo(self.db, tipo, skip, limit)
        
        return {
            "parametros": parametros,
            "tipo": tipo,
            "total": len(parametros),
            "skip": skip,
            "limit": limit
        }

    def search_parametros_by_nombre(self, nombre_pattern: str, skip: int = 0, limit: int = 100) -> dict:
        """Buscar parámetros por nombre"""
        parametros = self.parametro_dao.search_by_nombre(self.db, nombre_pattern, skip, limit)
        
        return {
            "parametros": parametros,
            "search_term": nombre_pattern,
            "total_found": len(parametros),
            "skip": skip,
            "limit": limit
        }
    
    def update_parametro(self, id_parametro: int, parametro_update: ParametroSchema, updated_by: str) -> dict:
        """Actualizar parámetro con validaciones"""
        existing_parametro = self.parametro_dao.get_by_id(self.db, id_parametro)
        if not existing_parametro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el parámetro con ID {id_parametro}"
            )
        
        if parametro_update.nombre and parametro_update.nombre != existing_parametro.nombre:
            if self.parametro_dao.exists_by_nombre(self.db, parametro_update.nombre):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe un parámetro con el nombre '{parametro_update.nombre}'"
                )
        
        updated_parametro = self.parametro_dao.update(self.db, id_parametro, parametro_update)
        
        return {
            "message": "Parámetro actualizado exitosamente",
            "parametro": updated_parametro,
            "updated_by": updated_by
        }
    
    def delete_parametro(self, id_parametro: int, deleted_by: str) -> dict:
        """Eliminar parámetro lógicamente"""
        parametro = self.parametro_dao.get_by_id(self.db, id_parametro)
        if not parametro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el parámetro con ID {id_parametro}"
            )
        
        success = self.parametro_dao.soft_delete(self.db, id_parametro, deleted_by)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al eliminar el parámetro"
            )
        
        return {
            "message": f"Parámetro '{parametro.nombre}' eliminado exitosamente",
            "deleted_by": deleted_by
        }

def get_parametro_service(db: Session = Depends(get_db)) -> ParametroService:
    return ParametroService(db)