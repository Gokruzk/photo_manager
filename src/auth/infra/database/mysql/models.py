from typing import List
from datetime import date
from sqlalchemy import Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .mysql_connection import Base


class UbicationsModel(Base):
    __tablename__ = "ubications"

    cod_ubi: Mapped[int] = mapped_column(Integer, primary_key=True)
    country: Mapped[str] = mapped_column(String(100), nullable=False)

    users: Mapped[List["UsersModel"]] = relationship(
        "UsersModel", back_populates="ubication")


class DatesModel(Base):
    __tablename__ = "dates"

    cod_date: Mapped[int] = mapped_column(Integer, primary_key=True)
    day: Mapped[date] = mapped_column(Date, nullable=False)

    user_dates: Mapped[List["User_Dates"]] = relationship(
        "User_Dates", back_populates="date")


class UsersStateModel(Base):
    __tablename__ = "users_state"

    cod_state: Mapped[int] = mapped_column(Integer, primary_key=True)
    state: Mapped[str] = mapped_column(String(8), nullable=False)

    users: Mapped[List["UsersModel"]] = relationship(
        "UsersModel", back_populates="state")


class DateDescriptionsModel(Base):
    __tablename__ = "date_descriptions"

    cod_description: Mapped[int] = mapped_column(Integer, primary_key=True)
    description: Mapped[str] = mapped_column(String(8), nullable=False)

    user_dates: Mapped[List["User_Dates"]] = relationship(
        "User_Dates", back_populates="description")


class UsersModel(Base):
    __tablename__ = "users"

    cod_user: Mapped[str] = mapped_column(String(36), primary_key=True)
    cod_ubi: Mapped[int] = mapped_column(ForeignKey(
        "ubications.cod_ubi"), nullable=False)
    cod_state: Mapped[int] = mapped_column(
        ForeignKey("users_state.cod_state"), nullable=False)

    username: Mapped[str] = mapped_column(
        String(15), nullable=True, unique=True)
    email: Mapped[str] = mapped_column(String(50), nullable=False)
    password: Mapped[str] = mapped_column(String(300), nullable=False)

    ubication: Mapped["UbicationsModel"] = relationship(
        "UbicationsModel", back_populates="users")
    state: Mapped["UsersStateModel"] = relationship(
        "UsersStateModel", back_populates="users")
    user_dates: Mapped[List["User_Dates"]] = relationship(
        "User_Dates", back_populates="user")


class User_Dates(Base):
    __tablename__ = "user_dates"

    cod_date: Mapped[int] = mapped_column(
        ForeignKey("dates.cod_date"), primary_key=True)
    cod_user: Mapped[str] = mapped_column(
        ForeignKey("users.cod_user"), primary_key=True)
    cod_description: Mapped[int] = mapped_column(ForeignKey(
        "date_descriptions.cod_description"), primary_key=True)

    users: Mapped["UsersModel"] = relationship(
        "UsersModel", back_populates="user_dates")
    date: Mapped["DatesModel"] = relationship(
        "DatesModel", back_populates="user_dates")
    description: Mapped["DateDescriptionsModel"] = relationship(
        "DateDescriptionsModel", back_populates="user_dates")
