from datetime import date
from typing import Optional, TypeVar
from uuid import UUID
from pydantic import BaseModel

T = TypeVar("T")


class Ubication(BaseModel):
    cod_ubi: int
    country: str


class Dates(BaseModel):
    cod_date: int
    year: int
    month: int
    day: date


class UploadImage(BaseModel):
    cod_user:   UUID
    cod_ubi:    UUID
    image_path:      str


class Image(UploadImage):
    cod_image:  UUID
    uploadedat: int


class ResponseSchema(BaseModel):
    detail: str
    result: Optional[T] = None
