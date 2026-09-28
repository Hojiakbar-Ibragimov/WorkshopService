from django.db import models
from django.db.models import CheckConstraint, Q
from django.contrib.auth.models import User

class CustomerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='customer_profile',
        primary_key=True
    )
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    location = models.CharField(null=True, blank=True)
    # avatar = models.ImageField()
    theme = models.CharField(max_length=15, default='default', null=True, blank=True)
    language = models.CharField(max_length=2, default='en', null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.phone_number

    class Meta:
        constraints = [
            CheckConstraint(
                check=Q(phone_number__regex=r'^\+?[0-9]+$'),
                name='phone_number_digits_only'
            )
        ]