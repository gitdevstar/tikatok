from django.conf import settings
from django.contrib.postgres.fields import JSONField
from django.db import models
from projects.models import Projects,FileInfo
from django.contrib.postgres.fields import ArrayField
from django.urls import reverse



class Tasks(models.Model):
    _status = (
        (1, 'Incomplete'),
        (2, 'Completed'),
        (3, 'Rejected'),
    )
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    task_id = models.CharField(max_length=8, unique=True)
    nitems = models.IntegerField()
    ncompleted = models.IntegerField(default=0)
    tika_score_flag = models.IntegerField(default=0)
    assigned_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        null=True,
        related_name='assigned_user'
    )
    assigned_manager = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        null=True,
        related_name='assigned_manager'
    )
    status = models.IntegerField(choices=_status)
    data = JSONField(null=True)

    def complete(self):
        return str(round(float(self.ncompleted / self.nitems) * 100, 2)) + ' %'

    def str_status(self):
        for num, opt in self._status:
            if self.status == num:
                return opt

    class Meta:
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'

    def get_absolute_url(self):
        return reverse('Task.Do', args=[int(self.pk)])

    def get_view_url(self):
        return reverse('view_task', args=[int(self.pk)])

    def get_tool_3_url(self):
        return reverse('task_do_tool_3', args=[int(self.pk)])
        
    def get_view_tool_3_url(self):
        return reverse('view_task_tool_3', args=[int(self.pk)])
    
    def get_task_text_classify_url(self):
        return reverse('task_text_classify', args=[int(self.pk)])

    def get_view_task_text_classify_url(self):
        return reverse('view_task_text_classify', args=[int(self.pk)])
    
    def get_task_audio_classify_url(self):
        return reverse('task_audio_classify', args=[int(self.pk)])

    def get_view_task_audio_classify_url(self):
        return reverse('view_task_audio_classify', args=[int(self.pk)])

    def get_task_img_marker_url(self):
        return reverse('task_img_marker', args=[int(self.pk)])

    def get_view_task_img_marker_url(self):
        return reverse('view_task_img_marker', args=[int(self.pk)])

    def get_task_img_semantic_url(self):
        return reverse('task_img_semantic', args=[int(self.pk)])

    def get_view_task_img_semantic_url(self):
        return reverse('view_task_img_semantic', args=[int(self.pk)])
        
    def __str__(self):
        return self.task_id


class Items(models.Model):
    task = models.ForeignKey(
        Tasks, on_delete=models.CASCADE, related_name='tasks_items'
    )
    tds_key = models.TextField()
    file_info = models.ForeignKey(FileInfo,on_delete=models.CASCADE,blank=True,null=False)

class tika_score(models.Model):
    task_id = models.CharField(max_length=8)
    user_id = models.CharField(max_length=8)
    dk_accuracy = models.FloatField(max_length=8,default=-1)
    dk_consistency = models.FloatField(max_length=8,default=-1)
    nasa_tlx = ArrayField(models.FloatField(default=0),null=True, blank=True)
    pe = models.IntegerField(default = -1)
    
    

class nasa_tlx(models.Model):
    user_id = models.CharField(max_length=250)
    task_id = models.CharField(max_length=250)
    sitting_no = models.IntegerField(default=0)
    mental_demand = models.IntegerField(default=0)
    physical_demand  = models.IntegerField(default=0)
    temporal_demand  = models.IntegerField(default=0)
    performance  = models.IntegerField(default=0)
    effort  = models.IntegerField(default=0)
    frustration  = models.IntegerField(default=0)
    ques_1 = models.IntegerField(default=0)
    ques_2 = models.IntegerField(default=0)
    ques_3 = models.IntegerField(default=0)
    ques_4 = models.IntegerField(default=0)
    ques_4 = models.IntegerField(default=0)
    ques_5 = models.IntegerField(default=0)
    ques_6 = models.IntegerField(default=0)
    ques_7 = models.IntegerField(default=0)
    ques_8 = models.IntegerField(default=0)
    ques_9 = models.IntegerField(default=0)
    ques_10 = models.IntegerField(default=0)
    ques_11 = models.IntegerField(default=0)
    ques_12 = models.IntegerField(default=0)
    ques_13 = models.IntegerField(default=0)
    ques_14 = models.IntegerField(default=0)
    ques_15 = models.IntegerField(default=0)
    

class ts_tool_metrics(models.Model):
    user_id = models.CharField(max_length=250)
    task_id = models.CharField(max_length=250)
    filename = models.CharField(max_length=250,default='0')
    hover_time = ArrayField(models.IntegerField(default=0), blank=True)
    completion_time = ArrayField(models.IntegerField(default=0), blank=True)
    nclicks = ArrayField(models.IntegerField(default=0), blank=True)

