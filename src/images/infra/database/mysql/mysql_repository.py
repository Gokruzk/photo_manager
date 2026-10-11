import os
from uuid import UUID
from typing import List
from pathlib import Path
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from images.infra.web.schemas import Image
from images.infra.database.mysql.models import ImagesModel
from images.domain.exceptions import (
    ImageDeletedError,
    ImageNotFoundError,
    ImageUploadError,
)

# directory for images
home = Path.home()
images_folder = Path(home, "Images_Photo_Manager")


class SQLAlchemyRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def find_by_user(self, cod_user: str) -> List[ImagesModel]:
        try:
            result = await self.db.execute(
                select(ImagesModel).where(ImagesModel.cod_user == cod_user)
            )

            if not result:
                raise ImageNotFoundError(
                    f"No images found for user {cod_user}")

            images = result.scalars().all()

        except Exception as e:
            print(e)
        return [Image.model_validate(image) for image in images]

    async def find_by_cod(self, cod_image: UUID) -> ImagesModel:
        result = await self.db.execute(
            select(ImagesModel).where(ImagesModel.cod_image == str(cod_image))
        )

        image = result.scalars().first()

        if not image:
            raise ImageNotFoundError(f"Image with id {cod_image} not found")

        return Image.model_validate(image)

    async def upload(self, upload_image: ImagesModel, content: bytes) -> Image:
        try:
            # ensure folder exists
            images_folder.mkdir(parents=True, exist_ok=True)

            # store image in directory
            image_path = upload_image.image_path
            with open(image_path, "wb") as f:
                f.write(content)

            # add to db
            self.db.add(upload_image)
            await self.db.commit()
            await self.db.refresh(upload_image)

        except OSError as e:
            raise ImageUploadError(f"Filesystem error uploading image: {e}")
        except Exception as e:
            raise ImageUploadError(f"Error uploading image: {e}")
        return upload_image

    async def delete(self, cod_image: UUID) -> Image:
        result = await self.find_by_cod(cod_image)
        if not result:
            raise ImageNotFoundError(f"Image with id {cod_image} not found")

        stmt = delete(ImagesModel).where(
            ImagesModel.cod_image == str(cod_image))
        try:
            await self.db.execute(stmt)
            await self.db.commit()

        except Exception as e:
            await self.db.rollback()
            raise ImageDeletedError(f"Database error deleting image: {e}")

        try:
            # remove image from directory
            os.remove(result.image_path)

        except FileNotFoundError:
            raise ImageNotFoundError("Image file not found")
        except OSError as e:
            raise ImageDeletedError(f"Filesystem error deleting image: {e}")

        return Image.model_validate(result)
