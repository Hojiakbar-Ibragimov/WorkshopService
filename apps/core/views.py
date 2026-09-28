from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, Http404
from django.shortcuts import render, redirect
from apps.customers.service import service as customer_service


def landing(request):
    user = request.user

    if request.method == 'GET':
        return render(
            request=request,
            template_name='public/landing.html'
        )

    return JsonResponse(
        {
            'message': 'Method not allowed'
        }
    )


@login_required(login_url='login')
def dashboard(request):
    user = request.user

    if user.is_superuser:
        raise Http404

    if request.method == 'GET':
        data = customer_service.make_customer_data_payload(
            customer_id=user.pk
        )
        return render(
            request=request,
            template_name='user/dashboard.html',
            context=data
        )

    return JsonResponse(
        {
            'message': 'Method not allowed'
        }
    )