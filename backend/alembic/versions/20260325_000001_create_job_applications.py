"""create job applications

Revision ID: 20260325_000001
Revises:
Create Date: 2026-03-25 00:00:01
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "20260325_000001"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "job_applications",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("company_name", sa.String(length=255), nullable=False),
        sa.Column("job_title", sa.String(length=255), nullable=False),
        sa.Column("job_description", sa.Text(), nullable=True),
        sa.Column("job_url", sa.String(length=255), nullable=True),
        sa.Column("status", sa.String(length=255), nullable=True),
        sa.Column("resume_filename", sa.String(length=255), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("applied_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_job_applications_applied_at"), "job_applications", ["applied_at"], unique=False)
    op.create_index(op.f("ix_job_applications_updated_at"), "job_applications", ["updated_at"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_job_applications_updated_at"), table_name="job_applications")
    op.drop_index(op.f("ix_job_applications_applied_at"), table_name="job_applications")
    op.drop_table("job_applications")
