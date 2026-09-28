from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, Http404
from django.shortcuts import render

from .service import service


@login_required(login_url='login')
def customer_profile(request):
    user = request.user

    if user.is_superuser:
        raise Http404

    if request.method == 'GET':
        data = service.make_customer_data_payload(
            customer_id=user.pk
        )
        return render(
            request=request,
            template_name='user/profile.html',
            context=data
        )

    return JsonResponse(
        {
            'message': 'Method not allowed'
        },
        status=405
    )


@login_required(login_url='login')
def customer_settings(request):
    user = request.user

    if user.is_superuser:
        raise Http404

    if request.method == 'GET':
        data = service.get_identity_data(
            pk=user.pk
        )
        return render(
            request=request,
            template_name='user/settings.html',
            context={'customer': data}
        )

    return JsonResponse(
        {
            'message': 'Method not allowed'
        },
        status=405
    )