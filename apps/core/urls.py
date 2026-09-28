from django.urls import path
from . import views

urlpatterns = [
    path(route='', view=views.landing, name='landing'),
    path(route='home', view=views.dashboard, name='dashboard'),
]