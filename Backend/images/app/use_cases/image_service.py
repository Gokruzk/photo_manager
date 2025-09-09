from uuid import UUID
from typing import List

from images.domain.entities import Image, UploadImage
from images.app.ports.image_repository import ImageRepository
from images.domain.exceptions import ImageDeletedError, ImageNotFoundError, ImageUploadError


class ImageService:
    def __init__(self, repository: ImageRepository):
        self.repository = repository

    async def find_by_user(self, cod_user: UUID) -> List[Image]:
        images = await self.repository.find_by_user(cod_user)

        if not images:
            raise ImageNotFoundError(
                f"No images found for user {cod_user}")

        return images

    async def find_by_cod(self, cod_image: UUID) -> Image:
        image = await self.repository.find_by_cod(cod_image)

        if not image:
            raise ImageNotFoundError(
                f"The image with id {cod_image} not found")

        return image

    async def upload(self, upload_image: UploadImage, content: bytes) -> Image:
        image = await self.repository.upload(upload_image, content)

        if not image:
            raise ImageUploadError(
                f"Unexpected error uploading image for user {upload_image.cod_user}")

        return image

    async def delete(self, cod_image: UUID) -> Image:
        check_image = await self.find_by_cod(cod_image)

        if check_image:
            image = await self.repository.delete(cod_image)

            if not image:
                raise ImageDeletedError(
                    f"Unexpected error deleting the image")
        else:
            raise ImageNotFoundError(
                f"The image with id {cod_image} not found")

        return image
