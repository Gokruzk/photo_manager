from uuid import UUID
from dataclasses import dataclass


@dataclass(frozen=True)
class Username:
    value: str

    def __post_init__(self):
        if not (1 <= len(self.value) <= 15):
            raise ValueError("Username length must be between 1 and 15")

    def __str__(self) -> str:
        return self.value


@dataclass(frozen=True)
class UbicationCod:
    value: int

    def __post_init__(self):
        if self.value <= 0:
            raise ValueError("UbicationCod must be greater than 0")

    def __str__(self) -> str:
        return str(self.value)


@dataclass(frozen=True)
class CodState:
    value: int

    def __post_init__(self):
        if not (1 <= self.value <= 2):
            raise ValueError("CodState must be between 1 and 2")

    def __str__(self) -> str:
        return str(self.value)


@dataclass(frozen=True)
class UserCod:
    value: UUID

    def __str__(self) -> str:
        return str(self.value)


@dataclass(frozen=True)
class DateCod:
    value: int

    def __post_init__(self):
        if not (20000100 < self.value < 21001232):
            raise ValueError("DateCod must be a valid date in yyyymmdd format")

    def __str__(self) -> str:
        return str(self.value)


@dataclass(frozen=True)
class YearValue:
    value: int

    def __post_init__(self):
        if not (2000 <= self.value <= 2100):
            raise ValueError("YearValue must be between 2000 and 2100")

    def __str__(self) -> str:
        return str(self.value)


@dataclass(frozen=True)
class MonthValue:
    value: int

    def __post_init__(self):
        if not (1 <= self.value <= 12):
            raise ValueError("MonthValue must be between 1 and 12")

    def __str__(self) -> str:
        return str(self.value)


@dataclass(frozen=True)
class DateCod:
    value: int

    def __post_init__(self):
        if not (20000100 < self.value < 21001232):
            raise ValueError("DateCod must be a valid date in yyyymmdd format")

    def __str__(self) -> str:
        return str(self.value)

@dataclass(frozen=True)
class DateDescription:
    value: str

    def __post_init__(self):
        if not (1 <= len(self.value) <= 8):
            raise ValueError("The date description length must be between 1 and 8")

    def __str__(self) -> str:
        return self.value
