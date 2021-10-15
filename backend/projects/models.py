from django.db import models
from clients.models import Clients


class Projects(models.Model):
    _data_type = (
        (1, 'Image'),
        (2, 'Text'),
        (3, 'Audio'),
    )
    _task_type = (
        (1, 'Image boundbox'),
        (2, 'Image classification'),
        (3, 'Text classification'),
        (4, 'Audio classification'),
        (5, 'Marker classification'),
        (6, 'Semantic classification'),
    )
    _annotation_type = (
        (1, 'JSON'),
        (2, 'XML'),
    )
    name = models.CharField(max_length=100)
    client = models.ForeignKey(Clients, on_delete=models.CASCADE)
    year = models.IntegerField()
    deadline = models.DateField()
    data_type = models.IntegerField(choices=_data_type)
    task_type = models.IntegerField(choices=_task_type)
    labels = models.CharField(max_length=200)
    annotation_type = models.IntegerField(choices=_annotation_type)
    main_nitems = models.IntegerField(null=True)
    dk_nitems = models.IntegerField(null=True)
    number_of_tasks = models.IntegerField(null=True)
    tika_score_flag = models.IntegerField(null=True, default=0)
    main_file = models.FileField(upload_to='projects/', null=True)
    dk_file = models.FileField(upload_to='projects/dk', null=True)
    project_id = models.CharField(max_length=8, unique=True)

    def str_data_type(self):
        for num, opt in self._data_type:
            if self.data_type == num:
                return opt
    
  
    

    def list_labels(self):
        return self.labels.split(',')

    class Meta:
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'

    def __str__(self):
        return self.name

class FileInfo(models.Model):
    project_id = models.ForeignKey(Projects,on_delete=models.CASCADE)
    file_name = models.CharField(max_length = 500)
    
