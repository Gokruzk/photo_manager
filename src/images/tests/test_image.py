import pytest
from uuid import uuid4
from unittest.mock import AsyncMock

from images.domain.entities import Image, UploadImage
from images.app.use_cases.image_service import ImageService
from images.domain.value_objects import DateCod, ImageCod, UbicationCod, UserCod
from images.domain.exceptions import ImageDeletedError, ImageNotFoundError, ImageUploadError


@pytest.mark.usefixtures("mock_image_repository")
class TestImageService:
    @pytest.fixture(autouse=True)
    def setup_service(self, mock_image_repository):
        self.mock_image_repository = mock_image_repository
        self.service = ImageService(mock_image_repository)

    @pytest.mark.asyncio
    async def test_get_by_cod_success(self):
        # Arrange
        cod_image = uuid4()
        cod_user = uuid4()

        expected_image = Image(
            cod_image=ImageCod(value=cod_image),
            cod_ubi=UbicationCod(value=1),
            image_path="/image/path",
            cod_user=UserCod(value=cod_user),
            uploadedat=DateCod(value=20010101)
        )

        self.mock_image_repository.find_by_cod = AsyncMock(
            return_value=expected_image)

        # Act
        result = await self.service.find_by_cod(cod_image)

        # Assert
        assert result == expected_image
        self.mock_image_repository.find_by_cod.assert_called_once_with(
            cod_image)

    @pytest.mark.asyncio
    async def test_get_not_found(self):
        # Arrange
        cod_image = uuid4()

        self.mock_image_repository.find_by_cod = AsyncMock(
            return_value=None)

        # Act& Assert
        with pytest.raises(ImageNotFoundError, match=f"The image with id {cod_image} not found"):
            await self.service.find_by_cod(cod_image)

    @pytest.mark.asyncio
    async def test_upload_success(self, fake_upload_file):
        # Arrange
        cod_image = uuid4()
        cod_user = uuid4()

        expected_image = Image(
            cod_image=ImageCod(value=cod_image),
            cod_ubi=UbicationCod(value=1),
            image_path="/image/path",
            cod_user=UserCod(value=cod_user),
            uploadedat=DateCod(value=20010101)
        )

        self.mock_image_repository.upload = AsyncMock(
            return_value=expected_image)

        image = UploadImage(cod_user=UserCod(value=cod_user),
                            cod_ubi=UbicationCod(value=1), image_path="/image/path")

        # Act
        result = await self.service.upload(image, fake_upload_file)

        # Assert
        assert result == expected_image
        await self.service.upload(image, fake_upload_file)

    @pytest.mark.asyncio
    async def test_upload_failed(self, fake_upload_file):
        # Arrange
        cod_user = uuid4()

        self.mock_image_repository.upload = AsyncMock(
            return_value=None)

        image = UploadImage(cod_user=UserCod(value=cod_user),
                            cod_ubi=UbicationCod(value=1), image_path="/image/path")

        # Act & Assert
        with pytest.raises(ImageUploadError, match=f"Unexpected error uploading image for user {cod_user}"):
            await self.service.upload(image, fake_upload_file)

    @pytest.mark.asyncio
    async def test_delete_success(self):
        # Arrange
        cod_image = uuid4()
        cod_user = uuid4()

        expected_image = Image(
            cod_image=ImageCod(value=cod_image),
            cod_ubi=UbicationCod(value=1),
            image_path="/image/path",
            cod_user=UserCod(value=cod_user),
            uploadedat=DateCod(value=20010101)
        )

        self.mock_image_repository.delete = AsyncMock(
            return_value=expected_image)

        # Act
        result = await self.service.delete(cod_image)

        # Assert
        assert result == expected_image
        self.mock_image_repository.delete.assert_called_once_with(cod_image)

    @pytest.mark.asyncio
    async def test_delete_not_found(self):
        # Arrange
        cod_image = uuid4()

        self.mock_image_repository.delete = AsyncMock(return_value=None)

        self.service.find_by_cod = AsyncMock(side_effect=ImageNotFoundError(
            f"The image with id {cod_image} not found"))

        # Act& Assert
        with pytest.raises(ImageNotFoundError):
            await self.service.delete(cod_image)

    @pytest.mark.asyncio
    async def test_delete_failed(self):
        # Arrange
        cod_image = uuid4()
        cod_user = uuid4()

        check_image = Image(
            cod_image=ImageCod(value=cod_image),
            cod_ubi=UbicationCod(value=1),
            image_path="/image/path",
            cod_user=UserCod(value=cod_user),
            uploadedat=DateCod(value=20010101)
        )

        self.mock_image_repository.delete = AsyncMock(
            return_value=None)

        self.service.find_by_cod = AsyncMock(return_value=check_image)

        # Act & Assert
        with pytest.raises(ImageDeletedError):
            await self.service.delete(cod_image)
