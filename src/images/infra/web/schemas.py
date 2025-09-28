from uuid import UUID
from datetime import date
from pydantic import BaseModel
from typing import Optional, TypeVar

T = TypeVar("T")


class Ubication(BaseModel):
    cod_ubi: int
    country: str


class Dates(BaseModel):
    cod_date: int
    day: date


class UploadImage(BaseModel):
    cod_image: UUID
    cod_ubi: int
    cod_user: UUID
    image_path: str
    uploaded_at: int


class Image(UploadImage):
    cod_image: UUID
    uploaded_at: int


class ResponseSchema(BaseModel):
    detail: str
    result: Optional[T] = None
