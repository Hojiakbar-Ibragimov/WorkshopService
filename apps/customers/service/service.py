import os, django

from apps.customers.exceptions import CustomerNotExists

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.customers.models import CustomerProfile
from django.contrib.auth.models import User
from django.db.models import Count
from django.utils.timezone import localtime


def get_identity_data(pk):
    check_customer_exists(
        pk=pk
    )

    customer = User.objects.filter(
        pk=pk
    ).values(
        'id',
        'email',
        'username',
        'first_name',
        'date_joined'
    )[0]

    return customer


def get_profile_data(pk):
    check_customer_exists(
        pk=pk
    )

    profile = CustomerProfile.objects.filter(
        pk=pk
    ).values(
        'phone_number',
        'location',
        'language'
    )[0]

    return profile


def check_customer_exists(*, pk):
    if not CustomerProfile.objects.filter(
        pk=pk
    ).exists():
        raise CustomerNotExists(
            f'Customer not exists'
        )

    return True


def get_customer_requests_count(pk):
    check_customer_exists(
        pk=pk
    )
    total = CustomerProfile.objects.filter(
        pk=pk
    ).values(
        total=Count('customer_request__pk')
    )[0]
    try:
        completed = CustomerProfile.objects.filter(
            pk=pk,
            customer_request__status='completed'.upper()
        ).values(
            completed=Count('customer_request__pk')
        )[0]
    except IndexError:
        completed = {'completed': 0}

    return total|completed


def get_customer_by_request(request_id):
    try:
        customer_id = CustomerProfile.objects.filter(
            customer_request__pk=request_id
        ).values_list(
            'pk',
            flat=True
        )[0]
    except IndexError:
        return None

    return {
        'customer': get_identity_data(
            pk=customer_id
        )|get_profile_data(
            pk=customer_id
        )
    }


def make_customer_data_payload(*, customer_id):
    identity = get_identity_data(
        pk=customer_id
    )
    profile = get_profile_data(
        pk=customer_id
    )
    requests = get_customer_requests_count(
        pk=customer_id
    )

    since_date = calculate_customer_member_since(
        pk=customer_id
    )

    return {
        'customer': identity|profile
    }|{
        'requests': requests
    }|{
        'member_since': since_date
    }


def calculate_customer_member_since(pk):
    check_customer_exists(
        pk=pk
    )
    date_joined = User.objects.filter(
        pk=pk
    ).values_list(
        'date_joined',
        flat=True
    )[0]

    since = (localtime() - date_joined)
    days = since.days
    minutes, seconds = divmod(since.seconds, 60)
    hours, minutes = divmod(minutes, 60)

    return {
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    }