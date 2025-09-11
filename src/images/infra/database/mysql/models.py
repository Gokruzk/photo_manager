from datetime import date
from typing import List
from uuid import UUID as PUUID
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Date, ForeignKey, Integer, String, Text

from .mysql_connection import Base


class UbicationsModel(Base):
    __tablename__ = "ubications"

    cod_ubi: Mapped[int] = mapped_column(Integer, primary_key=True)
    country: Mapped[str] = mapped_column(String(100), nullable=False)

    images: Mapped[List["ImagesModel"]] = relationship(
        "ImagesModel", back_populates="ubication"
    )


class DatesModel(Base):
    __tablename__ = "dates"

    cod_date: Mapped[int] = mapped_column(Integer, primary_key=True)
    day: Mapped[date] = mapped_column(Date, nullable=False)

    images: Mapped[List["ImagesModel"]] = relationship(
        "ImagesModel", back_populates="dates"
    )


class ImagesModel(Base):
    __tablename__ = "images"

    cod_image: Mapped[PUUID] = mapped_column(UUID, primary_key=True)
    cod_ubi: Mapped[int] = mapped_column(
        ForeignKey("ubications.cod_ubi"), nullable=False
    )
    cod_user: Mapped[PUUID] = mapped_column(UUID, nullable=False)
    image_path: Mapped[str] = mapped_column(Text, nullable=False)
    uploaded_at: Mapped[int] = mapped_column(
        ForeignKey("dates.cod_date"), nullable=False
    )

    dates: Mapped["DatesModel"] = relationship(
        "DatesModel", back_populates="images"
    )

    ubication: Mapped["UbicationsModel"] = relationship(
        "UbicationsModel", back_populates="images"
    )
