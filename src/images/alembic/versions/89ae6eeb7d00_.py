"""empty message

Revision ID: 89ae6eeb7d00
Revises: b605eb4ae858
Create Date: 2025-09-20 21:34:09.303208

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '89ae6eeb7d00'
down_revision: Union[str, Sequence[str], None] = 'b605eb4ae858'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
