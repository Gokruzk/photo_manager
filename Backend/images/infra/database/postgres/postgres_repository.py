import os
from uuid import UUID
from typing import List
from pathlib import Path
from datetime import datetime
from images.domain.entities import Image, UploadImage
from images.app.ports.image_repository import ImageRepository
from images.domain.exceptions import ImageNotFoundError, ImageUploadError
from images.infra.database.postgres.postgres_connection import PrismaConnection

# directory for images
home = Path.home()
images_folder = Path(home, "Images_Photo_Manager")


class PrismaImageRepository(ImageRepository):
    def __init__(self, conn: PrismaConnection):
        self.conn = conn

    async def find_by_user(self, cod_user: UUID) -> List[Image]:
        images = await self.conn.prisma.images.find_many(where={"cod_user": cod_user})
        return images

    async def find_by_cod(self, cod_image: UUID) -> Image:
        image = await self.conn.prisma.images.find_first(
            where={"cod_image": cod_image})
        if not image:
            raise ImageNotFoundError(f"Image with id {cod_image} not found")
        return image

    async def upload(self, image: UploadImage, filename: str, content: bytes) -> Image:
        try:
            # store image in directory
            image_path = images_folder / filename
            with open(f"{image_path}", "wb") as f:
                f.write(content)

            # get current date
            uploadedAt = int(datetime.now().strftime('%Y%m%d'))

            # store image in db
            await self.conn.prisma.images.create({
                "cod_ubi": image.cod_ubi,
                "cod_user": image.cod_user,
                "image": str(image_path),
                "uploadedat": uploadedAt
            })

        except Exception as e:
            raise ImageUploadError(f"Error uploading image: {e}")

    async def delete(self, cod_image: UUID) -> Image:
        image = await self.find_by_cod(cod_image)

        # remove image from directory
        os.remove(Path(images_folder, image.image_path))

        # remove database records
        return await self.conn.prisma.images.delete(where={"cod_image": cod_image})
