class ImageBaseError(Exception):
    """Base exception"""
    pass


class ImageNotFoundError(ImageBaseError):
    """Raised when an image is not found"""
    pass


class ImageUploadError(ImageBaseError):
    """Raised when an error happens uploading an image"""
    pass


class ImageDeletedError(ImageBaseError):
    """Raised when an error happens deleting an image"""
    pass
