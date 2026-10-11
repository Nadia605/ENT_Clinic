"""Initial schema: users, clinic settings, intake catalogs, intake, audit log.

Revision ID: 0001_initial
Revises:
Create Date: 2026-10-11
"""

from alembic import op

from app.models import Base

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None

TABLES = ["users", "clinic_settings", "history_option", "medication", "intake", "audit_log"]


def upgrade() -> None:
    bind = op.get_bind()
    tables = [Base.metadata.tables[name] for name in TABLES]
    Base.metadata.create_all(bind=bind, tables=tables, checkfirst=True)


def downgrade() -> None:
    bind = op.get_bind()
    tables = [Base.metadata.tables[name] for name in reversed(TABLES)]
    Base.metadata.drop_all(bind=bind, tables=tables, checkfirst=True)
