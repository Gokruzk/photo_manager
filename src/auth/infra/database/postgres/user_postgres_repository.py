from typing import List

from auth.infra.web.schemas import RegisterUser, UserRetrieve
from auth.infra.database.postgres.prisma_connection import PrismaManager
from auth.domain.exceptions import (
    AuthUserNotFoundError,
    AuthUserUpdateError,
    AuthUserDeleteError,
)


class PrismaUserRepository:
    def __init__(self, conn: PrismaManager):
        self.conn = conn

    async def find_all(self) -> List[UserRetrieve]:
        try:
            users = await self.conn.prisma.user.find_many()
            if not users:
                raise AuthUserNotFoundError("No users registered")
            return users
        except AuthUserNotFoundError:
            raise
        except Exception as e:
            raise AuthUserNotFoundError("Unexpected error fetching all users") from e

    async def find_by_username(self, username: str) -> UserRetrieve:
        try:
            user = await self.conn.prisma.user.find_first(where={"username": username})
            if not user:
                raise AuthUserNotFoundError(f"The user {username} does not exist")
            return user
        except AuthUserNotFoundError:
            raise
        except Exception as e:
            raise AuthUserNotFoundError(
                f"Unexpected error fetching user {username}"
            ) from e

    async def update(self, data: RegisterUser, username: str) -> UserRetrieve:
        try:
            user = await self.conn.prisma.user.update(
                data={
                    "cod_ubi": int(data.cod_ubi),
                    "cod_state": int(data.cod_state),
                    "username": str(data.username),
                    "email": str(data.email),
                    "password": str(data.password),
                },
                where={"username": username},
            )
            if not user:
                raise AuthUserUpdateError(f"Error updating the user {username}")
            return user
        except AuthUserUpdateError:
            raise
        except Exception as e:
            raise AuthUserUpdateError(
                f"Unexpected error updating user {username}"
            ) from e

    async def delete(self, username: str) -> UserRetrieve:
        try:
            user = await self.conn.prisma.user.delete(where={"username": username})
            if not user:
                raise AuthUserDeleteError(f"Error deleting the user {username}")
            return user
        except AuthUserDeleteError:
            raise
        except Exception as e:
            raise AuthUserDeleteError(
                f"Unexpected error deleting user {username}"
            ) from e
