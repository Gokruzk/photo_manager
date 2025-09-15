import pytest
from uuid import uuid4
from unittest.mock import AsyncMock

from auth.domain.entities.user import UserRetrieve
from auth.domain.entities.auth import RegisterUser
from auth.app.use_cases.user_service import UserService
from auth.domain.exceptions.exceptions import AuthUserNotFoundError
from auth.domain.value_objects.value_objects import (
    CodState,
    UbicationCod,
    UserCod,
    Username,
)


@pytest.mark.usefixtures("mock_user_repository")
class TestUserService:
    @pytest.fixture(autouse=True)
    def setup_service(self, mock_user_repository):
        self.mock_user_repository = mock_user_repository
        self.service = UserService(mock_user_repository)

    @pytest.mark.asyncio
    async def test_find_all_returns_users_when_exist(self):
        expected_users = [
            UserRetrieve(
                cod_user=UserCod(uuid4()),
                cod_ubi=UbicationCod(1),
                cod_state=CodState(1),
                username=Username("x"),
                email="x@x.com",
            ),
            UserRetrieve(
                cod_user=UserCod(uuid4()),
                cod_ubi=UbicationCod(1),
                cod_state=CodState(1),
                username=Username("y"),
                email="y@y.com",
            ),
        ]
        self.mock_user_repository.find_all = AsyncMock(return_value=expected_users)

        result = await self.service.find_all()

        assert result == expected_users
        self.mock_user_repository.find_all.assert_called_once_with()

    @pytest.mark.asyncio
    async def test_find_all_raises_error_when_no_users(self):
        self.mock_user_repository.find_all = AsyncMock(return_value=None)

        with pytest.raises(AuthUserNotFoundError, match="No users registered"):
            await self.service.find_all()

    @pytest.mark.asyncio
    async def test_find_by_username_returns_user_when_exists(self):
        username = "gokruzk"
        expected_user = UserRetrieve(
            cod_user=UserCod(uuid4()),
            cod_ubi=UbicationCod(1),
            cod_state=CodState(1),
            username=Username(username),
            email="x@x.com",
        )
        self.mock_user_repository.find_by_username = AsyncMock(
            return_value=expected_user
        )

        result = await self.service.find_by_username(username)

        assert result == expected_user
        self.mock_user_repository.find_by_username.assert_called_once_with(username)

    @pytest.mark.asyncio
    async def test_find_by_username_raises_error_when_not_exists(self):
        username = "unknown"
        self.mock_user_repository.find_by_username = AsyncMock(return_value=None)

        with pytest.raises(
            AuthUserNotFoundError, match=f"The user {username} does not exist"
        ):
            await self.service.find_by_username(username)

    @pytest.mark.asyncio
    async def test_update_user_successfully_when_user_exists(self):
        username = "gokruzk"
        data = RegisterUser(
            username=Username(username),
            cod_ubi=UbicationCod(1),
            cod_state=CodState(1),
            email="new@example.com",
            password="secret123",
        )
        expected_user = UserRetrieve(
            cod_user=UserCod(uuid4()),
            cod_ubi=UbicationCod(1),
            cod_state=CodState(1),
            username=Username(username),
            email="new@example.com",
        )
        self.mock_user_repository.find_by_username = AsyncMock(
            return_value=expected_user
        )
        self.mock_user_repository.update = AsyncMock(return_value=expected_user)

        result = await self.service.update(data, username)

        assert result == expected_user
        self.mock_user_repository.find_by_username.assert_called_once_with(username)
        self.mock_user_repository.update.assert_called_once_with(data, username)

    @pytest.mark.asyncio
    async def test_update_raises_error_when_user_not_exists(self):
        username = "unknown"
        data = RegisterUser(
            username=Username(username),
            cod_ubi=UbicationCod(1),
            cod_state=CodState(1),
            email="new@example.com",
            password="secret123",
        )
        self.mock_user_repository.find_by_username = AsyncMock(return_value=None)

        with pytest.raises(
            AuthUserNotFoundError, match=f"The user {username} does not exist"
        ):
            await self.service.update(data, username)

    @pytest.mark.asyncio
    async def test_delete_user_successfully_when_user_exists(self):
        username = "gokruzk"
        expected_user = UserRetrieve(
            cod_user=UserCod(uuid4()),
            cod_ubi=UbicationCod(1),
            cod_state=CodState(1),
            username=Username(username),
            email="new@example.com",
        )
        self.mock_user_repository.find_by_username = AsyncMock(
            return_value=expected_user
        )
        self.mock_user_repository.delete = AsyncMock(return_value=expected_user)

        result = await self.service.delete(username)

        assert result == expected_user
        self.mock_user_repository.find_by_username.assert_called_once_with(username)
        self.mock_user_repository.delete.assert_called_once_with(username)

    @pytest.mark.asyncio
    async def test_delete_raises_error_when_user_not_exists(self):
        username = "unknown"
        self.mock_user_repository.find_by_username = AsyncMock(return_value=None)

        with pytest.raises(
            AuthUserNotFoundError, match=f"The user {username} does not exist"
        ):
            await self.service.delete(username)
