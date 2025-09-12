from datetime import date
from dataclasses import dataclass

from auth.domain.value_objects.value_objects import CodState, UbicationCod, UserCod, Username


@dataclass(frozen=True)
class User:
    username: Username
    password: str


@dataclass(frozen=True)
class RegisterUser(User):
    cod_ubi: UbicationCod
    cod_state: CodState
    email: str


@dataclass(frozen=True)
class AuthenticatedUser:
    cod_user: UserCod
    cod_ubi: UbicationCod
    cod_state: CodState
    username: Username
    email: str


@dataclass(frozen=True)
class AuthDetails:
    token: str
    user: AuthenticatedUser
