from typing import Optional
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column

from .base import BaseModel
from .types import JSONType


class HistoryOption(BaseModel):
    """A selectable medical-history item. Seeded rows are placeholders the Doctor can edit."""

    __tablename__ = "history_option"

    code: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(32), index=True)
    name_en: Mapped[str] = mapped_column(String(160))
    name_ar: Mapped[str] = mapped_column(String(160))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    applies_to: Mapped[str] = mapped_column(String(8), default="all")
    has_side: Mapped[bool] = mapped_column(default=False)
    is_active: Mapped[bool] = mapped_column(default=True)
    is_placeholder: Mapped[bool] = mapped_column(default=True)


class Medication(BaseModel):
    """Drug catalog entry. Patients must pick from this list; free-text drug names are not allowed."""

    __tablename__ = "medication"

    brand_name: Mapped[str] = mapped_column(String(120), index=True)
    generic_name: Mapped[str] = mapped_column(String(160), index=True)
    name_ar: Mapped[str] = mapped_column(String(160))
    form: Mapped[str] = mapped_column(String(40))
    strengths: Mapped[list] = mapped_column(JSONType, default=list)
    route: Mapped[str] = mapped_column(String(40))
    drug_class: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    is_placeholder: Mapped[bool] = mapped_column(default=True)
