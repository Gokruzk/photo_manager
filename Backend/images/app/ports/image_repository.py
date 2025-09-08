from uuid import UUID
from typing import List
from abc import ABC, abstractmethod

from images.domain.entities import Image, UploadImage


class ImageRepository(ABC):
    @abstractmethod
    async def find_by_user(slef, cod_user: UUID) -> List[Image]:
        pass

    @abstractmethod
    async def find_by_cod(slef, cod_image: UUID) -> Image:
        pass

    @abstractmethod
    async def upload(upload_image: UploadImage, content: bytes) -> Image:
        pass

    @abstractmethod
    async def delete(cod_image: UUID) -> Image:
        pass
