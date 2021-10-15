from rest_framework import serializers
from tasks.models import Tasks
from projects.models import Projects
from users.models import Users


class TasksSerializer(serializers.ModelSerializer):
    task_id = serializers.CharField(required=False)
    project = serializers.PrimaryKeyRelatedField(queryset=Projects.objects.all())
    nitems = serializers.IntegerField(required=False, default=0)
    status = serializers.IntegerField(required=False)
    assigned_manager_id = serializers.IntegerField(required=False)
    assigned_user_id = serializers.IntegerField(required=False)

    class Meta:
        model = Tasks
        fields = ('id', 'task_id', 'nitems', 'ncompleted', 'tika_score_flag', 'status', 'data', 'assigned_manager_id', 'assigned_user_id', 'project')
        ordering = ['id', 'task_id']
