from auth.infra.database.mysql.mysql_connection import SQLAlchemyManager
from auth.infra.database.mysql.auth_mysql_repository import SQLAlchemyAuthRepository
from auth.infra.database.mysql.user_mysql_repository import SQLAlchemyUserRepository
from auth.infra.database.postgres.auth_postgres_repository import PrismaAuthRepository
from auth.infra.database.postgres.user_postgres_repository import PrismaUserRepository
from auth.infra.web.schemas import Repositories
from config.config import DBConfig
from auth.infra.database.postgres.prisma_connection import PrismaManager
from contextlib import asynccontextmanager


async def get_postgres_connection() -> PrismaManager:
    conn = PrismaManager()
    await conn.connect()
    return conn


async def close_postgres_connection(conn: PrismaManager):
    await conn.disconnect()


async def get_mysql_connection():
    conn = SQLAlchemyManager()
    return conn


async def get_user_repositories():
    db_type = DBConfig.db()

    if db_type == "postgres":
        conn = await get_postgres_connection()
        return Repositories(
            user_repo=PrismaUserRepository(conn),
            auth_repo=PrismaAuthRepository(conn),
        )

    elif db_type == "mysql":
        conn = await get_mysql_connection()
        session = await conn.create_session()
        return Repositories(
            user_repo=SQLAlchemyUserRepository(session),
            auth_repo=SQLAlchemyAuthRepository(session),
        )
    else:
        raise ValueError(f"Unsupported database type: {db_type}")
