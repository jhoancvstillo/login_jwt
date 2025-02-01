from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []  # Sin campos obligatorios adicionales

    def __str__(self):
        return self.username
    