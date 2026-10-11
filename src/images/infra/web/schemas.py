from uuid import UUID
from datetime import date
from pydantic import BaseModel, ConfigDict
from typing import Optional, TypeVar

T = TypeVar("T")


class BaseDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class Ubication(BaseDTO):
    cod_ubi: int
    country: str


class Dates(BaseDTO):
    cod_date: int
    day: date


class UploadImage(BaseDTO):
    cod_image: UUID
    cod_ubi: int
    cod_user: UUID
    image_path: str
    uploaded_at: int


class Image(UploadImage):
    pass


class ResponseSchema(BaseDTO):
    detail: str
    result: Optional[T] = None
