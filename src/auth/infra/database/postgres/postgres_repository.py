from datetime import datetime
from typing import List

from auth.infra.factories.user_factory import UserFactory
from auth.infra.database.postgres.prisma_connection import PrismaConnection
from auth.domain.entities.exceptions import AuthLoginError, AuthUserNotFoundError
from auth.infra.web.schemas import AuthenticatedUser, RegisterUser, User, UserRetrieve


class PrismaUserRepository:
    def __init__(self, conn: PrismaConnection):
        self.conn = conn

    async def login(self, user_auth: User) -> AuthenticatedUser:
        from auth.utils.managers import PasswordManager
        user = await self.conn.prisma.user.find_first_or_raise(where={"username": user_auth["username"]}, include={"user_dates": True})

        if not user:
            raise AuthUserNotFoundError(
                f"The user {user_auth.username} does not exist")

        if not PasswordManager.verify_password(user_auth["password"], user.password):
            raise AuthLoginError("Password incorrect")

        user_factory = UserFactory.create_authenticated_user(user)
        return user_factory

    async def register(self, user_register: RegisterUser) -> AuthenticatedUser:

        user_factory = UserFactory.create(user_register)

        user = await self.conn.prisma.user.create(data=user_factory)

        # format date to YYYYMMDD
        formatted_date = user_register.birthdate.strftime('%Y%m%d')
        # parse to int
        birthday = int(formatted_date)
        # get current date
        formatted_date = datetime.now().strftime('%Y%m%d')
        # parse to int
        created_date = int(formatted_date)

        # created_date
        await self.conn.prisma.user_dates.create({
            "cod_date": created_date,
            "cod_user": user.cod_user,
            "cod_description": 1
        })
        # updated_date
        await self.conn.prisma.user_dates.create({
            "cod_date": created_date,
            "cod_user": user.cod_user,
            "cod_description": 2
        })
        # birthday
        await self.conn.prisma.user_dates.create({
            "cod_date": birthday,
            "cod_user": user.cod_user,
            "cod_description": 3
        })

        return user

    async def find_all(self) -> List[UserRetrieve]:
        users = await self.conn.prisma.user.find_many()

        return users

    async def find_by_username(self, username: str) -> UserRetrieve:
        user = await self.conn.prisma.user.find_first(where={"username": username})

        return user

    async def update(self, data: RegisterUser, username: str) -> UserRetrieve:
        user_factory = UserFactory.create(data)

        user = await self.conn.prisma.user.update(data=user_factory, where={"username": username})

        return user

    async def delete(self, username: str) -> UserRetrieve:
        user = await self.conn.prisma.user.delete(where={"username": username})

        return user
