from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, Http404
from django.shortcuts import render, redirect
from django.urls import reverse_lazy

from .forms import RequestForm
from .service import service
from apps import exceptions as e
from apps.requests import exceptions as r_e
from django.views import generic
from . models import Request

@login_required(login_url='login')
def requests(request):
    user = request.user

    if user.is_superuser:
        raise Http404

    if request.method == 'GET':
        requests_data = service.get_requests(
            customer_id=user.pk
        ).get('requests')

        history_request = {'history_requests': requests_data}

        active_requests = service.get_active_requests(
            customer_id=user.pk
        )

        return render(
            request=request,
            template_name='user/requests.html',
            context=history_request|active_requests
        )

    return JsonResponse(
        {
            'message': 'Method not allowed'
        },
        status=405
    )


def specific_request(request, request_id):
    user = request.user

    if not user.is_authenticated:
        raise Http404

    if user.is_superuser:
        raise Http404

    if request.method == 'GET':
        try:
            request_data = service.get_request_by_pk(
                pk=request_id,
                customer_id=user.id
            )
        except e.NotFoundError:
            raise Http404

        return render(
            request=request,
            template_name='user/specific_request.html',
            context=request_data
        )

    return JsonResponse(
        {
            'message:': 'Method not allowed'
        },
        status=405
    )


def create_request(request):
    user = request.user

    if user.is_superuser:
        raise Http404

    if request.method == 'GET':
        return render(
            request=request,
            template_name='user/create_request.html'
        )

    if request.method == 'POST':
        form = RequestForm(
            data=request.POST
        )

        if not form.is_valid():
            return render(
                request=request,
                template_name='user/create_request.html',
                context={'errors': form.errors}
            )

        form.cleaned_data['user_id'] = user.id

        try:
            request_object = service.create_request(
                data=form.cleaned_data
            )
        except e.NotFoundError:
            raise Http404

        return redirect(
            to='specific_request',
            request_id=request_object.pk
        )

    return JsonResponse(
        {
            'message': 'Method not allowed'
        },
        status=405
    )


class RequestCreation(generic.CreateView):
    model = Request
    form_class = RequestForm
    template_name = 'user/create_request.html'
    success_url = reverse_lazy('requests')

    def get_initial(self):

        if not self.request.user.is_authenticated:
            raise Http404

        if self.request.user.is_authenticated:
            if self.request.user.is_superuser:
                raise Http404

    def form_valid(self, form):
        super().form_valid(form)

def cancel_request(request, request_id):
    user = request.user

    if not user.is_authenticated:
        raise Http404

    if user.is_superuser:
        raise Http404

    if request.method == 'POST':
        try:
            service.cancel_request(
                user_id=user.id,
                request_id=request_id
            )
        except e.NotFoundError:
            raise Http404

        except r_e.AuthorizationError:
            raise Http404

        except r_e.NotAllowedRequestStatus as error:
            print(error)
            raise Http404

        return redirect(
            to='specific_request',
            request_id=request_id
        )

    return JsonResponse(
        {
            'message': 'Method not allowed'
        },
        status=405
    )