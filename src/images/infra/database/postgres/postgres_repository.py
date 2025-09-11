import os
from uuid import UUID
from typing import List
from pathlib import Path
from datetime import datetime
from images.infra.web.schemas import Image, UploadImage
from images.infra.database.postgres.prisma_connection import PrismaConnection
from images.domain.exceptions import ImageDeletedError, ImageNotFoundError, ImageUploadError

# directory for images
home = Path.home()
images_folder = Path(home, "Images_Photo_Manager")


class PrismaImageRepository:
    def __init__(self, conn: PrismaConnection):
        self.conn = conn

    async def find_by_user(self, cod_user: UUID) -> List[Image]:
        images = await self.conn.prisma.images.find_many(where={"cod_user": cod_user})

        if not images:
            raise ImageNotFoundError(f"No images found for user {cod_user}")

        return images

    async def find_by_cod(self, cod_image: UUID) -> Image:
        image = await self.conn.prisma.images.find_first(
            where={"cod_image": cod_image})

        if not image:
            raise ImageNotFoundError(f"Image with id {cod_image} not found")

        return image

    async def upload(self, upload_image: UploadImage, content: bytes) -> Image:
        try:
            # ensure folder exists
            images_folder.mkdir(parents=True, exist_ok=True)

            # store image in directory
            image_path = upload_image.image_path
            with open(image_path, "wb") as f:
                f.write(content)

            # convert date to int YYYYMMDD
            uploaded_at = int(datetime.now().strftime('%Y%m%d'))

            image = await self.conn.prisma.images.create({
                "cod_ubi": int(upload_image.cod_ubi),
                "cod_user": str(upload_image.cod_user),
                "image_path": str(image_path),
                "uploaded_at": uploaded_at
            })

        except OSError as e:
            raise ImageUploadError(f"Filesystem error uploading image: {e}")
        except Exception as e:
            raise ImageUploadError(f"Error uploading image: {e}")

        return image

    async def delete(self, cod_image: UUID) -> Image:
        image = await self.find_by_cod(cod_image)

        try:
            # remove image from directory
            os.remove(image.image_path)

        except FileNotFoundError as e:
            raise ImageDeletedError(f"Filesystem error deleting image: {e}")

        # remove database record
        return await self.conn.prisma.images.delete(where={"cod_image": cod_image})
