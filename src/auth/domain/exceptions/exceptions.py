class AuthBaseError(Exception):
    """Base exception"""
    pass


class AuthUserNotFoundError(AuthBaseError):
    """Raised when a user is not found"""
    pass


class AuthUserUpdateError(AuthBaseError):
    """Raised when an error happens updating a user"""
    pass


class AuthUserDeleteError(AuthBaseError):
    """Raised when an error happens deleting a user"""
    pass


class AuthLoginError(AuthBaseError):
    """Raised when an error happens authenticating a user"""
    pass


class AuthRegisterError(AuthBaseError):
    """Raised when an error happens registering a user"""
    pass
