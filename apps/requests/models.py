from django.db import models

from apps.customers.models import CustomerProfile


class Request(models.Model):
    customer = models.ForeignKey(
        CustomerProfile,
        on_delete=models.CASCADE,
        related_name='customer_request'
    )
    problem_description = models.TextField(max_length=500)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    status = models.CharField(max_length=15, default='NEW')