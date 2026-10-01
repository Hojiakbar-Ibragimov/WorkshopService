import os, django

from django.contrib.auth.hashers import check_password
from django.utils.timezone import localtime, get_fixed_timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.customers.service import service as customer_service
from apps.requests import exceptions as e
from apps.requests.models import Request
from django.db.models import F


def create_request(*, data):
    customer_id = data.get('user_id')

    customer_service.check_customer_exists(
        pk=customer_id
    )

    request = Request.objects.create(
        customer_id=customer_id,
        problem_description=data.get(
            'problem_description'
        ),
        created_at=get_current_time()
    )

    return request


def cancel_request(*, user_id, request_id):
    check_request_author(
        customer_id=user_id,
        request_id=request_id
    )
    cancelling_request_rule(
        request_id=request_id
    )
    Request.objects.filter(
        pk=request_id
    ).update(
        is_active=False,
        status='cancelled'.upper(),
        updated_at=get_current_time()
    )
    return {
        'message': 'Request cancelled'
    }


def cancelling_request_rule(request_id):
    current_status = get_request_status(
        pk=request_id
    ).lower()

    if (current_status != 'new' and
        current_status != 'contacting'):
        raise e.NotAllowedRequestStatus(
            'Cancelling not allowed '
            f'in status: {current_status}'
        )

    return True


def check_request_author(*, customer_id, request_id):
    check_request_exists(
        request_id=request_id
    )
    author = Request.objects.filter(
        pk=request_id
    ).values_list(
        'customer_id',
        flat=True
    )
    if customer_id != author[0]:
        raise e.AuthorizationError(
            'Author did not match: '
            f'The author ({customer_id}) '
            f'The request ({request_id})'
        )

    return True


def check_status_activeness(status):
    status = status.lower()

    if (status == 'cancelled' or
        status == 'rejected' or
        status == 'completed'):
        return False

    return True


def check_request_exists(*, request_id, customer_id=None):
    if customer_id is not None:
        if not Request.objects.filter(
            pk=request_id,
            customer_id=customer_id
        ).exists():
            raise e.RequestNotFound(
                'Request Not Found'
            )

    if not Request.objects.filter(
            pk=request_id
    ).exists():
        raise e.RequestNotFound(
            'Request Not Found'
        )

    return True


def get_requests(customer_id=None):
    if customer_id is not None:
        return {
            'requests': list(Request.objects.filter(
                customer_id=customer_id
            ).values(
                'id',
                'problem_description',
                'created_at',
                'updated_at',
                'is_active',
                'status'
            ).order_by(
                '-created_at'
            ))
        }
    return {
        'requests': list(Request.objects.all().values(
            'id',
            'problem_description',
            'created_at',
            'updated_at',
            'is_active',
            'status',
            author_username=F('customer__user__username')
        ).order_by(
            '-created_at'
        ))
    }


def get_requests_by_status(status):
    if status is None:
        return get_requests()

    validate_request_status(
        status=status
    )
    requests = Request.objects.filter(
        status=status.upper()
    ).values(
        'id',
        'problem_description',
        'created_at',
        'updated_at',
        'is_active',
        'status',
        author_username=F('customer__user__username')
    ).order_by(
        '-created_at'
    )

    return {
        'requests': list(requests)
    }


def get_request_by_pk(*, pk, customer_id=None):
    check_request_exists(
        request_id=pk
    )

    if customer_id is not None:
        check_request_exists(
            request_id=pk,
            customer_id=customer_id
        )
        return {
            'request': Request.objects.filter(
                pk=pk,
                customer_id=customer_id
            ).values(
                'id',
                'problem_description',
                'created_at',
                'updated_at',
                'is_active',
                'status'
            )[0]
        }

    return {
        'request': Request.objects.filter(
            pk=pk
        ).values(
            'id',
            'problem_description',
            'created_at',
            'updated_at',
            'is_active',
            'status'
        )[0]
        }


def get_request_status(*, pk):
    check_request_exists(
        request_id=pk
    )
    return Request.objects.filter(
        pk=pk
    ).values_list(
        'status',
        flat=True
    )[0]


def get_next_allowed_status(from_status):
    status_queue = {
        'new': {'contacting'},
        'contacting': {
            'rejected',
            'confirmed'
        },
        'confirmed': {'in_progress'},
        'in_progress': {'completed'}
    }
    return status_queue.get(
        str(from_status)
        .lower(), set())


def get_requests_count():
    overall_requests = Request.objects.all().count()

    if overall_requests == 0:
        return 0

    new = Request.objects.filter(
        status='new'.upper()
    ).count()

    contacting = Request.objects.filter(
        status='contacting'.upper()
    ).count()

    cancelled = Request.objects.filter(
        status='cancelled'.upper()
    ).count()

    rejected = Request.objects.filter(
        status='rejected'.upper()
    ).count()

    confirmed = Request.objects.filter(
        status='confirmed'.upper()
    ).count()

    in_progress = Request.objects.filter(
        status='in_progress'.upper()
    ).count()

    completed = Request.objects.filter(
        status='completed'.upper()
    ).count()

    return make_request_count_payload(
        requests=overall_requests,
        new=new,
        contacting=contacting,
        cancelled=cancelled,
        rejected=rejected,
        confirmed=confirmed,
        in_progress=in_progress,
        completed=completed
    )


def get_active_requests(*, customer_id=None):
    if customer_id is not None:
        return {
            'active_requests': list(
                Request.objects.filter(
                    is_active=True,
                    customer_id=customer_id
                ).values().order_by(
                    '-created_at'
                )
            )
        }
    return {
        'active_requests': list(
            Request.objects.filter(
                is_active=True
            ).values().order_by(
                '-created_at'
            )
        )
    }


def update_request_status(*, pk, to_status):
    validate_request_status(
        status=to_status
    )
    status_editing_rule(
        request_id=pk,
        to_status=to_status
    )

    is_active = check_status_activeness(
        status=to_status
    )

    Request.objects.filter(
        pk=pk
    ).update(
        is_active=is_active,
        status=to_status.upper(),
        updated_at=get_current_time()
    )
    return {
        'message': f'Status updated to: {to_status.upper()}'
    }


def status_editing_rule(*, request_id, to_status):
    check_request_exists(
        request_id=request_id
    )
    from_status = get_request_status(
        pk=request_id
    ).lower()

    to_status = str(to_status).lower()

    allowed_statuses = get_next_allowed_status(
        from_status=from_status
    )

    if to_status not in allowed_statuses:
        raise e.NotAllowedRequestStatus(
            f'Not Allowed status: {to_status.upper()} '
            f'From status: {from_status.upper()}'
        )

    return True


def make_request_count_payload(requests, **kwargs):
    return {
        'total': requests,
        'new': kwargs.get('new'),
        'contacting': kwargs.get('contacting'),
        'cancelled': kwargs.get('cancelled'),
        'rejected': kwargs.get('rejected'),
        'confirmed': kwargs.get('confirmed'),
        'in_progress': kwargs.get('in_progress'),
        'completed': kwargs.get('completed')
    }


def validate_request_status(status):
    status = str(status).lower()

    if not (status == 'new' or
            status == 'cancelled' or
            status == 'contacting' or
            status == 'rejected' or
            status == 'confirmed' or
            status == 'in_progress' or
            status == 'completed'
    ):
        raise e.InvalidRequestStatus(
            f'Invalid Status: {status}'
        )

    return True


def get_current_time():
    return localtime(
        timezone=get_fixed_timezone(300)
    ).now()