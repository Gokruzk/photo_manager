from datetime import datetime

from auth.infra.web.schemas import AuthenticatedUser, RegisterUser, User
from auth.infra.database.postgres.prisma_connection import PrismaManager
from auth.domain.exceptions import AuthLoginError, AuthUserNotFoundError


class PrismaAuthRepository:
    def __init__(self, conn: PrismaManager):
        self.conn = conn

    async def login(self, user_auth: User) -> AuthenticatedUser:
        from auth.utils.managers import PasswordManager

        user = await self.conn.prisma.user.find_first_or_raise(
            where={"username": user_auth.username}, include={"user_dates": True}
        )

        if not user:
            raise AuthUserNotFoundError(f"The user {user_auth.username} does not exist")

        if not PasswordManager.verify_password(user_auth.password, user.password):
            raise AuthLoginError("Password incorrect")

        return user

    async def register(self, user_register: RegisterUser) -> AuthenticatedUser:

        user = await self.conn.prisma.user.create(
            data={
                "cod_ubi": int(user_register.cod_ubi),
                "cod_state": int(user_register.cod_state),
                "username": str(user_register.username),
                "email": str(user_register.email),
            }
        )

        # format date to YYYYMMDD
        formatted_date = user_register.birthdate.strftime("%Y%m%d")
        # parse to int
        birthday = int(formatted_date)
        # get current date
        formatted_date = datetime.now().strftime("%Y%m%d")
        # parse to int
        created_date = int(formatted_date)

        # created_date
        await self.conn.prisma.user_dates.create(
            {"cod_date": created_date, "cod_user": user.cod_user, "cod_description": 1}
        )
        # updated_date
        await self.conn.prisma.user_dates.create(
            {"cod_date": created_date, "cod_user": user.cod_user, "cod_description": 2}
        )
        # birthday
        await self.conn.prisma.user_dates.create(
            {"cod_date": birthday, "cod_user": user.cod_user, "cod_description": 3}
        )

        return user
