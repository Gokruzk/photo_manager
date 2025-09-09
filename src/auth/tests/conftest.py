import pytest
from unittest.mock import AsyncMock

from auth.app.ports.auth_repository import AuthRepository
from auth.app.ports.user_repository import UserRepository


@pytest.fixture
def mock_user_repository():
    return AsyncMock(spec=UserRepository)


@pytest.fixture
def mock_auth_repository():
    return AsyncMock(spec=AuthRepository)
