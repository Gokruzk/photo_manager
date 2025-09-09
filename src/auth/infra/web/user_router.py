import logging
from fastapi import APIRouter, Depends, Path, status, HTTPException

from auth.utils.managers import SessionManager
from auth.app.use_cases.user_service import UserService
from auth.infra.web.dependencies import get_user_repository
from auth.infra.web.schemas import CurrentUser, RegisterUser, ResponseSchema, TokenData
from auth.domain.entities.exceptions import AuthUserDeleteError, AuthUserNotFoundError, AuthUserUpdateError


router = APIRouter(
    prefix="/user",
    tags=["User"]
)

logger = logging.getLogger(__name__)


@router.get(
    path="",
    response_model=ResponseSchema,
    response_model_exclude_none=True,
    status_code=status.HTTP_200_OK
)
async def find_all(
    repository=Depends(get_user_repository),
    current_user: CurrentUser = Depends(SessionManager.get_current_user)
) -> ResponseSchema:

    service = UserService(repository)

    try:
        users = await service.find_all()

    except AuthUserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No users found"
        )
    except Exception as e:
        logger.exception(
            "Unexpected error retrieving users")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while retrieving users"
        )

    return ResponseSchema(detail="Users successfully retrieved", result=users)


@router.get(
    path="/{username}",
    response_model=ResponseSchema,
    response_model_exclude_none=True,
    status_code=status.HTTP_200_OK
)
async def find_by_username(
    username: str = Path(..., alias="username"),
    repository=Depends(get_user_repository),
    current_user: CurrentUser = Depends(SessionManager.get_current_user)
) -> ResponseSchema:

    service = UserService(repository)

    try:
        user = await service.find_by_username(username)

    except AuthUserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"The user {username} does not exist"
        )
    except Exception as e:
        logger.exception(
            "Unexpected error retrieving user")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while retrieving the user"
        )

    return ResponseSchema(detail="Users successfully retrieved", result=user)


@router.put(
    path="/{username}",
    status_code=status.HTTP_200_OK
)
async def update(
    data: RegisterUser,
    username: str = Path(..., alias="username"),
    repository=Depends(get_user_repository),
    current_user=Depends(SessionManager.get_current_user)
) -> ResponseSchema:

    service = UserService(repository)

    try:
        user = await service.update(data, username)

    except AuthUserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"The user {username} does not exist"
        )

    except AuthUserUpdateError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update the user {username}"
        )

    except Exception as e:
        logger.exception("Unexpected error updating user %s", username)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while updating the user"
        )

    return ResponseSchema(detail="Successfully updated", result=user)


@router.delete(
    path="/{username}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete(
    username: str = Path(..., alias="username"),
    repository=Depends(get_user_repository),
    # current_user=Depends(SessionManager.get_current_user)
) -> None:

    service = UserService(repository)

    try:
        await service.delete(username)

    except AuthUserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"The user {username} does not exist"
        )

    except AuthUserDeleteError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete user"
        )

    except Exception as e:
        logger.exception("Unexpected error deleting user %s", username)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while deleting the user"
        )

    return None
