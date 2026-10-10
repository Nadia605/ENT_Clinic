from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.clinic_settings import ClinicSettings

async def seed(db: AsyncSession):
    result = await db.execute(select(ClinicSettings))
    existing = result.scalars().first()
    if not existing:
        settings = ClinicSettings(
            name_en="Mohamed Khalil ENT Clinic",
            name_ar="عيادة محمد خليل للأنف والأذن والحنجرة",
            brand_color="#0F766E",
            currency="EGP",
            timezone="Africa/Cairo",
            default_language="ar",
            show_powered_by=True,
            patient_code_prefix="MK",
            week_start="saturday",
            clock_format="12h",
        )
        db.add(settings)
        await db.commit()
        print("Seeded ClinicSettings.")
    else:
        print("ClinicSettings already seeded.")
