from django.http import JsonResponse, Http404
from django.shortcuts import render, redirect
from apps.requests.service import service as request_service
from apps.customers.service import service as customer_service
from apps import exceptions as e


def dashboard(request):
    user = request.user

    if not user.is_superuser:
        raise Http404

    if request.method == 'GET':
        requests_count = request_service.get_requests_count()
        return render(
            request=request,
            template_name='operator/dashboard.html',
            context={'stats': requests_count}
        )

    return JsonResponse(
        {
            'message': 'Method not allowed'
        },
        status=405
    )


def requests(request):
    user = request.user

    if not user.is_superuser:
        raise Http404

    if request.method == 'GET':
        status = request.GET.get('status')

        try:
            requests_data = request_service.get_requests_by_status(
                status=status
            )
            current_status = {'current_status': status}

            return render(
                request=request,
                template_name='operator/requests.html',
                context=current_status|requests_data
            )
        except e.InvalidDataError:
            raise Http404

    return JsonResponse(
        {
            'message': 'Method not allowed'
        },
        status=405
    )


def specific_request(request, request_id):
    user = request.user

    if not user.is_superuser:
        raise Http404

    if request.method == 'GET':
        try:
            request_data = request_service.get_request_by_pk(
                pk=request_id
            ).get('request')
            customer_data = customer_service.get_customer_by_request(
                request_id=request_id
            )
        except e.NotFoundError:
            raise Http404

        return render(
            request=request,
            template_name='operator/specific_request.html',
            context={'request': request_data|customer_data}
        )

    return JsonResponse(
        {
            'message:': 'Method not allowed'
        },
        status=405
    )


def contacting(request, request_id):
    user = request.user

    if not user.is_superuser:
        raise Http404

    # if request.method == 'GET':
    #     request_data = request_service.get_request_by_pk(
    #         pk=request_id
    #     )
    #     return render(
    #         request=request,
    #         template_name='contact.html',
    #         context=request_data
    #     )

    if request.method == 'POST':
        to_status = 'contacting'
        try:
            request_service.update_request_status(
                pk=request_id,
                to_status=to_status
            )
        except e.InvalidDataError:
            redirect(
                to='operator_specific_request',
                request_id=request_id
            )

        except e.NotFoundError:
            raise Http404

        except e.NotAllowedError:
            redirect(
                to='operator_specific_request',
                request_id=request_id
            )

        return redirect(
            to='operator_specific_request',
            request_id=request_id
        )

    return JsonResponse(
        {
            'message': 'Method not allowed'
        },
        status=405
    )


def reject_request(request, request_id):
    user = request.user

    if not user.is_superuser:
        raise Http404

    if request.method == 'POST':
        to_status = 'rejected'
        try:
            request_service.update_request_status(
                pk=request_id,
                to_status=to_status
            )
        except e.InvalidDataError:
            return redirect(
                to='operator_specific_request',
                request_id=request_id
            )

        except e.NotFoundError:
            raise Http404

        except e.NotAllowedError:
            return redirect(
                to='operator_specific_request',
                request_id=request_id
            )

        return redirect(
            to='operator_specific_request',
            request_id=request_id
        )

    return JsonResponse(
        {
            'message': 'Method not allowed'
        }
    )


def confirm_request(request, request_id):
    user = request.user

    if not user.is_superuser:
        raise Http404

    if request.method == 'POST':
        to_status = 'confirmed'
        try:
            request_service.update_request_status(
                pk=request_id,
                to_status=to_status
            )
        except e.InvalidDataError:
            return redirect(
                to='operator_specific_request',
                request_id=request_id
            )

        except e.NotFoundError:
            raise Http404

        except e.NotAllowedError:
            return redirect(
                to='operator_specific_request',
                request_id=request_id
            )

        return redirect(
            to='operator_specific_request',
            request_id=request_id
        )

    return JsonResponse(
        {
            'message': 'Method not allowed'
        },
        status=405
    )


def start_request_process(request, request_id):
    user = request.user

    if not user.is_superuser:
        raise Http404

    if request.method == 'POST':
        to_status = 'in_progress'
        try:
            request_service.update_request_status(
                pk=request_id,
                to_status=to_status
            )
        except e.InvalidDataError:
            return redirect(
                to='operator_specific_request',
                request_id=request_id
            )

        except e.NotFoundError:
            raise Http404

        except e.NotAllowedError:
            return redirect(
                to='operator_specific_request',
                request_id=request_id
            )

        return redirect(
            to='operator_specific_request',
            request_id=request_id
        )

    return JsonResponse(
        {
            'message': 'Method not allowed'
        },
        status=405
    )


def complete_request_process(request, request_id):
    user = request.user

    if not user.is_superuser:
        raise Http404

    if request.method == 'POST':
        to_status = 'completed'
        try:
            request_service.update_request_status(
                pk=request_id,
                to_status=to_status
            )
        except e.InvalidDataError:
            return redirect(
                to='operator_specific_request',
                request_id=request_id
            )

        except e.NotFoundError:
            raise Http404

        except e.NotAllowedError:
            return redirect(
                to='operator_specific_request',
                request_id=request_id
            )

        return redirect(
            to='operator_specific_request',
            request_id=request_id
        )

    return JsonResponse(
        {
            'message': 'Method not allowed'
        },
        status=405
    )