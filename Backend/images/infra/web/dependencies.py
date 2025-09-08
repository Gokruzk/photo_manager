from config.config import DBConfig
from images.app.ports.image_repository import ImageRepository
from images.infra.database.postgres.postgres_connection import PrismaConnection
from images.infra.database.postgres.postgres_repository import PrismaImageRepository


async def get_postgres_connection() -> PrismaConnection:
    conn = PrismaConnection()
    await conn.connect()
    return conn


async def close_postgres_connection(conn: PrismaConnection):
    await conn.disconnect()


async def get_mysql_connection():
    """sqlalchemy async connection with mysql"""
    pass


async def get_mongo_connection():
    """async connection with mongodb"""
    pass


async def get_image_repository() -> ImageRepository:
    db_type = DBConfig.db()

    if db_type == "postgres":
        conn = await get_postgres_connection()
        return PrismaImageRepository(conn)
    elif db_type == "mysql":
        # Implementa MySQL aquí
        pass
    elif db_type == "mongodb":
        # Implementa Mongo aquí
        pass
    else:
        raise ValueError(f"Unsupported database type: {db_type}")
