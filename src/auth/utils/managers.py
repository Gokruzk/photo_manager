import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException

from auth.app.use_cases.user_service import UserService
from auth.domain.entities.exceptions import AuthUserNotFoundError
from auth.infra.web.dependencies import get_user_repository
from auth.infra.web.schemas import CurrentUser, ResponseSchema, TokenData
from config.config import JWTConfig

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class PasswordManager:
    """
    Class to manage passwords
    """
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)


class TokenManager:
    """
    Class to manage tokens
    """
    @staticmethod
    def create_access_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.now().isoformat()

        to_encode.update({"exp": expire})

        encoded_jwt = jwt.encode(
            to_encode,
            JWTConfig.secret_key(),
            algorithm=JWTConfig.alogrithm()
        )
        return encoded_jwt

    @staticmethod
    def decode_token(token: str) -> dict:
        try:
            return jwt.decode(
                token,
                JWTConfig.secret_key(),
                algorithms=[JWTConfig.alogrithm()]
            )
        except jwt.ExpiredSignatureError:
            return ResponseSchema(detail="Token expired")
        except jwt.InvalidTokenError:
            return ResponseSchema(detail="Invalid token")

    @classmethod
    def verify_token(cls, token: str = Depends(oauth2_scheme)) -> TokenData:
        try:
            payload = cls.decode_token(token)
            username: str = payload.get("username")
            cod_user: str = payload.get("cod_user")
            exp: int = payload.get("exp")

            if exp < datetime.now():
                return ResponseSchema.error(detail="Token expired")

            return TokenData(username=username, cod_user=cod_user)
        except Exception as e:
            return ResponseSchema(detail="Unauthorized")


class SessionManager:
    """
    Class to manage sessions and roles
    """
    @staticmethod
    async def get_current_user(
        token: str = Depends(oauth2_scheme),
        user_service: UserService = Depends(get_user_repository)
    ) -> CurrentUser:
        token_data = TokenManager.verify_token(token)
        user = await user_service.find_by_username(token_data.username)

        if not user:
            raise AuthUserNotFoundError("User not found")

        return CurrentUser(username=user.username)
