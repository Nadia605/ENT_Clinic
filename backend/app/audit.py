from typing import Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit import AuditLog
from app.models.user import User


def record(db: AsyncSession, actor: User, action: str, entity: str, entity_id: Optional[Any] = None, **meta: Any) -> None:
    """Queue an audit entry on the current session; it is committed with the surrounding change."""
    db.add(
        AuditLog(
            actor_id=actor.id,
            actor_role=actor.role.value,
            action=action,
            entity=entity,
            entity_id=str(entity_id) if entity_id is not None else None,
            meta=meta,
        )
    )
