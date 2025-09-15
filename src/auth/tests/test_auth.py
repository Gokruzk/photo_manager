import pytest
from uuid import uuid4
from unittest.mock import AsyncMock

from auth.app.use_cases.auth_service import AuthService
from auth.domain.entities.auth import AuthenticatedUser, User
from auth.domain.exceptions.exceptions import AuthLoginError, AuthUserNotFoundError
from auth.domain.value_objects.value_objects import (
    CodState,
    UbicationCod,
    UserCod,
    Username,
)


@pytest.mark.usefixtures("mock_auth_repository", "mock_user_repository")
class TestAuthService:
    @pytest.fixture(autouse=True)
    def setup_service(self, mock_auth_repository, mock_user_repository):
        self.mock_auth_repository = mock_auth_repository
        self.mock_user_repository = mock_user_repository
        self.service = AuthService(mock_auth_repository, mock_user_repository)

    @pytest.mark.asyncio
    async def test_should_login_user_successfully_with_valid_credentials(self):
        # Arrange
        user = User(username=Username("x"), password="12345678")

        expected_user = AuthenticatedUser(
            cod_user=UserCod(uuid4()),
            cod_ubi=UbicationCod(1),
            cod_state=CodState(1),
            username=Username("x"),
            email="x@x.com",
        )

        self.mock_user_repository.find_by_username = AsyncMock(
            return_value=expected_user
        )
        self.mock_auth_repository.login = AsyncMock(return_value=expected_user)

        # Act
        result = await self.service.login(user)

        # Assert
        assert result == expected_user
        self.mock_auth_repository.login.assert_called_once_with(user)

    @pytest.mark.asyncio
    async def test_should_raise_auth_login_error_when_user_does_not_exist(self):
        # Arrange
        user = User(username=Username("x"), password="12345678")

        self.mock_user_repository.find_by_username = AsyncMock(return_value=None)
        self.mock_auth_repository.login = AsyncMock(return_value=None)

        # Act & Assert
        with pytest.raises(
            AuthUserNotFoundError, match=f"The user {user.username} does not exist"
        ):
            await self.service.login(user)

    @pytest.mark.asyncio
    async def test_should_raise_auth_login_error_when_password_is_incorrect(self):
        # Arrange
        user = User(username=Username("x"), password="wrongpass")

        expected_user = AuthenticatedUser(
            cod_user=UserCod(uuid4()),
            cod_ubi=UbicationCod(1),
            cod_state=CodState(1),
            username=Username("x"),
            email="x@x.com",
        )

        self.mock_user_repository.find_by_username = AsyncMock(
            return_value=expected_user
        )
        self.mock_auth_repository.login = AsyncMock(return_value=None)

        # Act & Assert
        with pytest.raises(
            AuthLoginError, match=f"Unexpected error signing the user {user.username}"
        ):
            await self.service.login(user)

    @pytest.mark.asyncio
    async def test_should_raise_auth_login_error_when_auth_repository_fails(self):
        # Arrange
        user = User(username=Username("x"), password="12345678")

        expected_user = AuthenticatedUser(
            cod_user=UserCod(uuid4()),
            cod_ubi=UbicationCod(1),
            cod_state=CodState(1),
            username=Username("x"),
            email="x@x.com",
        )

        self.mock_user_repository.find_by_username = AsyncMock(
            return_value=expected_user
        )
        self.mock_auth_repository.login = AsyncMock(side_effect=Exception("DB Fail"))

        # Act & Assert
        with pytest.raises(
            AuthLoginError, match=f"Unexpected error signing the user {user.username}"
        ):
            await self.service.login(user)

    @pytest.mark.asyncio
    async def test_should_raise_value_error_when_username_is_empty(self):
        # Value object Username valida el tamaño
        with pytest.raises(
            ValueError, match="Username length must be between 1 and 15"
        ):
            Username("")
