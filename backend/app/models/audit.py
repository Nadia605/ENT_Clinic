import uuid
from typing import Optional

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from .base import BaseModel
from .types import JSONType


class AuditLog(BaseModel):
    """Who touched which record and how. Never store patient data in `meta`."""

    __tablename__ = "audit_log"

    actor_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    actor_role: Mapped[str] = mapped_column(String(16))
    action: Mapped[str] = mapped_column(String(48), index=True)
    entity: Mapped[str] = mapped_column(String(48))
    entity_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    meta: Mapped[dict] = mapped_column(JSONType, default=dict)
