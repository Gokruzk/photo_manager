from auth.app.ports.user_repository import UserRepository
from auth.infra.database.postgres.auth_postgres_repository import PrismaAuthRepository
from auth.infra.database.postgres.prisma_connection import PrismaManager
from auth.infra.database.postgres.user_postgres_repository import PrismaUserRepository
from auth.infra.web.schemas import Repositories
from config.config import DBConfig


async def get_postgres_connection() -> PrismaManager:
    conn = PrismaManager()
    await conn.connect()
    return conn


async def close_postgres_connection(conn: PrismaManager):
    await conn.disconnect()


async def get_mysql_connection():
    """sqlalchemy async connection with mysql"""
    pass


async def get_user_repository() -> Repositories:
    db_type = DBConfig.db()

    if db_type == "postgres":
        conn = await get_postgres_connection()
        return Repositories(
            user_repo=PrismaUserRepository(conn), auth_repo=PrismaAuthRepository(conn)
        )
    elif db_type == "mysql":
        # Implementa MySQL aquí
        pass
    else:
        raise ValueError(f"Unsupported database type: {db_type}")
