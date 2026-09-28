from apps.customers.models import CustomerProfile


def create_customer(*, pk):
    CustomerProfile.objects.create(
        user_id=pk
    )
    print('created customer')

    return {
        'message': 'Customer profile created'
    }