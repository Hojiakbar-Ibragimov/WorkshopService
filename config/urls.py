"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path,include

import apps.core.urls
import apps.admin.urls
import apps.customers.urls
import apps.requests.urls
import apps.authentication.urls

urlpatterns = [
    path('', include(apps.core.urls)),
    path('admin/', include(apps.admin.urls)),
    path('customer/', include(apps.customers.urls)),
    path('request/', include(apps.requests.urls)),
    path('auth/', include(apps.authentication.urls))
]