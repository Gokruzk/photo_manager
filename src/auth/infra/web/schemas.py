from dataclasses import dataclass
from datetime import date
from typing import Optional, TypeVar
from uuid import UUID
from pydantic import BaseModel

from auth.app.ports import AuthRepository, UserRepository

T = TypeVar("T")


class Base(BaseModel):

    class Config:
        from_attributes = True


class CurrentUser(Base):
    username: str


class User(CurrentUser):
    password: str


class RegisterUser(User):
    cod_ubi: int
    cod_state: int
    email: str
    birthdate: date


class UpdateUser(User):
    cod_ubi: int
    cod_state: int
    email: str
    birthdate: date


class UserRetrieve(Base):
    cod_user: UUID
    cod_ubi: int
    cod_state: int
    username: str
    email: str


class AuthenticatedUser(Base):
    cod_user: UUID
    cod_ubi: int
    cod_state: int
    username: str
    email: str


class Token(Base):
    access_token: str
    token_type: str


class TokenData(Base):
    username: str
    cod_user: UUID


@dataclass
class Repositories:
    user_repo: UserRepository
    auth_repo: AuthRepository


class ResponseSchema(Base):
    detail: str
    result: Optional[T] = None
