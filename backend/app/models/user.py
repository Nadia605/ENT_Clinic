import enum
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Enum, DateTime
from typing import Optional
from .base import BaseModel

class UserRole(str, enum.Enum):
    doctor = "doctor"
    receptionist = "receptionist"
    assistant = "assistant"
    patient = "patient"

class User(BaseModel):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.patient)
    full_name_en: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    full_name_ar: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    preferred_language: Mapped[str] = mapped_column(default="ar")
    use_eastern_numerals: Mapped[bool] = mapped_column(default=False)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
