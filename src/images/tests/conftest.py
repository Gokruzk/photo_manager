import pytest
from io import BytesIO
from unittest.mock import AsyncMock

from images.app.ports.image_repository import ImageRepository


@pytest.fixture
def mock_image_repository():
    return AsyncMock(spec=ImageRepository)


@pytest.fixture
def fake_upload_file():
    file_bytes = BytesIO(b"fake-image-bytes")
    return file_bytes
