from auth.app.ports.user_repository import UserRepository
from auth.infra.database.postgres.prisma_connection import PrismaConnection
from auth.infra.database.postgres.postgres_repository import PrismaUserRepository
from config.config import DBConfig


async def get_postgres_connection() -> PrismaConnection:
    conn = PrismaConnection()
    await conn.connect()
    return conn


async def close_postgres_connection(conn: PrismaConnection):
    await conn.disconnect()


async def get_mysql_connection():
    """sqlalchemy async connection with mysql"""
    pass


async def get_user_repository() -> UserRepository:
    db_type = DBConfig.db()

    if db_type == "postgres":
        conn = await get_postgres_connection()
        return PrismaUserRepository(conn)
    elif db_type == "mysql":
        # Implementa MySQL aquí
        pass
    else:
        raise ValueError(f"Unsupported database type: {db_type}")
