from uuid import UUID
from typing import List
from abc import ABC, abstractmethod

from images.domain.entities import Image, UploadImage


class ImageRepository(ABC):
    @abstractmethod
    async def find_by_user(self, cod_user: UUID) -> List[Image]:
        pass

    @abstractmethod
    async def find_by_cod(self, cod_image: UUID) -> Image:
        pass

    @abstractmethod
    async def upload(self, upload_image: UploadImage, content: bytes) -> Image:
        pass

    @abstractmethod
    async def delete(self, cod_image: UUID) -> Image:
        pass
