from django.contrib.auth.models import AbstractUser
from django.db import models


class Users(AbstractUser):
    types = (
        (1, 'Admin'),
        (2, 'Manager'),
        (3, 'User'),
    )
    type_user = models.IntegerField(null=True, choices=types)
    user_id = models.CharField(max_length=8, unique=True)

    def str_type_user(self):
        for num, opt in self.types:
            if self.type_user == num:
                return opt

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username
