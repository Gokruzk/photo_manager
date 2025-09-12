import pytest
from uuid import uuid4
from datetime import datetime
from unittest.mock import AsyncMock

from auth.domain.entities.user import UserRetrieve
from auth.domain.entities.auth import RegisterUser
from auth.app.use_cases.user_service import UserService
from auth.domain.exceptions.exceptions import AuthUserNotFoundError
from auth.domain.value_objects.value_objects import CodState, UbicationCod, UserCod, Username


@pytest.mark.usefixtures("mock_user_repository")
class TestUserService:
    @pytest.fixture(autouse=True)
    def setup_service(self, mock_user_repository):
        self.mock_user_repository = mock_user_repository
        self.service = UserService(mock_user_repository)

    @pytest.mark.asyncio
    async def test_find_all_success(self):
        # Arrange
        expected_users = [UserRetrieve(
            cod_user=UserCod(uuid4()),
            cod_ubi=UbicationCod(1),
            cod_state=CodState(1),
            username=Username("x"),
            email="x@x.com"
        ), UserRetrieve(
            cod_user=UserCod(uuid4()),
            cod_ubi=UbicationCod(1),
            cod_state=CodState(1),
            username=Username("x"),
            email="x@x.com"
        )]

        self.mock_user_repository.find_all = AsyncMock(
            return_value=expected_users)

        # Act
        result = await self.service.find_all()

        # Assert
        assert result == expected_users
        self.mock_user_repository.find_all.assert_called_once_with()

    @pytest.mark.asyncio
    async def test_find_all_empty(self):
        # Arrange
        self.mock_user_repository.find_all = AsyncMock(return_value=None)

        # Act & Assert
        with pytest.raises(AuthUserNotFoundError):
            await self.service.find_all()

    @pytest.mark.asyncio
    async def test_find_by_username_success(self):
        # Arrange
        username = "gokruzk"

        expected_user = UserRetrieve(
            cod_user=UserCod(value=uuid4()),
            cod_ubi=UbicationCod(value=1),
            cod_state=CodState(value=1),
            username=Username(value=username),
            email=str("x@x.com")
        )

        self.mock_user_repository.find_by_username = AsyncMock(
            return_value=expected_user)

        # Act
        result = await self.service.find_by_username(username)

        # Assert
        assert result == expected_user
        self.mock_user_repository.find_by_username.assert_called_once_with(
            username)

    @pytest.mark.asyncio
    async def test_find_by_username_empty(self):
        # Arrange
        username = "gokruzk"

        self.mock_user_repository.find_by_username = AsyncMock(
            return_value=None)

        # Act & Assert
        with pytest.raises(AuthUserNotFoundError):
            await self.service.find_by_username(username)

    @pytest.mark.asyncio
    async def test_update_success(self):
        # Arrange
        username = "gokruzk"

        # data
        data = RegisterUser(
            username=Username(username),
            cod_ubi=UbicationCod(1),
            cod_state=CodState(1),
            email="new@example.com",
            password="secret123"
        )

        # expected user after update
        expected_user = UserRetrieve(
            cod_user=UserCod(uuid4()),
            cod_ubi=UbicationCod(1),
            cod_state=CodState(1),
            username=Username(username),
            email="new@example.com"
        )

        # check if exist
        self.mock_user_repository.find_by_username = AsyncMock(
            return_value=expected_user)
        # then update
        self.mock_user_repository.update = AsyncMock(
            return_value=expected_user)

        # Act
        result = await self.service.update(data, username)

        # Assert
        assert result == expected_user
        self.mock_user_repository.find_by_username.assert_called_once_with(
            username)
        self.mock_user_repository.update.assert_called_once_with(
            data, username)

    @pytest.mark.asyncio
    async def test_delete_success(self):
        # Arrange
        username = "gokruzk"

        # expected user after update
        expected_user = UserRetrieve(
            cod_user=UserCod(uuid4()),
            cod_ubi=UbicationCod(1),
            cod_state=CodState(1),
            username=Username(username),
            email="new@example.com"
        )

        # check if exist
        self.mock_user_repository.find_by_username = AsyncMock(
            return_value=expected_user)
        # then update
        self.mock_user_repository.delete = AsyncMock(
            return_value=expected_user)

        # Act
        result = await self.service.delete(username)

        # Assert
        assert result == expected_user
        self.mock_user_repository.find_by_username.assert_called_once_with(
            username)
        self.mock_user_repository.delete.assert_called_once_with(username)
