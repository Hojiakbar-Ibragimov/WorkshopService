from django.urls import path

from . import views

urlpatterns = [
    path(route='profile', view=views.customer_profile, name='profile'),
    path(route='settings', view=views.customer_settings, name='settings'),
]