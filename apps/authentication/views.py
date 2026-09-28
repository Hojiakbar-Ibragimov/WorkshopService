from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.http import JsonResponse, Http404
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views import generic
from django.contrib.auth import (
    login,
    logout,
    authenticate
)
from django.contrib.auth.decorators import login_required
from apps.authentication import service


def login_(request):
    if request.user.is_authenticated:
        return redirect_dashboard(request)

    if request.method == 'GET':
        return render(
            request=request,
            template_name='authentication/login.html'
        )

    if request.method == 'POST':
        result = login_helper(
            request_=request,
            user_data=request.POST
        )

        if result['success'] is False:
            return render(
                request=request,
                template_name='authentication/login.html',
                context={'error': result['message']}
            )

        return redirect_dashboard(request)

    return JsonResponse(
        {
            'message': 'Method not allowed'
        }
    )


@login_required(login_url='login')
def logout_(request):
    if request.method == 'POST':
        logout(request)

        return redirect(
            to='login'
        )

    return JsonResponse(
        {
            'message': 'Method not allowed'
        },
        status=405
    )



class SignUp(generic.CreateView):
    model = User
    form_class = UserCreationForm
    template_name = 'authentication/signup.html'
    success_url = reverse_lazy('dashboard')

    def get_initial(self):
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser:
                raise Http404

    def form_valid(self, form):
        super().form_valid(form)

        form.cleaned_data['password'] = form.cleaned_data['password1']

        login_helper(
            request_=self.request,
            user_data=form.cleaned_data
        )

        service.create_customer(
            pk=self.object.pk
        )

        return redirect(
            to='dashboard'
        )


def login_helper(request_, user_data):
    user = authenticate(
        request=request_,
        username=user_data.get('username'),
        password=user_data.get('password')
    )

    if user is None:
        error_msg = 'Incorrect username or password'

        return {
            'message': error_msg,
            'success': False
        }
    login(
        request=request_,
        user=user
    )

    return {
        'message': 'Logged in',
        'success': True
    }


def redirect_dashboard(request):
    if request.user.is_superuser:
        return redirect(
            to='operator_dashboard'
        )
    return redirect(
        to='dashboard'
    )