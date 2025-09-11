from datetime import date
from dataclasses import dataclass

from .value_objects import CountryName, DateCod, ImageCod, UbicationCod, UserCod


@dataclass(frozen=True)
class Ubication:
    cod_ubi: UbicationCod
    country: CountryName


@dataclass(frozen=True)
class Dates:
    cod_date: DateCod
    day: date


@dataclass(frozen=True)
class UploadImage:
    cod_user:   UserCod
    cod_ubi:    UbicationCod
    image_path: str


@dataclass(frozen=True)
class Image(UploadImage):
    cod_image:  ImageCod
    uploaded_at: DateCod
