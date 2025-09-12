from datetime import date
from dataclasses import dataclass

from auth.domain.value_objects.value_objects import CodState, DateCod, DateDescription, UbicationCod, UserCod, Username


@dataclass(frozen=True)
class State:
    cod_state: int
    state: str


@dataclass(frozen=True)
class Dates:
    cod_date: DateCod
    day: date


@dataclass(frozen=True)
class Description:
    cod_description: int
    description: DateDescription


@dataclass(frozen=True)
class UserRetrieve:
    cod_user: UserCod
    cod_ubi: UbicationCod
    cod_state: CodState
    username: Username
    email: str
