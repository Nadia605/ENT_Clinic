from datetime import datetime
from typing import Dict, List, Literal, Optional
from uuid import UUID

from pydantic import BaseModel, Field

AllergyAnswer = Literal["yes", "no", "unsure"]
HistoryAnswer = Literal["yes", "no", "unknown"]
Side = Literal["right", "left", "both"]


class AllergyItem(BaseModel):
    medication_id: UUID
    reaction: str


class HistoryAnswerItem(BaseModel):
    answer: HistoryAnswer
    side: Optional[Side] = None
    onset: Optional[str] = None


class MedicationItem(BaseModel):
    medication_id: UUID
    strength: Optional[str] = None
    frequency: Optional[str] = None
    still_taking: bool = True
    review: Optional[Literal["continue", "changed", "stopped"]] = None


class IntakeUpdate(BaseModel):
    """Partial autosave payload. Only fields that are sent are changed."""

    current_step: Optional[int] = Field(default=None, ge=0, le=6)
    consent: Optional[bool] = None
    filled_by: Optional[Literal["self", "parent", "assistant", "doctor"]] = None
    is_child: Optional[bool] = None
    child_age_years: Optional[int] = Field(default=None, ge=0, le=17)
    child_weight_kg: Optional[float] = Field(default=None, gt=0, le=150)
    allergy_answer: Optional[AllergyAnswer] = None
    allergies: Optional[List[AllergyItem]] = None
    history: Optional[Dict[str, HistoryAnswerItem]] = None
    other_notes: Optional[Dict[str, str]] = None
    medications: Optional[List[MedicationItem]] = None


class ConfirmRequest(BaseModel):
    unchanged: bool = False


class PersonOut(BaseModel):
    id: UUID
    name_en: Optional[str]
    name_ar: Optional[str]


class IntakeSummary(BaseModel):
    id: UUID
    status: str
    patient: PersonOut
    updated_at: Optional[datetime]
    submitted_at: Optional[datetime]
    has_allergy: Optional[bool] = None
    progress: int


class IntakeOut(BaseModel):
    id: UUID
    status: str
    current_step: int
    patient: PersonOut
    patient_phone: Optional[str]
    consent_at: Optional[datetime]
    filled_by: str
    is_child: bool
    child_age_years: Optional[int]
    child_weight_kg: Optional[float]
    allergy_answer: Optional[str]
    allergies: list
    history: dict
    other_notes: dict
    medications: list
    submitted_at: Optional[datetime]
    updated_at: Optional[datetime]
    last_edited_role: Optional[str]
    confirmed_at: Optional[datetime]
    confirmed_by: Optional[PersonOut]
    confirmed_unchanged: bool
    missing: List[str]
