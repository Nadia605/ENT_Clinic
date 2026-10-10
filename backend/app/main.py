from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from contextlib import asynccontextmanager
import logging

from app.config import get_settings
from app.database import engine, async_sessionmaker_instance
from app.api.v1.router import api_router

logger = logging.getLogger(__name__)
settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up AuraENT API...")
    yield
    logger.info("Shutting down AuraENT API...")
    await engine.dispose()

def create_app() -> FastAPI:
    app = FastAPI(title="AuraENT API", lifespan=lifespan)
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/health")
    async def health_check():
        return {"status": "healthy", "service": "auraent-backend", "version": "0.1.0"}

    @app.get("/api/health/db")
    async def health_check_db():
        try:
            async with async_sessionmaker_instance() as session:
                await session.execute(text("SELECT 1"))
            return {"status": "healthy", "db": "connected"}
        except Exception as e:
            return {"status": "unhealthy", "db": str(e)}

    app.include_router(api_router, prefix="/api/v1")
    return app

app = create_app()
