from django.urls import path
from . import views

urlpatterns = [
    path(route='', view=views.dashboard, name='operator_dashboard'),
    path(route='request', view=views.requests, name='operator_requests'),
    path(route='request/<int:request_id>', view=views.specific_request, name='operator_specific_request'),
    path(route='request/<int:request_id>/contact', view=views.contacting, name='contacting'),
    path(route='request/<int:request_id>/reject', view=views.reject_request, name='reject_request'),
    path(route='request/<int:request_id>/confirm', view=views.confirm_request, name='confirm_request'),
    path(route='request/<int:request_id>/start', view=views.start_request_process, name='start_process'),
    path(route='request/<int:request_id>/complete', view=views.complete_request_process, name='complete_process'),
]