from fastapi import APIRouter, HTTPException, status, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
import uuid
from ..schemas.usuario_schema import UsuarioCreate, UsuarioUpdate, Usuario
from ..service.usuario_service import UsuarioService
from ..database import get_db

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_user(usuario: UsuarioCreate, db: AsyncSession = Depends(get_db)):
    created_user, message = await UsuarioService.create_user(db, usuario)
    if created_user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    return {
        "user": created_user,
        "password": message,
        "message": "User created successfully"
    }

@router.get("/", response_model=List[Usuario])
async def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status_filter: Optional[bool] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    return await UsuarioService.get_all_users(db, skip, limit, status_filter)

@router.get("/search", response_model=List[Usuario])
async def search_users(
    param: str = Query(..., description="Search parameter: id, legajo, dni, email, name, status"),
    value: str = Query(..., description="Search value"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    valid_params = ["id", "legajo", "dni", "email", "name", "status"]
    if param.lower() not in valid_params:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid search parameter: {param}. Valid parameters: {', '.join(valid_params)}"
        )
    return await UsuarioService.search(db, param, value, skip, limit)

@router.put("/{user_id}", response_model=Usuario)
async def update_user(
    user_id: uuid.UUID,
    usuario_update: UsuarioUpdate,
    db: AsyncSession = Depends(get_db)
):
    updated_user = await UsuarioService.update_user(db, user_id, usuario_update)
    if updated_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found or DNI already exists"
        )
    return updated_user

@router.delete("/{user_id}", response_model=dict, status_code=status.HTTP_200_OK)
async def delete_user(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    success = await UsuarioService.delete_user(db, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return {
        "message": "User deleted successfully",
        "user_id": str(user_id),
        "status": False
    }