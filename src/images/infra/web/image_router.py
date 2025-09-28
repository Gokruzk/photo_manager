from datetime import datetime
import os
import logging
from uuid import UUID, uuid4
from pathlib import Path as pt
from images.app.use_cases.image_service import ImageService
from images.infra.database.mysql.models import ImagesModel
from images.infra.web.dependencies import get_image_repository
from images.infra.web.schemas import ResponseSchema
from fastapi import (
    APIRouter,
    Depends,
    Path,
    File,
    UploadFile,
    status,
    Form,
    HTTPException,
)
from images.domain.exceptions import (
    ImageDeletedError,
    ImageNotFoundError,
    ImageUploadError,
)
from images.utils.managers import SessionManager


router = APIRouter(prefix="/images", tags=["Images"])

logger = logging.getLogger(__name__)

# Folder to store images
home = pt.home()
images_folder = pt(home, "Images_Photo_Manager")
if not images_folder.exists():
    os.mkdir(images_folder)

ALLOWED_EXTENSIONS = ["jpeg", "jpg", "png", "webp"]
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.get(
    path="/{cod_user}",
    response_model=ResponseSchema,
    response_model_exclude_none=True,
    status_code=status.HTTP_200_OK,
)
async def find_by_user(
    cod_user: str = Path(..., alias="cod_user"),
    repository=Depends(get_image_repository),
    current_user=Depends(SessionManager.get_current_user),
) -> ResponseSchema:

    service = ImageService(repository)

    try:
        images = await service.find_by_user(cod_user)

    except ImageNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No images found for user {cod_user}",
        )
    except Exception as e:
        logger.exception("Unexpected error retrieving images for user %s", cod_user)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while retrieving images",
        )

    return ResponseSchema(detail="Images successfully retrieved", result=images)


@router.post(
    path="", response_model_exclude_none=True, status_code=status.HTTP_201_CREATED
)
async def upload(
    cod_user: UUID = Form(...),
    cod_ubi: int = Form(...),
    file: UploadFile = File(...),
    repository=Depends(get_image_repository),
    current_user=Depends(SessionManager.get_current_user),
) -> ResponseSchema:

    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension: .{ext}. Allowed: {ALLOWED_EXTENSIONS}",
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max size allowed is 5 MB",
        )
    # Reset file pointer
    file.file.seek(0)

    service = ImageService(repository)

    # Rename file
    file_type = file.content_type.split("/")[-1]
    new_filename = f"{uuid4()}.{file_type}"
    file.filename = new_filename

    image_path = pt(images_folder, file.filename)

    image_dto = ImagesModel(
        cod_image=uuid4(),
        cod_ubi=cod_ubi,
        cod_user=cod_user,
        image_path=str(image_path),
        uploaded_at=int(datetime.now().strftime("%Y%m%d")),
    )

    try:
        image = await service.upload(image_dto, contents)

    except ImageUploadError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to upload image"
        )

    except Exception as e:
        logger.exception("Unexpected error uploading image for user %s", image.cod_user)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while uploading the image",
        )

    return ResponseSchema(detail="Image successfully uploaded", result=image.image_path)


@router.delete(path="/{cod_image}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    cod_image: str = Path(..., alias="cod_image"),
    repository=Depends(get_image_repository),
    current_user=Depends(SessionManager.get_current_user),
) -> None:

    service = ImageService(repository)

    try:
        await service.delete(cod_image)

    except ImageNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Image with id {cod_image} does not exist",
        )

    except ImageDeletedError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to delete image due"
        )

    except Exception as e:
        logger.exception("Unexpected error deleting image %s", cod_image)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while deleting the image",
        )

    return None
