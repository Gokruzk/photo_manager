from typing import List

from auth.infra.web.schemas import RegisterUser, UserRetrieve
from auth.infra.database.postgres.prisma_connection import PrismaManager


class PrismaUserRepository:
    def __init__(self, conn: PrismaManager):
        self.conn = conn

    async def find_all(self) -> List[UserRetrieve]:
        users = await self.conn.prisma.user.find_many()

        return users

    async def find_by_username(self, username: str) -> UserRetrieve:
        user = await self.conn.prisma.user.find_first(where={"username": username})

        return user

    async def update(self, data: RegisterUser, username: str) -> UserRetrieve:
        # user_factory = UserFactory.create(data)

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

        return user

    async def delete(self, username: str) -> UserRetrieve:
        user = await self.conn.prisma.user.delete(where={"username": username})

        return user
