from apps import exceptions as e

class RequestNotFound(e.NotFoundError):
    pass

class NotAllowedRequestStatus(e.NotAllowedError):
    pass

class InvalidRequestStatus(e.InvalidDataError):
    pass

class AuthorizationError(BaseException):
    pass