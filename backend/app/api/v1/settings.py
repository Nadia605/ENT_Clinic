from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User, UserRole
from app.models.clinic_settings import ClinicSettings
from app.dependencies import get_current_user, require_role

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("/")
async def get_settings_info(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ClinicSettings))
    settings = result.scalars().first()
    if current_user.role == UserRole.patient:
        return {
            "name_en": settings.name_en,
            "name_ar": settings.name_ar,
            "doctor_display_name_en": settings.doctor_display_name_en,
            "doctor_display_name_ar": settings.doctor_display_name_ar,
            "phone": settings.phone,
            "whatsapp_number": settings.whatsapp_number,
            "address_en": settings.address_en,
            "address_ar": settings.address_ar,
            "working_hours": settings.working_hours,
        }
    return settings

@router.put("/")
async def update_settings(data: dict, current_user: User = Depends(require_role(UserRole.doctor)), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ClinicSettings))
    settings = result.scalars().first()
    if not settings:
        settings = ClinicSettings(**data)
        db.add(settings)
    else:
        for k, v in data.items():
            if hasattr(settings, k):
                setattr(settings, k, v)
    await db.commit()
    await db.refresh(settings)
    return settings
