from typing import List

from auth.domain.entities.auth import RegisterUser
from auth.domain.entities.user import UserRetrieve
from auth.app.ports.user_repository import UserRepository
from auth.domain.exceptions.exceptions import (
    AuthBaseError,
    AuthUserDeleteError,
    AuthUserNotFoundError,
    AuthUserUpdateError,
)


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def find_all(self) -> List[UserRetrieve]:
        try:
            users = await self.user_repo.find_all()
            
            if not users:
                raise AuthUserNotFoundError("No users registered")
            
            return users
        
        except AuthUserNotFoundError:
            raise
        except Exception as e:
            raise AuthBaseError("Unexpected error fetching all users") from e

    async def find_by_username(self, username: str) -> UserRetrieve:
        try:
            user = await self.user_repo.find_by_username(username)
            
            if not user:
                raise AuthUserNotFoundError(f"The user {username} does not exist")
            
            return user
        
        except AuthUserNotFoundError:
            raise
        except Exception as e:
            raise AuthBaseError("Unexpected error fetching all users") from e

    async def update(self, data: RegisterUser, username: str) -> UserRetrieve:
        try:
            existing = await self.user_repo.find_by_username(username)
            
            if not existing:
                raise AuthUserNotFoundError(f"The user {username} does not exist")

            user = await self.user_repo.update(data, username)
            
            if not user:
                raise AuthUserUpdateError(f"Error updating the user {username}")
            
            return user
        
        except AuthUserNotFoundError:
            raise
        except Exception as e:
            raise AuthBaseError("Unexpected error fetching all users") from e

    async def delete(self, username: str) -> UserRetrieve:
        try:
            existing = await self.user_repo.find_by_username(username)
            
            if not existing:
                raise AuthUserNotFoundError(f"The user {username} does not exist")

            user = await self.user_repo.delete(username)
            
            if not user:
                raise AuthUserDeleteError(f"Error deleting the user {username}")
            
            return user
        
        except AuthUserNotFoundError:
            raise
        except Exception as e:
            raise AuthBaseError("Unexpected error fetching all users") from e
