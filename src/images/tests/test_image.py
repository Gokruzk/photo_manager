import pytest
from uuid import uuid4
from unittest.mock import AsyncMock

from images.domain.entities import Image, UploadImage
from images.app.use_cases.image_service import ImageService
from images.domain.value_objects import DateCod, ImageCod, UbicationCod, UserCod
from images.domain.exceptions import (
    ImageDeletedError,
    ImageNotFoundError,
    ImageUploadError,
)


@pytest.mark.usefixtures("mock_image_repository")
class TestImageService:
    @pytest.fixture(autouse=True)
    def setup_service(self, mock_image_repository):
        self.mock_image_repository = mock_image_repository
        self.service = ImageService(mock_image_repository)

    @pytest.mark.asyncio
    async def test_should_return_image_when_cod_exists(self):
        cod_image = uuid4()
        cod_user = uuid4()

        expected_image = Image(
            cod_image=ImageCod(value=cod_image),
            cod_ubi=UbicationCod(value=1),
            image_path="/image/path",
            cod_user=UserCod(value=cod_user),
            uploaded_at=DateCod(value=20010101),
        )

        self.mock_image_repository.find_by_cod = AsyncMock(return_value=expected_image)

        result = await self.service.find_by_cod(cod_image)

        assert result == expected_image
        self.mock_image_repository.find_by_cod.assert_called_once_with(cod_image)

    @pytest.mark.asyncio
    async def test_should_raise_image_not_found_error_when_cod_does_not_exist(self):
        cod_image = uuid4()
        self.mock_image_repository.find_by_cod = AsyncMock(return_value=None)

        with pytest.raises(
            ImageNotFoundError, match=f"The image with id {cod_image} not found"
        ):
            await self.service.find_by_cod(cod_image)

    @pytest.mark.asyncio
    async def test_should_raise_image_not_found_error_when_find_by_cod_raises_unexpected_error(
        self,
    ):
        cod_image = uuid4()
        self.mock_image_repository.find_by_cod = AsyncMock(
            side_effect=Exception("DB failure")
        )

        with pytest.raises(
            ImageNotFoundError, match=f"Unexpected error fetching image"
        ):
            await self.service.find_by_cod(cod_image)

    @pytest.mark.asyncio
    async def test_should_upload_image_successfully(self, fake_upload_file):
        cod_user = uuid4()

        expected_image = Image(
            cod_image=ImageCod(value=uuid4()),
            cod_ubi=UbicationCod(value=1),
            image_path="/image/path",
            cod_user=UserCod(value=cod_user),
            uploaded_at=DateCod(value=20010101),
        )

        self.mock_image_repository.upload = AsyncMock(return_value=expected_image)

        image = UploadImage(
            cod_user=UserCod(value=cod_user),
            cod_ubi=UbicationCod(value=1),
            image_path="/image/path",
        )

        result = await self.service.upload(image, fake_upload_file)

        assert result == expected_image
        self.mock_image_repository.upload.assert_called_once_with(
            image, fake_upload_file
        )

    @pytest.mark.asyncio
    async def test_should_raise_image_upload_error_when_upload_fails(
        self, fake_upload_file
    ):
        cod_user = uuid4()
        self.mock_image_repository.upload = AsyncMock(return_value=None)

        image = UploadImage(
            cod_user=UserCod(value=cod_user),
            cod_ubi=UbicationCod(value=1),
            image_path="/image/path",
        )

        with pytest.raises(
            ImageUploadError,
            match=f"Unexpected error uploading image for user {cod_user}",
        ):
            await self.service.upload(image, fake_upload_file)

    @pytest.mark.asyncio
    async def test_should_raise_image_upload_error_when_upload_raises_unexpected_error(
        self, fake_upload_file
    ):
        cod_user = uuid4()
        self.mock_image_repository.upload = AsyncMock(
            side_effect=Exception("DB failure")
        )

        image = UploadImage(
            cod_user=UserCod(value=cod_user),
            cod_ubi=UbicationCod(value=1),
            image_path="/image/path",
        )

        with pytest.raises(
            ImageUploadError,
            match=f"Unexpected error uploading image for user {cod_user}",
        ):
            await self.service.upload(image, fake_upload_file)

    @pytest.mark.asyncio
    async def test_should_delete_image_successfully_when_exists(self):
        cod_image = uuid4()
        cod_user = uuid4()

        expected_image = Image(
            cod_image=ImageCod(value=cod_image),
            cod_ubi=UbicationCod(value=1),
            image_path="/image/path",
            cod_user=UserCod(value=cod_user),
            uploaded_at=DateCod(value=20010101),
        )

        self.service.find_by_cod = AsyncMock(return_value=expected_image)
        self.mock_image_repository.delete = AsyncMock(return_value=expected_image)

        result = await self.service.delete(cod_image)

        assert result == expected_image
        self.service.find_by_cod.assert_called_once_with(cod_image)
        self.mock_image_repository.delete.assert_called_once_with(cod_image)

    @pytest.mark.asyncio
    async def test_should_raise_image_not_found_error_when_deleting_nonexistent_image(
        self,
    ):
        cod_image = uuid4()
        self.service.find_by_cod = AsyncMock(
            side_effect=ImageNotFoundError(f"The image with id {cod_image} not found")
        )

        with pytest.raises(ImageNotFoundError):
            await self.service.delete(cod_image)

    @pytest.mark.asyncio
    async def test_should_raise_image_deleted_error_when_delete_fails(self):
        cod_image = uuid4()
        cod_user = uuid4()

        check_image = Image(
            cod_image=ImageCod(value=cod_image),
            cod_ubi=UbicationCod(value=1),
            image_path="/image/path",
            cod_user=UserCod(value=cod_user),
            uploaded_at=DateCod(value=20010101),
        )

        self.service.find_by_cod = AsyncMock(return_value=check_image)
        self.mock_image_repository.delete = AsyncMock(return_value=None)

        with pytest.raises(ImageDeletedError):
            await self.service.delete(cod_image)

    @pytest.mark.asyncio
    async def test_should_raise_image_deleted_error_when_delete_raises_unexpected_error(
        self,
    ):
        cod_image = uuid4()
        cod_user = uuid4()

        check_image = Image(
            cod_image=ImageCod(value=cod_image),
            cod_ubi=UbicationCod(value=1),
            image_path="/image/path",
            cod_user=UserCod(value=cod_user),
            uploaded_at=DateCod(value=20010101),
        )

        self.service.find_by_cod = AsyncMock(return_value=check_image)
        self.mock_image_repository.delete = AsyncMock(
            side_effect=Exception("DB failure")
        )

        with pytest.raises(ImageDeletedError):
            await self.service.delete(cod_image)
