from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from auth.infra.web.schemas import AuthenticatedUser, RegisterUser, User
from auth.domain.exceptions import (
    AuthLoginError,
    AuthUserNotFoundError,
    AuthRegisterError,
)

from auth.infra.database.mysql.models import UsersModel, User_Dates
from auth.infra.factories.user_factory import UserFactory


class SQLAlchemyAuthRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def login(self, user_auth: User) -> AuthenticatedUser:
        from auth.utils.managers import PasswordManager

        try:
            user = self.db.execute(select(UsersModel).where(
                UsersModel.username == user_auth.username))

            if not user:
                raise AuthUserNotFoundError(
                    f"The user {user_auth.username} does not exist"
                )

        except Exception as e:
            pass

        if not PasswordManager.verify_password(user_auth.password,
                                               user.password):
            raise AuthLoginError("Password incorrect")

        return AuthenticatedUser.model_validate(user)

    async def register(self, user_register: RegisterUser) -> AuthenticatedUser:
        try:
            dto = UserFactory.create_from_dto(user_register)

            self.db.add(dto)
            await self.db.commit()
            await self.db.refresh(dto)

            return user_register

        except Exception as e:
            raise AuthRegisterError(
                f"Unexpected error registering the user {
                    user_register.username}"
            ) from e

        # dates: birthday and created/updated timestamps
        birthday = int(user_register.birthdate.strftime("%Y%m%d"))
        created_date = int(datetime.now().strftime("%Y%m%d"))

        # try:
        # created_date
        # cdate = User_Dates(
        #    cod_date=created_date,
        #  cod_user=dto.cod_user,
        # cod_description=1
        #       )
        #     self.db.add(cdate)
        #   await self.db.commit()
        # await self.db.refresh()

        # updated_date
        #       udate = User_Dates(
        #         cod_date=created_date,
        #       cod_user=dto.cod_user,
        #     cod_description=2
        #     )
        # self.db.add(udate)
        #       await self.db.commit()
        #         await self.db.refresh()

        # Birthday
        #           bdate = User_Dates(
        #     cod_date = birthday,
        #   cod_user = dto.cod_user,
        # cod_description = 3
        #       )

        #           self.db.add(bdate)
        #         await self.db.commit()
        #       await self.db.refresh()

        #           except Exception as e:
        #         raise AuthRegisterError(
        #   f"Unexpected error saving user dates for {
        #     user_register.username}"
        #       ) from e
