from rest_framework import serializers
from projects.models import Projects
from clients.models import Clients


class ProjectsSerializer(serializers.ModelSerializer):
    project_id = serializers.CharField(required=False)
    client = serializers.PrimaryKeyRelatedField(queryset=Clients.objects.all())

    class Meta:
        model = Projects
        fields = ('id', 'name', 'year', 'deadline', 'data_type', 'task_type', 'labels', 'annotation_type', 'number_of_tasks', 'main_file', 'dk_file', 'project_id', 'client')
        ordering = ['id', 'name']
""" class FileInfoSerializer(serializers.ModelSerializer):
    project_id = models.ForeignKey(Projects,on_delete=models.CASCADE)
    file_name = models.CharField(max_length = 500) """