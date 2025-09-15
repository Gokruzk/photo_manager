from uuid import UUID
from typing import List

from images.domain.entities import Image, UploadImage
from images.app.ports.image_repository import ImageRepository
from images.domain.exceptions import (
    ImageDeletedError,
    ImageNotFoundError,
    ImageUploadError,
)


class ImageService:
    def __init__(self, repository: ImageRepository):
        self.repository = repository

    async def find_by_user(self, cod_user: UUID) -> List[Image]:
        try:
            images = await self.repository.find_by_user(cod_user)

            if not images:
                raise ImageNotFoundError(f"No images found for user {cod_user}")

            return images

        except ImageNotFoundError:
            raise
        except Exception as e:
            raise ImageNotFoundError(
                f"Unexpected error fetching images for user {cod_user}"
            ) from e

    async def find_by_cod(self, cod_image: UUID) -> Image:
        try:
            image = await self.repository.find_by_cod(cod_image)

            if not image:
                raise ImageNotFoundError(f"The image with id {cod_image} not found")

            return image

        except ImageNotFoundError:
            raise
        except Exception as e:
            raise ImageNotFoundError(
                f"Unexpected error fetching image {cod_image}"
            ) from e

    async def upload(self, upload_image: UploadImage, content: bytes) -> Image:
        try:
            image = await self.repository.upload(upload_image, content)

            if not image:
                raise ImageUploadError(
                    f"Unexpected error uploading image for user {upload_image.cod_user}"
                )

            return image

        except ImageUploadError:
            raise
        except Exception as e:
            raise ImageUploadError(
                f"Unexpected error uploading image for user {upload_image.cod_user}"
            ) from e

    async def delete(self, cod_image: UUID) -> Image:
        try:
            await self.find_by_cod(cod_image)

            deleted_image = await self.repository.delete(cod_image)

            if not deleted_image:
                raise ImageDeletedError("Unexpected error deleting the image")

            return deleted_image

        except (ImageNotFoundError, ImageDeletedError):
            raise
        except Exception as e:
            raise ImageDeletedError(
                f"Unexpected error deleting image {cod_image}"
            ) from e
