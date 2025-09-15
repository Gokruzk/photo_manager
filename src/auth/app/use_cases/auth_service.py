from auth.app.ports.auth_repository import AuthRepository
from auth.app.ports.user_repository import UserRepository
from auth.domain.entities.auth import AuthenticatedUser, RegisterUser, User
from auth.domain.exceptions.exceptions import (
    AuthLoginError,
    AuthRegisterError,
    AuthUserNotFoundError,
)


class AuthService:
    def __init__(self, auth_repo: AuthRepository, user_repo: UserRepository):
        self.auth_repo = auth_repo
        self.user_repo = user_repo

    async def login(self, user_auth: User) -> AuthenticatedUser:
        try:
            user_found = await self.user_repo.find_by_username(user_auth.username)

            if not user_found:
                raise AuthUserNotFoundError(
                    f"The user {user_auth.username} does not exist"
                )

            user = await self.auth_repo.login(user_auth)

            if not user:
                raise AuthLoginError(
                    f"Unexpected error signing the user {user_auth.username}"
                )

            return user

        except (AuthUserNotFoundError, AuthLoginError):
            raise
        except Exception as e:
            raise AuthLoginError(
                f"Unexpected error signing the user {user_auth.username}"
            ) from e

    async def register(self, user_register: RegisterUser) -> AuthenticatedUser:
        try:
            user_found = await self.user_repo.find_by_username(user_register.username)

            if user_found:
                raise AuthRegisterError(
                    f"The user {user_register.username} already exists"
                )

            user = await self.auth_repo.register(user_register)

            if not user:
                raise AuthRegisterError(
                    f"Unexpected error registering the user {user_register.username}"
                )

            return user

        except AuthRegisterError:
            raise
        except Exception as e:
            raise AuthRegisterError(
                f"Unexpected error registering the user {user_register.username}"
            ) from e
