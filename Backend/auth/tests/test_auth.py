import pytest
from uuid import uuid4
from datetime import datetime
from unittest.mock import AsyncMock

from auth.app.use_cases.auth_service import AuthService
from auth.domain.entities.auth import AuthenticatedUser, User
from auth.domain.entities.exceptions import AuthLoginError, AuthUserNotFoundError
from auth.domain.entities.value_objects import CodState, UbicationCod, UserCod, Username


@pytest.mark.usefixtures("mock_auth_repository", "mock_user_repository")
class TestAuthService:
    @pytest.fixture(autouse=True)
    def setup_service(self, mock_auth_repository, mock_user_repository):
        self.mock_auth_repository = mock_auth_repository
        self.mock_user_repository = mock_user_repository
        self.service = AuthService(mock_auth_repository, mock_user_repository)

    @pytest.mark.asyncio
    async def test_login_success(self):
        # Arrange

        user = User(username=Username("x"), password="12345678")

        expected_user = AuthenticatedUser(
            cod_user=UserCod(uuid4()),
            cod_ubi=UbicationCod(1),
            cod_state=CodState(1),
            username=Username("x"),
            email="x@x.com",
            birthdate=datetime.now()
        )

        self.mock_user_repository.find_by_username = AsyncMock(
            return_value=expected_user)

        self.mock_auth_repository.login = AsyncMock(return_value=expected_user)

        # Act
        result = await self.service.login(user)

        # Assert
        assert result == expected_user
        self.mock_auth_repository.login.assert_called_once_with(user)

    @pytest.mark.asyncio
    async def test_login_user_not_found(self):
        # Arrange

        user = User(username=Username("x"), password="12345678")

        self.mock_user_repository.find_by_username = AsyncMock(
            AuthUserNotFoundError(f"The user {user.username} does not exist"))

        self.mock_auth_repository.login = AsyncMock(return_value=None)

        # Act & Assert
        with pytest.raises(AuthLoginError,  match=f"Unexpected error siging the user {user.username}"):
            await self.service.login(user)

    @pytest.mark.asyncio
    async def test_login_wrong_password(self):
        # Arrange

        user = User(username=Username("x"), password="12345678")

        expected_user = AuthenticatedUser(
            cod_user=UserCod(uuid4()),
            cod_ubi=UbicationCod(1),
            cod_state=CodState(1),
            username=Username("x"),
            email="x@x.com",
            birthdate=datetime.now()
        )

        self.mock_user_repository.find_by_username = AsyncMock(return_value=expected_user)

        self.mock_auth_repository.login = AsyncMock(return_value=None)

        # Act & Assert
        with pytest.raises(AuthLoginError,  match=f"Unexpected error siging the user {user.username}"):
            await self.service.login(user)
