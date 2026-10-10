from fastapi import APIRouter
from app.auth.router import router as auth_router
from .settings import router as settings_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(settings_router)
