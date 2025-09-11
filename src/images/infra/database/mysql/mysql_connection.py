from sqlalchemy import text
from colorama import Fore, Style
from typing import AsyncGenerator
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from config.config import DBConfig


class Base(AsyncAttrs, DeclarativeBase):
    """
    Declarative Base class for defining SQLAlchemy ORM models.
    All database models should inherit from this class.
    """
    pass


class SQLAlchemyConnection:
    """
    Handles asynchronous connection management to a database
    using SQLAlchemy AsyncIO engine and sessions.
    """

    def __init__(self):
        self.db_url = (DBConfig.mysql_url())

        # Create async engine for database communication
        self.engine = create_async_engine(
            self.db_url,
            echo=False,
            future=True
        )

        # Create session factory bound to the engine
        self.async_session = async_sessionmaker(
            bind=self.engine,
            class_=AsyncSession,
            expire_on_commit=False
        )

    async def test_db_connection(self):
        """
        Executes a simple SELECT statement to verify
        that the database connection is working.
        """
        try:
            async with self.async_session as session:
                await session.execute(text("SELECT 1"))
                print(
                    f"\n{Fore.GREEN}INFO:{Style.RESET_ALL} "
                    f"    Test DB connection successfully\n"
                )
        except Exception as e:
            print(
                f"\n{Fore.RED}ERROR:{Style.RESET_ALL} "
                f"Test DB connection failed: {e}\n"
            )
        finally:
            await self.engine.dispose()

    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        """
        Provides an asynchronous SQLAlchemy session.

        Usage:
            Used mainly for dependency injection in API endpoints
            (e.g., FastAPI `Depends`) to interact with the database.
        """
        async with self.async_session as session:
            try:
                yield session
            except:
                await session.rollback()
                raise
