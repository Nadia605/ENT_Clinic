from datetime import datetime, timezone
from typing import Iterable, List, Optional
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.catalog import HistoryOption, Medication
from app.models.intake import Intake, IntakeStatus
from app.models.user import User, UserRole
from .constants import ENT_CATEGORIES, FREQUENCY_CODES, ONSET_CODES, OTHER_CATEGORIES, REACTION_CODES
from .schemas import IntakeUpdate

REQUIRED_PARTS = ("consent", "allergy_answer", "allergy_details", "child_details", "history_ent", "history_other")


def _now() -> datetime:
    return datetime.now(timezone.utc)


async def active_options(db: AsyncSession) -> List[HistoryOption]:
    result = await db.execute(
        select(HistoryOption).where(HistoryOption.is_active.is_(True)).order_by(HistoryOption.category, HistoryOption.sort_order)
    )
    return list(result.scalars().all())


def _applies(option: HistoryOption, is_child: bool) -> bool:
    return option.applies_to == "all" or option.applies_to == ("child" if is_child else "adult")


def missing_parts(intake: Intake, options: Iterable[HistoryOption]) -> List[str]:
    """What still blocks submission. A blank answer is never treated as 'no'."""
    missing: List[str] = []
    if intake.consent_at is None:
        missing.append("consent")
    if intake.allergy_answer is None:
        missing.append("allergy_answer")
    elif intake.allergy_answer == "yes" and not intake.allergies:
        missing.append("allergy_details")
    if intake.is_child and (intake.child_age_years is None or intake.child_weight_kg is None):
        missing.append("child_details")

    answered = intake.history or {}
    applicable = [o for o in options if _applies(o, intake.is_child)]
    if any(o.category in ENT_CATEGORIES and o.code not in answered for o in applicable):
        missing.append("history_ent")
    if any(o.category in OTHER_CATEGORIES and o.code not in answered for o in applicable):
        missing.append("history_other")
    return missing


def progress(missing: List[str]) -> int:
    return round(100 * (len(REQUIRED_PARTS) - len(missing)) / len(REQUIRED_PARTS))


async def get_or_create_for_patient(db: AsyncSession, patient: User) -> Intake:
    result = await db.execute(
        select(Intake).where(Intake.patient_id == patient.id).order_by(Intake.created_at.desc()).limit(1)
    )
    intake = result.scalars().first()
    if intake is None:
        intake = Intake(patient_id=patient.id, status=IntakeStatus.not_started, history={}, other_notes={}, allergies=[], medications=[])
        db.add(intake)
        await db.flush()
        await db.refresh(intake)
    return intake


async def get_intake(db: AsyncSession, intake_id: UUID) -> Intake:
    intake = await db.get(Intake, intake_id)
    if intake is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Intake not found")
    return intake


async def _validate_references(db: AsyncSession, data: IntakeUpdate, options: List[HistoryOption]) -> None:
    med_ids = {a.medication_id for a in data.allergies or []} | {m.medication_id for m in data.medications or []}
    if med_ids:
        found = await db.execute(select(Medication.id).where(Medication.id.in_(med_ids)))
        if len(set(found.scalars().all())) != len(med_ids):
            raise HTTPException(status_code=422, detail="Unknown medication selected")
    for allergy in data.allergies or []:
        if allergy.reaction not in REACTION_CODES:
            raise HTTPException(status_code=422, detail="Unknown reaction")
    for med in data.medications or []:
        if med.frequency is not None and med.frequency not in FREQUENCY_CODES:
            raise HTTPException(status_code=422, detail="Unknown frequency")
    if data.history:
        codes = {o.code: o for o in options}
        for code, item in data.history.items():
            option = codes.get(code)
            if option is None:
                raise HTTPException(status_code=422, detail="Unknown history option")
            if item.onset is not None and item.onset not in ONSET_CODES:
                raise HTTPException(status_code=422, detail="Unknown onset")
    if data.other_notes and any(len(v) > 280 for v in data.other_notes.values()):
        raise HTTPException(status_code=422, detail="Note is too long")


