from apps.requests.service import service as request_service
from apps.customers.service import service as customer_service
from apps.requests.models import Request
from apps.customers.models import CustomerProfile


def get_customer_requests_count(*, customer_id):
    customer_service.check_customer_exists(
        pk=customer_id
    )

    requests = Request.objects.filter(
        customer_id=customer_id
    ).count()

    return {'total_requests': requests}