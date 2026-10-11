from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.intake import constants
from app.intake.service import active_options, medication_out
from app.models.catalog import Medication
from app.models.user import User

router = APIRouter(prefix="/catalog", tags=["Catalog"])


@router.get("/intake-options")
async def intake_options(_: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    options = await active_options(db)
    return {
        "categories": constants.HISTORY_CATEGORIES,
        "history": [
            {
                "code": o.code,
                "category": o.category,
                "name_en": o.name_en,
                "name_ar": o.name_ar,
                "applies_to": o.applies_to,
                "has_side": o.has_side,
                "is_placeholder": o.is_placeholder,
            }
            for o in options
        ],
        "reactions": constants.REACTIONS,
        "frequencies": constants.FREQUENCIES,
        "onset": constants.ONSET,
    }


@router.get("/medications")
async def search_medications(
    q: str = Query(default="", max_length=60),
    _: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Medication).where(Medication.is_active.is_(True))
    term = q.strip()
    if term:
        like = f"%{term}%"
        # TODO(phase 2.3): switch to pg_trgm similarity ranking for fuzzy matching on PostgreSQL.
        query = query.where(or_(Medication.brand_name.ilike(like), Medication.generic_name.ilike(like), Medication.name_ar.ilike(like)))
    result = await db.execute(query.order_by(Medication.brand_name).limit(12))
    return [medication_out(m) for m in result.scalars().all()]
