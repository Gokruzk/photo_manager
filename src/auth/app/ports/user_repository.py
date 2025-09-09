from typing import List
from abc import ABC, abstractmethod

from auth.domain.entities.auth import RegisterUser
from auth.domain.entities.user import UserRetrieve


class UserRepository(ABC):
    @abstractmethod
    async def find_all(self) -> List[UserRetrieve]:
        pass

    @abstractmethod
    async def find_by_username(self, username: str) -> UserRetrieve:
        pass

    @abstractmethod
    async def update(self, data: RegisterUser, username: str) -> UserRetrieve:
        pass

    @abstractmethod
    async def delete(self, username: str):
        pass
