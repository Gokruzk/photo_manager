from os import getenv
from dotenv import load_dotenv

load_dotenv()


class ServerConfig:
    @staticmethod
    def port() -> int:
        return int(getenv("PORT") or 8000)

    @staticmethod
    def environment() -> str:
        return getenv("ENVIRONMENT") or "production"

    @staticmethod
    def front_uri() -> str:
        return getenv("FRONT_URI") or ""

    @staticmethod
    def redirect_uri() -> str:
        return getenv("REDIRECT_URI") or ""


class DBConfig:
    @staticmethod
    def db() -> str:
        return getenv("DB_TYPE")

    @staticmethod
    def mysql_auth_url() -> str:
        return getenv("MYSQL_AUTH_URL")

    @staticmethod
    def mysql_images_url() -> str:
        return getenv("MYSQL_IMAGES_URL")

    @staticmethod
    def postgres_auth_url() -> str:
        return getenv("POSTGRES_AUTH_URL")

    @staticmethod
    def postgres_images_url() -> str:
        return getenv("POSTGRES_IMAGES_URL")


class JWTConfig:
    @staticmethod
    def alogrithm() -> str:
        return getenv("ALGORITHM") or "HS256"

    @staticmethod
    def secret_key() -> str:
        return getenv("SECRET_KEY") or ""

    @staticmethod
    def token_expire() -> int:
        return int(getenv("ACCESS_TOKEN_EXPIRE_MINUTES") or 120)


class JWTConfig:
    @staticmethod
    def alogrithm() -> str:
        return getenv("ALGORITHM") or "HS256"

    @staticmethod
    def secret_key() -> str:
        return getenv("SECRET_KEY") or ""

    @staticmethod
    def token_expire() -> int:
        return int(getenv("ACCESS_TOKEN_EXPIRE_MINUTES") or 120)
