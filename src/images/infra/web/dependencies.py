from config.config import DBConfig
from images.app.ports.image_repository import ImageRepository
from images.infra.database.mysql.mysql_connection import SQLAlchemyManager
from images.infra.database.mysql.mysql_repository import SQLAlchemyRepository
from images.infra.database.postgres.prisma_connection import PrismaManager
from images.infra.database.postgres.postgres_repository import PrismaImageRepository


async def get_postgres_connection() -> PrismaManager:
    conn = PrismaManager()
    await conn.connect()
    return conn


async def close_postgres_connection(conn: PrismaManager):
    await conn.disconnect()


async def get_mysql_connection():
    conn = SQLAlchemyManager()
    return conn


async def get_image_repository() -> ImageRepository:
    db_type = DBConfig.db()

    if db_type == "postgres":
        conn = await get_postgres_connection()
        repo = PrismaImageRepository(conn)
        return repo
    elif db_type == "mysql":
        conn = await get_mysql_connection()
        repo = SQLAlchemyRepository(await conn.create_session())
        return repo
    else:
        raise ValueError(f"Unsupported database type: {db_type}")
