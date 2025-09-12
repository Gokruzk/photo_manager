import logging
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, status, HTTPException

from auth.utils.managers import TokenManager
from auth.app.use_cases.auth_service import AuthService
from auth.infra.web.dependencies import get_user_repository
from auth.infra.web.schemas import RegisterUser, Repositories, Token, User
from auth.domain.exceptions.exceptions import (
    AuthLoginError,
    AuthRegisterError,
    AuthUserNotFoundError,
)


router = APIRouter(prefix="/auth", tags=["Authentication"])

logger = logging.getLogger(__name__)


@router.post(path="/login", response_model=Token, status_code=status.HTTP_200_OK)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    repositories: Repositories = Depends(get_user_repository),
) -> Token:
    user_repo = repositories.user_repo
    auth_repo = repositories.auth_repo

    service = AuthService(auth_repo, user_repo)

    try:
        user = await service.login(
            User(username=form_data.username, password=form_data.password)
        )

    except AuthUserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"The user {form_data.username} does not exist",
        )
    except AuthLoginError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error siging the user {form_data.username}",
        )
    except Exception as e:
        logger.exception("Unexpected singing the user")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred signing the user",
        )
    access_token = TokenManager.create_access_token(
        {"username": user.username, "cod_user": str(user.cod_user)}
    )

    return Token(access_token=access_token, token_type="bearer")


@router.post(path="", status_code=status.HTTP_201_CREATED)
async def register(
    data: RegisterUser, repositories: Repositories = Depends(get_user_repository)
) -> Token:

    user_repo = repositories.user_repo
    auth_repo = repositories.auth_repo

    service = AuthService(auth_repo, user_repo)
    try:
        user = await service.register(
            RegisterUser(
                username=data.username,
                password=data.password,
                cod_ubi=data.cod_ubi,
                cod_state=data.cod_state,
                email=data.email,
                birthdate=data.birthdate,
            )
        )

    except AuthRegisterError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to register the user {data.username}",
        )

    except Exception as e:
        logger.exception("Unexpected error registering user %s", data.username)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while registering the user",
        )

    access_token = TokenManager.create_access_token(
        {"username": user.username, "cod_user": user.cod_user}
    )

    return Token(access_token=access_token, token_type="bearer")
