import enum
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from .base import BaseModel
from .types import JSONType
from .user import User


class IntakeStatus(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    complete = "complete"
    doctor_confirmed = "doctor_confirmed"


class Intake(BaseModel):
    """Pre-visit intake. Everything here is patient-reported until the Doctor confirms it."""

    __tablename__ = "intake"

    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    status: Mapped[IntakeStatus] = mapped_column(Enum(IntakeStatus), default=IntakeStatus.not_started, index=True)
    current_step: Mapped[int] = mapped_column(Integer, default=0)

    consent_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    filled_by: Mapped[str] = mapped_column(String(16), default="self")
    is_child: Mapped[bool] = mapped_column(default=False)
    child_age_years: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    child_weight_kg: Mapped[Optional[float]] = mapped_column(Numeric(5, 1), nullable=True)

    allergy_answer: Mapped[Optional[str]] = mapped_column(String(8), nullable=True)
    allergies: Mapped[list] = mapped_column(JSONType, default=list)
    history: Mapped[dict] = mapped_column(JSONType, default=dict)
    other_notes: Mapped[dict] = mapped_column(JSONType, default=dict)
    medications: Mapped[list] = mapped_column(JSONType, default=list)

    submitted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    last_edited_role: Mapped[Optional[str]] = mapped_column(String(16), nullable=True)
    confirmed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    confirmed_by_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    confirmed_unchanged: Mapped[bool] = mapped_column(default=False)

    patient: Mapped[User] = relationship(foreign_keys=[patient_id], lazy="joined")
    confirmed_by: Mapped[Optional[User]] = relationship(foreign_keys=[confirmed_by_id], lazy="joined")
