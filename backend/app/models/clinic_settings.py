from sqlalchemy.orm import Mapped, mapped_column
from .base import BaseModel
from .types import JSONType as JSONB
from typing import Dict, Any

class ClinicSettings(BaseModel):
    __tablename__ = "clinic_settings"

    name_en: Mapped[str] = mapped_column(default="Mohamed Khalil ENT Clinic")
    name_ar: Mapped[str] = mapped_column(default="عيادة محمد خليل للأنف والأذن والحنجرة")
    doctor_display_name_en: Mapped[str] = mapped_column(nullable=True)
    doctor_display_name_ar: Mapped[str] = mapped_column(nullable=True)
    specialty_line_en: Mapped[str] = mapped_column(nullable=True)
    specialty_line_ar: Mapped[str] = mapped_column(nullable=True)
    phone: Mapped[str] = mapped_column(nullable=True)
    whatsapp_number: Mapped[str] = mapped_column(nullable=True)
    address_en: Mapped[str] = mapped_column(nullable=True)
    address_ar: Mapped[str] = mapped_column(nullable=True)
    working_hours: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=True)
    logo_object_key: Mapped[str] = mapped_column(nullable=True)
    brand_color: Mapped[str] = mapped_column(default="#0F766E")
    currency: Mapped[str] = mapped_column(default="EGP")
    timezone: Mapped[str] = mapped_column(default="Africa/Cairo")
    default_language: Mapped[str] = mapped_column(default="ar")
    show_powered_by: Mapped[bool] = mapped_column(default=True)
    patient_code_prefix: Mapped[str] = mapped_column(default="MK")
    week_start: Mapped[str] = mapped_column(default="saturday")
    clock_format: Mapped[str] = mapped_column(default="12h")
