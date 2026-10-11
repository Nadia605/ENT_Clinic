from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app import audit
from app.database import get_db
from app.dependencies import require_role
from app.models.intake import Intake, IntakeStatus
from app.models.user import User, UserRole
from . import service
from .schemas import ConfirmRequest, IntakeUpdate

router = APIRouter(tags=["Intake"])

patient_only = require_role(UserRole.patient)
clinical_staff = require_role(UserRole.doctor, UserRole.assistant)
any_staff = require_role(UserRole.doctor, UserRole.assistant, UserRole.receptionist)
doctor_only = require_role(UserRole.doctor)


# ---- Patient: fill own intake -------------------------------------------------

@router.get("/intake/me")
async def my_intake(user: User = Depends(patient_only), db: AsyncSession = Depends(get_db)):
    intake = await service.get_or_create_for_patient(db, user)
    audit.record(db, user, "intake.view", "intake", intake.id)
    await db.commit()
    return await service.serialize(db, intake)


@router.put("/intake/me")
async def save_my_intake(data: IntakeUpdate, user: User = Depends(patient_only), db: AsyncSession = Depends(get_db)):
    intake = await service.get_or_create_for_patient(db, user)
    if data.filled_by in ("assistant", "doctor"):
        data.filled_by = "self"
    await service.apply_update(db, intake, data, user)
    audit.record(db, user, "intake.update", "intake", intake.id, fields=sorted(data.model_fields_set))
    await db.commit()
    await db.refresh(intake)
    return await service.serialize(db, intake)


@router.post("/intake/me/submit")
async def submit_my_intake(user: User = Depends(patient_only), db: AsyncSession = Depends(get_db)):
    intake = await service.get_or_create_for_patient(db, user)
    await service.submit(db, intake)
    audit.record(db, user, "intake.submit", "intake", intake.id)
    await db.commit()
    await db.refresh(intake)
    return await service.serialize(db, intake)


# ---- Staff ------------------------------------------------------------------

@router.get("/intakes")
async def list_intakes(
    status: Optional[IntakeStatus] = Query(default=None),
    user: User = Depends(any_staff),
    db: AsyncSession = Depends(get_db),
):
    query = select(Intake).order_by(Intake.updated_at.desc()).limit(200)
    if status is not None:
        query = query.where(Intake.status == status)
    intakes = (await db.execute(query)).scalars().unique().all()
    options = await service.active_options(db)
    include_clinical = user.role != UserRole.receptionist
    audit.record(db, user, "intake.list", "intake", None, count=len(intakes))
    await db.commit()
    return [service.summarize(i, options, include_clinical) for i in intakes]


@router.get("/intakes/stats")
async def intake_stats(user: User = Depends(any_staff), db: AsyncSession = Depends(get_db)):
    rows = await db.execute(select(Intake.status, func.count()).group_by(Intake.status))
    counts = {s.value: 0 for s in IntakeStatus}
    for status, count in rows.all():
        counts[status.value] = count
    return counts


@router.get("/intakes/{intake_id}")
async def get_intake(intake_id: UUID, user: User = Depends(clinical_staff), db: AsyncSession = Depends(get_db)):
    intake = await service.get_intake(db, intake_id)
    audit.record(db, user, "intake.view", "intake", intake.id)
    await db.commit()
    return await service.serialize(db, intake)


@router.put("/intakes/{intake_id}")
async def update_intake(intake_id: UUID, data: IntakeUpdate, user: User = Depends(clinical_staff), db: AsyncSession = Depends(get_db)):
    intake = await service.get_intake(db, intake_id)
    await service.apply_update(db, intake, data, user)
    audit.record(db, user, "intake.update", "intake", intake.id, fields=sorted(data.model_fields_set))
    await db.commit()
    await db.refresh(intake)
    return await service.serialize(db, intake)


@router.post("/intakes/{intake_id}/submit")
async def submit_intake(intake_id: UUID, user: User = Depends(clinical_staff), db: AsyncSession = Depends(get_db)):
    intake = await service.get_intake(db, intake_id)
    await service.submit(db, intake)
    audit.record(db, user, "intake.submit", "intake", intake.id)
    await db.commit()
    await db.refresh(intake)
    return await service.serialize(db, intake)


@router.post("/intakes/{intake_id}/confirm")
async def confirm_intake(intake_id: UUID, body: ConfirmRequest, user: User = Depends(doctor_only), db: AsyncSession = Depends(get_db)):
    intake = await service.get_intake(db, intake_id)
    await service.confirm(db, intake, user, body.unchanged)
    audit.record(db, user, "intake.confirm", "intake", intake.id, unchanged=body.unchanged)
    await db.commit()
    await db.refresh(intake)
    return await service.serialize(db, intake)
