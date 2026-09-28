from apps import exceptions as e


class CustomerNotExists(e.NotFoundError):
    pass