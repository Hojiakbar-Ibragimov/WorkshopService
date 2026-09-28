from django.urls import path
from apps.authentication import views

urlpatterns = [
    path(route='login', view=views.login_, name='login'),
    path(route='logout', view=views.logout_, name='logout'),
    path(route='signup', view=views.SignUp.as_view(), name='signup'),
]