from django.db import models


class Countries(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = 'Country'
        verbose_name_plural = 'Countries'

    def __str__(self):
        return self.name


class Clients(models.Model):
    name = models.CharField(max_length=100)
    year = models.IntegerField()
    country = models.ForeignKey(Countries, on_delete=models.CASCADE)
    address = models.CharField(max_length=200)
    no_of_projects = models.IntegerField(default=0)

    class Meta:
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'

    def __str__(self):
        return self.name
