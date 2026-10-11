from fastapi import APIRouter
from app.auth.router import router as auth_router
from app.intake.router import router as intake_router
from .catalog import router as catalog_router
from .settings import router as settings_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(settings_router)
api_router.include_router(catalog_router)
api_router.include_router(intake_router)
