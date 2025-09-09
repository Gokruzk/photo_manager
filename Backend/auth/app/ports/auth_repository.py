from abc import ABC, abstractmethod

from auth.domain.entities.auth import AuthenticatedUser, RegisterUser, User


class AuthRepository(ABC):
    @abstractmethod
    async def login(self, user_auth: User) -> AuthenticatedUser:
        pass

    @abstractmethod
    async def register(self, user_register: RegisterUser) -> AuthenticatedUser:
        pass
