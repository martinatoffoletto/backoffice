from sqlalchemy.orm import Session
from ..dao.parametro_dao import ParametroDAO
from ..schemas.parametro_schema import Parametro as ParametroSchema
from typing import List, Optional, Dict
from fastapi import HTTPException, status

class ParametroService:
    
    def __init__(self, db: Session):
        self.db = db
        self.parametro_dao = ParametroDAO()
    
    def create_parametro(self, parametro: ParametroSchema, created_by: str) -> dict:
        """Crear un nuevo parámetro del sistema"""
        # Validar que no exista un parámetro con la misma clave
        if self.parametro_dao.exists_by_key(self.db, parametro.key):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un parámetro con la clave '{parametro.key}'"
            )
        
        # Asignar created_by
        parametro.created_by = created_by
        
        # Crear el parámetro
        new_parametro = self.parametro_dao.create(self.db, parametro)
        
        return {
            "message": "Parámetro creado exitosamente",
            "parametro": new_parametro,
            "created_by": created_by
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
    
    def get_parametro_by_key(self, key: str) -> dict:
        """Obtener parámetro por clave"""
        parametro = self.parametro_dao.get_by_key(self.db, key)
        if not parametro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el parámetro con clave '{key}'"
            )
        return {"parametro": parametro}
    
    def get_parametro_value(self, key: str) -> dict:
        """Obtener solo el valor de un parámetro"""
        value = self.parametro_dao.get_value(self.db, key)
        if value is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el parámetro con clave '{key}'"
            )
        return {"key": key, "value": value}
    
    def get_all_parametros(self, skip: int = 0, limit: int = 100) -> dict:
        """Obtener todos los parámetros activos"""
        parametros = self.parametro_dao.get_all(self.db, skip, limit)
        
        return {
            "parametros": parametros,
            "total": len(parametros),
            "skip": skip,
            "limit": limit
        }
    
    def get_parametros_by_categoria(self, categoria: str, skip: int = 0, limit: int = 100) -> dict:
        """Obtener parámetros por categoría"""
        parametros = self.parametro_dao.get_by_categoria(self.db, categoria, skip, limit)
        
        return {
            "parametros": parametros,
            "categoria": categoria,
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
    
    def get_parametros_editables(self, skip: int = 0, limit: int = 100) -> dict:
        """Obtener solo parámetros editables"""
        parametros = self.parametro_dao.get_editables(self.db, skip, limit)
        
        return {
            "parametros": parametros,
            "total": len(parametros),
            "skip": skip,
            "limit": limit,
            "filter": "editables"
        }
    
    def search_parametros(self, search_term: str, search_in: str = "key", skip: int = 0, limit: int = 100) -> dict:
        """Buscar parámetros por clave o descripción"""
        if search_in == "key":
            parametros = self.parametro_dao.search_by_key(self.db, search_term, skip, limit)
        elif search_in == "description":
            parametros = self.parametro_dao.search_by_description(self.db, search_term, skip, limit)
        else:
            # Buscar en ambos campos
            parametros_key = self.parametro_dao.search_by_key(self.db, search_term, skip, limit)
            parametros_desc = self.parametro_dao.search_by_description(self.db, search_term, skip, limit)
            
            # Combinar resultados sin duplicados
            parametros_ids = set()
            parametros = []
            for p in parametros_key + parametros_desc:
                if p.id_parametro not in parametros_ids:
                    parametros.append(p)
                    parametros_ids.add(p.id_parametro)
        
        return {
            "parametros": parametros,
            "search_term": search_term,
            "search_in": search_in,
            "total_found": len(parametros),
            "skip": skip,
            "limit": limit
        }
    
    def update_parametro(self, id_parametro: int, parametro_update: ParametroSchema, updated_by: str) -> dict:
        """Actualizar parámetro con validaciones"""
        # Verificar que el parámetro existe
        existing_parametro = self.parametro_dao.get_by_id(self.db, id_parametro)
        if not existing_parametro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el parámetro con ID {id_parametro}"
            )
        
        # Validar clave única si se está actualizando
        if parametro_update.key and parametro_update.key != existing_parametro.key:
            if self.parametro_dao.exists_by_key(self.db, parametro_update.key):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe un parámetro con la clave '{parametro_update.key}'"
                )
        
        # Asignar updated_by
        parametro_update.updated_by = updated_by
        
        # Actualizar
        updated_parametro = self.parametro_dao.update(self.db, id_parametro, parametro_update)
        
        return {
            "message": "Parámetro actualizado exitosamente",
            "parametro": updated_parametro,
            "updated_by": updated_by
        }
    
    def update_parametro_value(self, key: str, new_value: str, updated_by: str) -> dict:
        """Actualizar solo el valor de un parámetro por clave"""
        # Verificar que el parámetro existe y es editable
        parametro = self.parametro_dao.get_by_key(self.db, key)
        if not parametro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el parámetro con clave '{key}'"
            )
        
        if not parametro.es_editable:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El parámetro '{key}' no es editable"
            )
        
        # Actualizar solo el valor
        updated_parametro = self.parametro_dao.update_value(self.db, key, new_value, updated_by)
        
        return {
            "message": f"Valor del parámetro '{key}' actualizado exitosamente",
            "parametro": updated_parametro,
            "old_value": parametro.value,
            "new_value": new_value,
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
        
        # Eliminar lógicamente
        success = self.parametro_dao.soft_delete(self.db, id_parametro, deleted_by)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al eliminar el parámetro"
            )
        
        return {
            "message": f"Parámetro '{parametro.key}' eliminado exitosamente",
            "deleted_by": deleted_by
        }
    
    def restore_parametro(self, id_parametro: int, updated_by: str) -> dict:
        """Restaurar parámetro eliminado"""
        success = self.parametro_dao.restore(self.db, id_parametro, updated_by)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró un parámetro eliminado con ID {id_parametro}"
            )
        
        # Obtener el parámetro restaurado
        parametro = self.parametro_dao.get_by_id(self.db, id_parametro)
        
        return {
            "message": f"Parámetro '{parametro.key}' restaurado exitosamente",
            "parametro": parametro,
            "restored_by": updated_by
        }
    
    def get_system_configuration(self) -> dict:
        """Obtener configuración completa del sistema agrupada por categorías"""
        all_parametros = self.parametro_dao.get_all(self.db, skip=0, limit=1000)
        
        # Agrupar por categoría
        config_by_category = {}
        for parametro in all_parametros:
            categoria = parametro.categoria or "General"
            if categoria not in config_by_category:
                config_by_category[categoria] = []
            
            config_by_category[categoria].append({
                "key": parametro.key,
                "value": parametro.value,
                "description": parametro.description,
                "tipo": parametro.tipo,
                "es_editable": parametro.es_editable
            })
        
        return {
            "system_configuration": config_by_category,
            "total_parametros": len(all_parametros)
        }
    
    def get_metadata(self) -> dict:
        """Obtener metadatos de los parámetros (categorías y tipos únicos)"""
        categorias = self.parametro_dao.get_all_categories(self.db)
        tipos = self.parametro_dao.get_all_types(self.db)
        
        return {
            "categorias": categorias,
            "tipos": tipos,
            "total_categorias": len(categorias),
            "total_tipos": len(tipos)
        }
    
    def bulk_update_by_category(self, categoria: str, updates: Dict[str, str], updated_by: str) -> dict:
        """Actualizar múltiples parámetros de una categoría"""
        parametros = self.parametro_dao.get_by_categoria(self.db, categoria, 0, 1000)
        
        updated_count = 0
        errors = []
        
        for parametro in parametros:
            if parametro.key in updates and parametro.es_editable:
                try:
                    self.parametro_dao.update_value(self.db, parametro.key, updates[parametro.key], updated_by)
                    updated_count += 1
                except Exception as e:
                    errors.append(f"Error actualizando {parametro.key}: {str(e)}")
        
        return {
            "message": f"Actualización masiva completada para categoría '{categoria}'",
            "updated_count": updated_count,
            "total_in_category": len(parametros),
            "errors": errors,
            "updated_by": updated_by
        }