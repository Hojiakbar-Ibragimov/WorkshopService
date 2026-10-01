from django.urls import path
from . import views

urlpatterns = [
    path(route='', view=views.requests, name='requests'),
    path(route='send', view=views.create_request, name='create_request'),
    path(route='<int:request_id>', view=views.specific_request, name='specific_request'),
    path(route='<int:request_id>/cancel', view=views.cancel_request, name='cancel_request'),
]