async def apply_update(db: AsyncSession, intake: Intake, data: IntakeUpdate, editor: User) -> None:
    if intake.status == IntakeStatus.doctor_confirmed and editor.role != UserRole.doctor:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Intake already confirmed by the doctor")

    options = await active_options(db)
    await _validate_references(db, data, options)

    fields = data.model_dump(exclude_unset=True, mode="json")
    if "consent" in fields:
        intake.consent_at = _now() if fields.pop("consent") else None
    for key in ("current_step", "filled_by", "is_child", "child_age_years", "child_weight_kg", "allergy_answer", "allergies", "other_notes", "medications"):
        if key in fields:
            setattr(intake, key, fields[key])
    if "history" in fields:
        # Details only make sense after "Yes".
        intake.history = {
            code: {**item, "side": item.get("side") if item["answer"] == "yes" else None, "onset": item.get("onset") if item["answer"] == "yes" else None}
            for code, item in fields["history"].items()
        }
    if intake.allergy_answer != "yes":
        intake.allergies = []

    intake.last_edited_role = editor.role.value
    if intake.status == IntakeStatus.not_started:
        intake.status = IntakeStatus.in_progress
    elif intake.status == IntakeStatus.doctor_confirmed:
        # The doctor edited a confirmed intake: it must be re-confirmed.
        intake.status = IntakeStatus.complete
        intake.confirmed_at = None
        intake.confirmed_by_id = None
        intake.confirmed_unchanged = False


async def submit(db: AsyncSession, intake: Intake) -> None:
    if intake.status == IntakeStatus.doctor_confirmed:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Intake already confirmed by the doctor")
    missing = missing_parts(intake, await active_options(db))
    if missing:
        raise HTTPException(status_code=422, detail={"message": "Intake is incomplete", "missing": missing})
    intake.status = IntakeStatus.complete
    intake.submitted_at = _now()


async def confirm(db: AsyncSession, intake: Intake, doctor: User, unchanged: bool) -> None:
    missing = missing_parts(intake, await active_options(db))
    if missing:
        raise HTTPException(status_code=422, detail={"message": "Intake is incomplete", "missing": missing})
    intake.status = IntakeStatus.doctor_confirmed
    intake.submitted_at = intake.submitted_at or _now()
    intake.confirmed_at = _now()
    intake.confirmed_by_id = doctor.id
    intake.confirmed_unchanged = unchanged


async def _medications_by_id(db: AsyncSession, ids: Iterable[str]) -> dict:
    ids = {UUID(str(i)) for i in ids}
    if not ids:
        return {}
    result = await db.execute(select(Medication).where(Medication.id.in_(ids)))
    return {str(m.id): medication_out(m) for m in result.scalars().all()}


def medication_out(m: Medication) -> dict:
    return {
        "id": str(m.id),
        "brand_name": m.brand_name,
        "generic_name": m.generic_name,
        "name_ar": m.name_ar,
        "form": m.form,
        "strengths": m.strengths or [],
        "route": m.route,
        "is_placeholder": m.is_placeholder,
    }


def person(user: Optional[User]) -> Optional[dict]:
    if user is None:
        return None
    return {"id": user.id, "name_en": user.full_name_en, "name_ar": user.full_name_ar}


async def serialize(db: AsyncSession, intake: Intake) -> dict:
    options = await active_options(db)
    missing = missing_parts(intake, options)
    meds = await _medications_by_id(
        db, [a["medication_id"] for a in intake.allergies or []] + [m["medication_id"] for m in intake.medications or []]
    )
    return {
        "id": intake.id,
        "status": intake.status.value,
        "current_step": intake.current_step,
        "patient": person(intake.patient),
        "patient_phone": intake.patient.phone if intake.patient else None,
        "consent_at": intake.consent_at,
        "filled_by": intake.filled_by,
        "is_child": intake.is_child,
        "child_age_years": intake.child_age_years,
        "child_weight_kg": float(intake.child_weight_kg) if intake.child_weight_kg is not None else None,
        "allergy_answer": intake.allergy_answer,
        "allergies": [{**a, "medication": meds.get(a["medication_id"])} for a in intake.allergies or []],
        "history": intake.history or {},
        "other_notes": intake.other_notes or {},
        "medications": [{**m, "medication": meds.get(m["medication_id"])} for m in intake.medications or []],
        "submitted_at": intake.submitted_at,
        "updated_at": intake.updated_at,
        "last_edited_role": intake.last_edited_role,
        "confirmed_at": intake.confirmed_at,
        "confirmed_by": person(intake.confirmed_by),
        "confirmed_unchanged": intake.confirmed_unchanged,
        "missing": missing,
    }


def summarize(intake: Intake, options: List[HistoryOption], include_clinical: bool) -> dict:
    missing = missing_parts(intake, options)
    return {
        "id": intake.id,
        "status": intake.status.value,
        "patient": person(intake.patient),
        "updated_at": intake.updated_at,
        "submitted_at": intake.submitted_at,
        "has_allergy": (intake.allergy_answer == "yes") if include_clinical and intake.allergy_answer else None,
        "progress": progress(missing),
    }
