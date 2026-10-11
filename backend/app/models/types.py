from sqlalchemy import JSON
from sqlalchemy.dialects.postgresql import JSONB

# JSONB on PostgreSQL, plain JSON elsewhere (the test suite runs on SQLite).
JSONType = JSON().with_variant(JSONB(), "postgresql")
