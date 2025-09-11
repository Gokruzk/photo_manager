import os
from uuid import UUID
from typing import List
from pathlib import Path
from datetime import date
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from images.infra.web.schemas import Image, UploadImage
from images.infra.database.mysql.models import DatesModel, ImagesModel
from images.domain.exceptions import ImageDeletedError, ImageNotFoundError, ImageUploadError

# directory for images
home = Path.home()
images_folder = Path(home, "Images_Photo_Manager")


class SQLAlchemyRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def find_by_user(self, cod_user: UUID) -> List[ImagesModel]:
        images = await self.db.execute(
            select(ImagesModel)
            .where(ImagesModel.cod_user == cod_user)
        )

        if not images:
            raise ImageNotFoundError(f"No images found for user {cod_user}")

        return images.scalars().first()

    async def find_by_cod(self, cod_image: UUID) -> ImagesModel:
        image = await self.db.execute(
            select(ImagesModel)
            .where(ImagesModel.cod_image == cod_image)
        )

        if not image:
            raise ImageNotFoundError(f"Image with id {cod_image} not found")

        return image.scalars().first()

    async def upload(self, upload_image: UploadImage, content: bytes) -> Image:
        try:
            # ensure folder exists
            images_folder.mkdir(parents=True, exist_ok=True)

            # store image in directory
            image_path = upload_image.image_path
            with open(image_path, "wb") as f:
                f.write(content)

            today = date.today()
            result = await self.db.execute(
                select(DatesModel).where(DatesModel.day == today)
            )
            date_obj = result.scalars().first()

            # convert date to int YYYYMMDD
            # uploaded_at = int(datetime.now().strftime('%Y%m%d'))
            if not date_obj:
                date_obj = DatesModel(day=today)
                self.db.add(date_obj)
                await self.db.commit()
                await self.db.refresh(date_obj)

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
        image = await self.find_by_cod(cod_image)

        try:
            # remove image from directory
            os.remove(image.image_path)

        except FileNotFoundError:
            raise ImageDeletedError(f"Image file not found")
        except OSError as e:
            raise ImageDeletedError(f"Filesystem error deleting image: {e}")

        try:
            await self.db.delete(image)
            await self.db.commit()

        except Exception as e:
            await self.db.rollback()
            raise ImageDeletedError(f"Database error deleting image: {e}")

        return image
