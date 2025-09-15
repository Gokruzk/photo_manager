from datetime import datetime

from auth.infra.web.schemas import AuthenticatedUser, RegisterUser, User
from auth.infra.database.postgres.prisma_connection import PrismaManager
from auth.domain.exceptions import (
    AuthLoginError,
    AuthUserNotFoundError,
    AuthRegisterError,
)


class PrismaAuthRepository:
    def __init__(self, conn: PrismaManager):
        self.conn = conn

    async def login(self, user_auth: User) -> AuthenticatedUser:
        from auth.utils.managers import PasswordManager

        try:
            user = await self.conn.prisma.user.find_first_or_raise(
                where={"username": user_auth.username}, include={"user_dates": True}
            )
        except Exception as e:
            raise AuthUserNotFoundError(
                f"The user {user_auth.username} does not exist"
            ) from e

        if not PasswordManager.verify_password(user_auth.password, user.password):
            raise AuthLoginError("Password incorrect")

        return user

    async def register(self, user_register: RegisterUser) -> AuthenticatedUser:
        from auth.utils.managers import PasswordManager

        try:
            user = await self.conn.prisma.user.create(
                data={
                    "cod_ubi": int(user_register.cod_ubi),
                    "cod_state": int(user_register.cod_state),
                    "username": str(user_register.username),
                    "email": str(user_register.email),
                    "password": PasswordManager.hash_password(user_register.password),
                }
            )
        except Exception as e:
            raise AuthRegisterError(
                f"Unexpected error registering the user {user_register.username}"
            ) from e

        # dates: birtday and created/updated timestamps
        birthday = int(user_register.birthdate.strftime("%Y%m%d"))
        created_date = int(datetime.now().strftime("%Y%m%d"))

        try:
            # created_date
            await self.conn.prisma.user_dates.create(
                {
                    "cod_date": created_date,
                    "cod_user": user.cod_user,
                    "cod_description": 1,
                }
            )
            # updated_date
            await self.conn.prisma.user_dates.create(
                {
                    "cod_date": created_date,
                    "cod_user": user.cod_user,
                    "cod_description": 2,
                }
            )
            # Birthday
            await self.conn.prisma.user_dates.create(
                {"cod_date": birthday, "cod_user": user.cod_user, "cod_description": 3}
            )
        except Exception as e:
            raise AuthRegisterError(
                f"Unexpected error saving user dates for {user_register.username}"
            ) from e

        return user
