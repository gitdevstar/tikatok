from django.http import HttpResponse

from tasks.models import Tasks, Items, tika_score, nasa_tlx, ts_tool_metrics
from projects.models import Projects, FileInfo
from users.models import Users
from .serializers import TasksSerializer
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.db.models import Count
from utilities.functions import generate_characters, save_log
from shutil import copyfile
from os import listdir
from os.path import isfile, join
import requests
import random
import shutil
import math
import json
import os
import xml.etree.ElementTree as ET
import xmltodict


@api_view(['POST'])
def managerDashboardData(request):
    managerId = request.data.get('managerId')
    userTasks = Tasks.objects.filter(assigned_manager=Users(pk=managerId)) \
        .values('assigned_user__username', 'assigned_user') \
        .annotate(tasks=Count('assigned_user'))
    resUserTasks = []
    taskcnt = 1
    for usertask in userTasks:
        if usertask:
            if usertask['assigned_user']:
                resUserTasks.append({
                    "no": taskcnt,
                    "userid": usertask['assigned_user'],
                    "username": usertask['assigned_user__username'],
                    "tasks": usertask['tasks']
                })
                taskcnt += 1

    resTaskProgress = []
    taskcnt = 1
    managertasks = Tasks.objects.filter(assigned_manager=Users(pk=managerId))
    for managertask in managertasks:
        if managertask:
            if managertask.assigned_user:
                resTaskProgress.append({
                    "no": taskcnt,
                    "taskid": managertask.id,
                    "taskname": managertask.task_id,
                    "assignedUser": managertask.assigned_user.username,
                    "progress": float(managertask.ncompleted) / managertask.nitems
                })
            else:
                resTaskProgress.append({
                    "no": taskcnt,
                    "taskid": managertask.id,
                    "taskname": managertask.task_id,
                    "assignedUser": '',
                    "progress": float(managertask.ncompleted) / managertask.nitems
                })
            taskcnt += 1
    return Response({
        "usertasks": resUserTasks,
        "tasklist": resTaskProgress
    })


@api_view(['POST'])
def resetImageResult(request): # reset image bounding box, Marker, semantic
    #get task for reset bound, marker, semantic
    task = get_object_or_404(Tasks, pk=request.data['id'])
    currentImage = request.data['item']

    if task:
        task_id = task.task_id
        user_id = task.assigned_user.user_id
        annotationType = task.project.annotation_type
        res_path = '%s%s%s%s%s%s' % (
            settings.MEDIA_ROOT,
            '/user_data/',
            user_id,
            '/',
            task_id,
            '/meta/')
        tmpSplit = currentImage.split('/')
        srcFileName = (tmpSplit[len(tmpSplit) - 1].split('.'))[0]
        print("srcfilename", srcFileName)
        if annotationType == 1:  # json
            path = res_path + srcFileName + '.json'
        else:  # xml
            path = res_path + srcFileName + '.xml'

        print("path", path)
        # result file delete
        if os.path.exists(path):
            os.remove(path)

        task.ncompleted = len(os.listdir(res_path))
        task.save()

    return Response({
        "res": "success"
    })


@api_view(['POST'])
def resetResult(request): # reset text, audio, image classification
    currentItem = request.data['item']

    # get task for reset result
    task = get_object_or_404(Tasks, pk=request.data['id'])
    if task:
        annotationType = task.project.annotation_type
        task_id = task.task_id
        user_id = task.assigned_user.user_id
        dataType = task.project.data_type
        taskType = task.project.task_type
        url = task.data
        if url == "":
            return Response({
                "result": "success"
            })
        # make reset fileName
        res_path = '%s%s%s%s%s%s' % (
            settings.MEDIA_ROOT,
            '/user_data/',
            user_id,
            '/',
            task_id,
            '/meta/')
        d = json.loads(task.data)
        if taskType == 2: # image classification
            srcFile = d["images"][currentItem]
        elif taskType == 3:# text classification
            srcFile = d["texts"][currentItem]
        elif taskType == 4:# audio classification
            srcFile = d["audios"][currentItem]
        # delete json or xml file
        tmpSplit = srcFile.split('/')
        srcFileName = (tmpSplit[len(tmpSplit) - 1].split('.'))[0]
        if annotationType == 1:  # json
            path = res_path + srcFileName + '.json'
        else:  # xml
            path = res_path + srcFileName + '.xml'

        # result file delete
        if os.path.exists(path):
            os.remove(path)
        # reset task.data
        dic = {}
        for label in task.project.labels.split(','):
            dic[label] = False
        d['menus_disabled'][currentItem] = dic
        d['selected_tags'][currentItem] = ''

        task.data = json.dumps(d)

        # task accomplish rate decrease
        task.ncompleted = len(os.listdir(res_path))
        task.save()

    return Response({
        "res": "success"
    })


@api_view(['POST'])
def rejectTask(request):
    task = get_object_or_404(Tasks, pk=request.data['taskid'])
    if task:
        task.status = 3
        task.save()

    return Response({"res": "success"})


@api_view(['POST'])
def deliveryTask(request):
    tasks = Tasks.objects.filter(pk__in=request.data['taskids'])
    for task in tasks:
        if task.status == 2: #completed
            task.status = 4 #delivery
            task.save()
    return Response({"res": "success"})


class TasksApiView(APIView):
    """ authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAdminUser,) """

    serializer_class = TasksSerializer
    queryset = Tasks.objects.all()

    @api_view(['GET', 'POST'])
    def salute(request):
        if request.method == 'POST':
            return Response({"message": "Got some data!", "data": request.data})
        return Response({"message": "Hello, world!"})

    @api_view(['POST'])
    def AssignTask(request):
        obj_task = get_object_or_404(Tasks, pk=request.data['task_id'])  # task_id(task.id)
        obj_user = get_object_or_404(Users, id=request.data['user_id'])  # user_id(user.id => manager or user)

        if obj_user.type_user == 2:  # manager
            obj_task.assigned_manager_id = obj_user.id

        if obj_user.type_user == 3:  # user
            obj_task.assigned_user_id = obj_user.id

        obj_task.save()

        if obj_user.type_user == 3:  # user
            tsk_path = '%s%s%s%s%s' % (settings.MEDIA_ROOT, '/user_data/', obj_user.user_id, '/', obj_task.task_id)
            if not os.path.exists(tsk_path + '/data'):
                os.makedirs(tsk_path + '/data')

                for item in obj_task.tasks_items.all():
                    filename = item.tds_key.split('/')[-1]
                    src = settings.MEDIA_ROOT + item.tds_key
                    dst = tsk_path + '/data/' + filename
                    copyfile(src, dst)

                meta = tsk_path + '/meta'
                if not os.path.exists(meta):
                    os.makedirs(meta)

        return Response({
            "task": TasksSerializer(obj_task).data
        })

    @api_view(['POST'])
    def UnAssignTaskToManager(request):
        obj_task = get_object_or_404(Tasks, pk=request.data['task_id'])  # task_id(task.id)

        if obj_task.assigned_manager_id:
            if obj_task.assigned_user_id:
                obj_user = get_object_or_404(Users, id=obj_task.assigned_manager_id)
                tsk_path = '%s%s%s%s%s' % (settings.MEDIA_ROOT, '/user_data/', obj_user.user_id, '/', obj_task.task_id)

                if os.path.exists(tsk_path):
                    shutil.rmtree(tsk_path)
                obj_task.assigned_user_id = None
                obj_task.ncompleted = 0
                obj_task.data = ''

                tika_score.objects.filter(task_id=obj_task.task_id).delete()
                nasa_tlx.objects.filter(task_id=obj_task.task_id).delete()
                ts_tool_metrics.objects.filter(task_id=obj_task.task_id).delete()

            obj_task.assigned_manager_id = None
            obj_task.save()

        return Response({
            "task": TasksSerializer(obj_task).data
        })

    @api_view(['POST'])
    def UnAssignTaskToUser(request):
        obj_tasks = Tasks.objects.filter(pk__in=request.data['taskids'])  # task_id(task.id)
        for obj_task in obj_tasks:
            if obj_task.assigned_user_id != None:
                obj_user = get_object_or_404(Users, id=obj_task.assigned_user_id)
                tsk_path = '%s%s%s%s%s' % (settings.MEDIA_ROOT, '/user_data/', obj_user.user_id, '/', obj_task.task_id)

                if os.path.exists(tsk_path):
                    shutil.rmtree(tsk_path)
                obj_task.assigned_user_id = None

                obj_task.ncompleted = 0
                obj_task.data = ''

                tika_score.objects.filter(task_id=obj_task.task_id).delete()
                nasa_tlx.objects.filter(task_id=obj_task.task_id).delete()
                ts_tool_metrics.objects.filter(task_id=obj_task.task_id).delete()
                obj_task.save()

        return Response({
            "res": "success"
        })

    @api_view(['POST'])
    def ResetTask(request):
        obj_task = get_object_or_404(Tasks, pk=request.data['task_id'])  # task_id(task.id)
        obj_user = get_object_or_404(Users, id=obj_task.assigned_user_id)
        obj_task.ncompleted = 0
        obj_task.data = None
        obj_task.status = 1
        obj_task.save()

        tsk_path = '%s%s%s%s%s%s' % (
            settings.MEDIA_ROOT,
            '/user_data/',
            obj_user.user_id,
            '/',
            obj_task.task_id,
            '/meta/'
        )

        for file in os.listdir(tsk_path):
            file_path = os.path.join(tsk_path, file)
            if os.path.isfile(file_path):
                os.unlink(file_path)

        tika_score.objects.filter(task_id=obj_task.task_id).delete()
        nasa_tlx.objects.filter(task_id=obj_task.task_id).delete()
        ts_tool_metrics.objects.filter(task_id=obj_task.task_id).delete()

        return Response({
            "task": TasksSerializer(obj_task).data
        })

    @api_view(['POST'])
    def GetUserTasks(request):  # return all tasks per user(manager or user)
        obj_user = get_object_or_404(Users, id=request.data['user_id'])  # user_id(user.id => manager or user)
        print(request.data['user_id'])
        if obj_user.type_user == 2:  # manager
            all_tasks = Tasks.objects.filter(assigned_manager_id=obj_user.id)

        if obj_user.type_user == 3:  # user
            all_tasks = Tasks.objects.filter(assigned_user_id=obj_user.id)

        tasks_serializer = TasksSerializer(all_tasks, many=True)
        return Response(tasks_serializer.data)

    @api_view(['POST'])
    def RelinquishTask(request):
        obj_task = get_object_or_404(Tasks, pk=request.data['task_id'])  # task_id(task.id)

        tsk_path = '%s%s%s%s%s' % (
            settings.MEDIA_ROOT,
            '/user_data/',
            obj_task.assigned_user_id,
            '/',
            obj_task.task_id
        )
        obj_task.assigned_user = None
        obj_task.status = 1
        obj_task.data = None
        obj_task.save()

        if os.path.exists(tsk_path):
            shutil.rmtree(tsk_path)

        tika_score.objects.filter(task_id=obj_task.task_id).delete()
        nasa_tlx.objects.filter(task_id=obj_task.task_id).delete()
        ts_tool_metrics.objects.filter(task_id=obj_task.task_id).delete()

        return Response({
            "task": TasksSerializer(obj_task).data
        })

    @api_view(['POST'])
    def CompleteTask(request):
        # obj_task = get_object_or_404(Tasks, pk=request.data['task_id'])  # task_id(task.id)
        obj_tasks = Tasks.objects.filter(pk__in=request.data['taskids'])

        for obj_task in obj_tasks:
            if obj_task.nitems == obj_task.ncompleted and obj_task.status != 4:
                obj_task.status = 2
                obj_task.save()

        return Response({
            "task": "success"
        })

    @api_view(['POST'])
    def GetTask(request):
        pk = request.data['task_pk']
        is_dk = request.POST.get('is_dk', None)
        obj_task = get_object_or_404(Tasks, pk=pk)
        user_id = obj_task.assigned_user.user_id

        if is_dk:
            int_project_id = Tasks.objects.get(pk=pk).project_id
            string_project_id = Projects.objects.get(id=int_project_id).project_id
            base_path = settings.MEDIA_ROOT + '/project_data/' + string_project_id + '/dk/data/'
            base_url = request.build_absolute_uri(
                settings.MEDIA_URL + '/project_data/' + string_project_id + '/dk/data/')
            image = [base_url + f for f in listdir(base_path) if isfile(join(base_path, f))]
            no_of_repetion = 1
            demo_all_file_list = []

            for demo_file in image:
                no = random.randint(1, no_of_repetion)
                for i in range(0, no):
                    demo_all_file_list.append(demo_file)

            random.shuffle(demo_all_file_list)
            image = demo_all_file_list

            if 'img_tools_all_files_dk' not in request.session:
                request.session['img_tools_all_files_dk'] = image
            if 'img_tools_given_dk' not in request.session:
                request.session['img_tools_given_dk'] = [''] * len(demo_all_file_list)

            base_path_annotation = settings.MEDIA_ROOT + '/project_data/' + string_project_id + '/dk/meta/'
            if not os.path.exists(base_path_annotation):
                os.mkdir(base_path_annotation)
            annotation_dictionary = {}
            all_annotation = listdir(base_path_annotation)

            if len(all_annotation) > 0:
                for annotation in all_annotation:
                    with open(base_path_annotation + '/' + annotation) as json_data:
                        data = json.load(json_data)
                        annotation_dictionary[data['annotation']['data_filename']] = data
            if 'img_tools_answers_dk' not in request.session:
                request.session['img_tools_answers_dk'] = annotation_dictionary

        else:
            # base_path = settings.MEDIA_ROOT + '/tasks/' + obj_task.task_id + '/data/'
            base_path = settings.MEDIA_ROOT + '/user_data/' + user_id + '/' + obj_task.task_id + '/data/'
            # base_url = settings.MEDIA_URL + '/tasks/' + obj_task.task_id + '/data/'
            base_url = request.build_absolute_uri(
                settings.MEDIA_URL + '/user_data/' + user_id + '/' + obj_task.task_id + '/data/')
            data_files_for_task = [
                base_url + f for f in listdir(base_path) if isfile(join(base_path, f))
            ]
            base_path_annotation = settings.MEDIA_ROOT + '/user_data/' + user_id + '/' + obj_task.task_id + '/meta/'
        if not os.path.exists(base_path_annotation):
            os.mkdir(base_path_annotation)
        annotation_dictionary = {}
        all_annotation = listdir(base_path_annotation)

        annotation_type = obj_task.project.annotation_type
        annotation_json_type = 1
        if len(all_annotation) > 0:
            for annotation in all_annotation:
                with open(base_path_annotation + '/' + annotation) as data_file:
                    if annotation_type == annotation_json_type: #JSON
                        data = json.load(data_file)
                    else: #XML
                        data = xmltodict.parse(data_file.read()) #XML to JSON
                    annotation_dictionary[data['annotation']['data_filename']] = data

        menus_disabled = []
        selected_tags = []
        for obj in range(obj_task.nitems):
            dic = {}
            selected_tags.append('')
            for label in obj_task.project.labels.split(','):
                dic[label] = False
            menus_disabled.append(dic)

        project_task_type_int = Projects.objects.get(id=obj_task.project_id).task_type

        data = {}
        if project_task_type_int == 1:
            if is_dk:
                data = {
                    'images': image,
                    'menus_disabled': menus_disabled,
                    'selected_tags': selected_tags,
                    'annotation_dictionary': annotation_dictionary
                }
            else:
                data = {
                    'images': data_files_for_task,
                    'menus_disabled': menus_disabled,
                    'selected_tags': selected_tags,
                    'annotation_dictionary': annotation_dictionary
                }
        elif project_task_type_int == 5:
            if is_dk:
                data = {
                    'images': image,
                    'menus_disabled': menus_disabled,
                    'selected_tags': selected_tags,
                    'annotation_dictionary': annotation_dictionary
                }
            else:
                data = {
                    'images': data_files_for_task,
                    'menus_disabled': menus_disabled,
                    'selected_tags': selected_tags,
                    'annotation_dictionary': annotation_dictionary
                }
        elif project_task_type_int == 6:
            if is_dk:
                data = {
                    'images': image,
                    'menus_disabled': menus_disabled,
                    'selected_tags': selected_tags,
                    'annotation_dictionary': annotation_dictionary
                }
            else:
                data = {
                    'images': data_files_for_task,
                    'menus_disabled': menus_disabled,
                    'selected_tags': selected_tags,
                    'annotation_dictionary': annotation_dictionary
                }
        elif project_task_type_int == 2:
            if not obj_task.data:
                data = {
                    'images': data_files_for_task,
                    'menus_disabled': menus_disabled,
                    'selected_tags': selected_tags
                }
            else:
                # data = obj_task.data
                data = json.loads(obj_task.data)
        elif project_task_type_int == 3:
            if not obj_task.data:
                data = {
                    'texts': data_files_for_task,
                    'menus_disabled': menus_disabled,
                    'selected_tags': selected_tags
                }
            else:
                data = json.loads(obj_task.data)
        elif project_task_type_int == 4:
            if not obj_task.data:
                data = {
                    'audios': data_files_for_task,
                    'menus_disabled': menus_disabled,
                    'selected_tags': selected_tags
                }
                # data = json.loads(data)
            else:
                data = json.loads(obj_task.data)

        return Response(data)

    @api_view(['POST'])
    def SaveDataTask(request):
        data = {}
        errors = []
        pk = request.data.get('pk', None)
        data_task = request.data.get('data_task', None)
        items_solved = request.data.get('items_solved', None)
        nclicks = request.data.get('nclicks', None)
        hover_time = request.data.get('hover_time', None)
        completion_time = request.data.get('completion_time', None)
        url_value = request.data.get('url_value', None)
        notAnnotating = request.data.get('notAnnotating', None)
        reset = request.data.get('reset', None)

        if reset:  # Du edited 2019-10-05
            reset = int(reset)
        if notAnnotating:
            notAnnotating = int(notAnnotating)

        head, filename = os.path.split(url_value)
        obj_task = get_object_or_404(Tasks, pk=pk)

        user_id = get_object_or_404(Users, pk=obj_task.assigned_user_id).user_id
        check_user_id = user_id
        check_task_id = obj_task.task_id
        exist = ts_tool_metrics.objects.filter(task_id=check_task_id, user_id=check_user_id, filename=filename).count()

        if exist > 0:
            obj = ts_tool_metrics.objects.get(task_id=check_task_id, user_id=check_user_id, filename=filename)
            obj.hover_time.append(hover_time)
            obj.completion_time.append(completion_time)
            obj.nclicks.append(nclicks)
            obj.save()
        else:
            obj = ts_tool_metrics(task_id=check_task_id, user_id=check_user_id, filename=filename)
            obj.hover_time = [hover_time]
            obj.completion_time = [completion_time]
            obj.nclicks = [nclicks]
            obj.save()

        if not pk:
            errors.append({
                'field': 'pk', 'error': 'This field is required'
            })
        else:
            obj_task = get_object_or_404(Tasks, pk=pk)
            user_id = get_object_or_404(Users, pk=obj_task.assigned_user_id).user_id
            project_task_type_int = Projects.objects.get(id=obj_task.project_id).task_type

        if not items_solved:
            errors.append({
                'field': 'items_solved', 'error': 'This field is required'
            })

        if not data_task:
            errors.append({
                'field': 'data_task', 'error': 'This field is required'
            })

        if errors:
            data['changes'] = 0
            data['errors'] = errors
            return Response(data)

        tsk_path = '%s%s%s%s%s%s' % (
            settings.MEDIA_ROOT,
            '/user_data/',
            user_id,
            '/',
            obj_task.task_id,
            '/meta/'
        )
        obj_task.data = data_task
        d = json.loads(obj_task.data)
        selected_tags = d['selected_tags']

        annotation_json_type = 1
        if project_task_type_int == 2:
            images = []
            for index, image in enumerate(d['images']):
                images.append(image.split('/')[-1])

            if selected_tags[int(items_solved) - 1] != '' or notAnnotating == 1:
                json_file = {
                    "annotation": {
                        "data_filename": images[int(items_solved) - 1],
                        "data_type": "image",
                        "data_annotation": {
                            "classification_label": selected_tags[int(items_solved) - 1]
                        }
                    }
                }
                if notAnnotating == 1:
                    json_file = {
                        "annotation": {
                            "data_filename": images[int(items_solved) - 1],
                            "data_type": "image",
                            "data_annotation": {}
                        }
                    }

                if obj_task.project.annotation_type == annotation_json_type:#JSON
                    with open(tsk_path + os.path.splitext(images[int(items_solved) - 1])[0] + '.json', 'w') as outfile:
                        json.dump(json_file, outfile)
                else: #XML
                    xmldata = xmltodict.unparse(json_file)
                    with open(tsk_path + os.path.splitext(images[int(items_solved) - 1])[0] + '.xml', 'w') as outfile:
                        outfile.write(xmldata)
            else:
                if os.path.exists(tsk_path + os.path.splitext(images[int(items_solved) - 1])[0] + '.json'):
                    os.remove(tsk_path + os.path.splitext(images[int(items_solved) - 1])[0] + '.json')
                if os.path.exists(tsk_path + os.path.splitext(images[int(items_solved) - 1])[0] + '.xml'):
                    os.remove(tsk_path + os.path.splitext(images[int(items_solved) - 1])[0] + '.xml')

        elif project_task_type_int == 3:
            texts = []
            for index, text in enumerate(d['texts']):
                texts.append(text.split('/')[-1])

            if selected_tags[int(items_solved) - 1] != '' or notAnnotating == 1:
                json_file = {
                    "annotation": {
                        "data_filename": texts[int(items_solved) - 1],
                        "data_type": "text",
                        "data_annotation": {
                            "classification_label": selected_tags[int(items_solved) - 1]
                        }
                    }
                }
                if notAnnotating == 1:
                    json_file = {
                        "annotation": {
                            "data_filename": texts[int(items_solved) - 1],
                            "data_type": "text",
                            "data_annotation": {}
                        }
                    }

                if obj_task.project.annotation_type == annotation_json_type:
                    # JSON
                    with open(tsk_path + os.path.splitext(texts[int(items_solved) - 1])[0] + '.json', 'w') as outfile:
                        json.dump(json_file, outfile)
                else:#XML
                    xmldata = xmltodict.unparse(json_file)
                    with open(tsk_path + os.path.splitext(texts[int(items_solved) - 1])[0] + '.xml', 'w') as outfile:
                        outfile.write(xmldata)
            else:
                if os.path.exists(tsk_path + os.path.splitext(texts[int(items_solved) - 1])[0] + '.json'):
                    os.remove(tsk_path + os.path.splitext(texts[int(items_solved) - 1])[0] + '.json')
                elif os.path.exists(tsk_path + os.path.splitext(texts[int(items_solved) - 1])[0] + '.xml'):
                    os.remove(tsk_path + os.path.splitext(texts[int(items_solved) - 1])[0] + '.xml')
        elif project_task_type_int == 4:
            audios = []
            for index, audio in enumerate(d['audios']):
                audios.append(audio.split('/')[-1])

            if selected_tags[int(items_solved) - 1] != '' or notAnnotating == 1:
                json_file = {
                    "annotation": {
                        "data_filename": audios[int(items_solved) - 1],
                        "data_type": "audio",
                        "data_annotation": {
                            "classification_label": selected_tags[int(items_solved) - 1]
                        }
                    }
                }
                if notAnnotating == 1:
                    json_file = {
                        "annotation": {
                            "data_filename": audios[int(items_solved) - 1],
                            "data_type": "audio",
                            "data_annotation": {}
                        }
                    }
                if obj_task.project.annotation_type == annotation_json_type:
                    # JSON
                    with open(tsk_path + os.path.splitext(audios[int(items_solved) - 1])[0] + '.json', 'w') as outfile:
                        json.dump(json_file, outfile)

                else: #XML
                    xmldata = xmltodict.unparse(json_file)
                    with open(tsk_path + os.path.splitext(audios[int(items_solved) - 1])[0] + '.xml', 'w') as outfile:
                        outfile.write(xmldata)
            else:
                if os.path.exists(tsk_path + os.path.splitext(audios[int(items_solved) - 1])[0] + '.json'):
                    os.remove(tsk_path + os.path.splitext(audios[int(items_solved) - 1])[0] + '.json')
                elif os.path.exists(tsk_path + os.path.splitext(audios[int(items_solved) - 1])[0] + '.xml'):
                    os.remove(tsk_path + os.path.splitext(audios[int(items_solved) - 1])[0] + '.xml')

        obj_task.ncompleted = len(os.listdir(tsk_path))
        obj_task.status = 1
        obj_task.save()

        data['task_complete'] = 0
        # if obj_task.nitems == len(os.listdir(tsk_path)):
        #     CompleteTaskFromItem(request, obj_task.pk)
        #     data['task_complete'] = 1

        data['changes'] = 1

        return Response(data)

    @api_view(['POST'])
    def ConvertToText(request):
        data = {}
        data['success_flag'] = 1
        current_url = request.data['current_url']
        process = requests.get(current_url)
        data['current_url'] = current_url
        data['text_data'] = process.text
        return Response(data)

    @api_view(['POST'])
    def SaveImgDataTask(request):
        data = {}
        is_completed = 0
        is_end = 0
        errors = []
        pk = request.data.get('pk', None)
        items_solved = request.data.get('items_solved', None)
        item_name = request.data.get('item_name', None)
        data_task = request.data.get('data_task', None)
        reset_flag = request.data.get('reset_flag', None)
        notAnnotating = request.data.get('notAnnotating', None)
        # print(data_task)
        if notAnnotating is not None:
            notAnnotating = int(notAnnotating)

        json_dictionary = json.loads(data_task)

        if not pk:
            errors.append({
                'field': 'pk', 'error': 'This field is required'
            })
        else:
            obj_task = get_object_or_404(Tasks, pk=pk)

            user_id = get_object_or_404(Users, pk=obj_task.assigned_user_id).user_id
            project_task_type_int = Projects.objects.get(id=obj_task.project_id).task_type

        if not items_solved:
            errors.append({
                'field': 'items_solved', 'error': 'This field is required'
            })

        if not item_name:
            errors.append({
                'field': 'item_name', 'error': 'This field is required'
            })
        if not data_task:
            errors.append({
                'field': 'data_task', 'error': 'This field is required'
            })

        if errors:
            data['changes'] = 0
            data['errors'] = errors
            return HttpResponse(
                json.dumps(data), content_type='application/json'
            )

        tsk_path = '%s%s%s%s%s%s' % (
            settings.MEDIA_ROOT,
            '/user_data/',
            user_id,
            '/',
            obj_task.task_id,
            '/meta/'
        )
        annotation_json_type = 1 #annotation json type
        if project_task_type_int == 1: #image boundingbox
            item_filename = json_dictionary[item_name]['filename']
            rectangle_objects = json_dictionary[item_name]['rectangle_objects']
            polygon_objects = json_dictionary[item_name]['polygon_objects']

            polygon_list = []
            rectangle_list = []

            for polygon in polygon_objects:
                single_properties = polygon['shape_properties']
                polygon_list.append(single_properties)

            for rectangle in rectangle_objects:
                single_rectangle = {}
                point_list = []
                shape_properties = rectangle['shape_properties']
                x = int(shape_properties['x'])
                y = int(shape_properties['y'])
                width = int(shape_properties['width'])
                height = int(shape_properties['height'])
                label = shape_properties['classification_label']
                single_rectangle['classification_label'] = label

                point_1 = str(x) + "," + str(y)
                point_2 = str(x + width) + "," + str(y + height)
                point_list.append(point_1)
                point_list.append(point_2)

                single_rectangle['point_2D'] = point_list
                rectangle_list.append(single_rectangle)

            json_file = {
                "annotation": {
                    "data_filename": item_filename,
                    "data_type": "image",
                    "data_annotation": {
                        "bounding_polygon": polygon_list,
                        "bounding_box": rectangle_list,
                    }
                }
            }

            if notAnnotating == 1:
                json_file = {
                    "annotation": {
                        "data_filename": item_filename,
                        "data_type": "image",
                        "data_annotation": {}
                    }
                }

            if obj_task.project.annotation_type == annotation_json_type:
                if True:  # (len(polygon_list) > 0 or  len(rectangle_list)>0): XXX: if annotations were removed, update also
                    annotation_filename = os.path.splitext(os.path.basename(item_name))[0]
                    with open(tsk_path + annotation_filename + '.json', 'w') as outfile:
                        json.dump(json_file, outfile)

                if notAnnotating == 1:
                    annotation_filename = os.path.splitext(os.path.basename(item_name))[0]
                    with open(tsk_path + annotation_filename + '.json', 'w') as outfile:
                        json.dump(json_file, outfile)

                if reset_flag == '1':
                    annotation_filename = os.path.splitext(os.path.basename(item_name))[0]
                    if os.path.exists(tsk_path + annotation_filename + '.json'):
                        os.remove(tsk_path + annotation_filename + '.json')
            else:
                annotation_filename = os.path.splitext(os.path.basename(item_name))[0]
                xmldata = xmltodict.unparse(json_file)
                with open(tsk_path + annotation_filename + '.xml', 'w') as outfile:
                    outfile.write(xmldata)

                if reset_flag == '1':
                    annotation_filename = os.path.splitext(os.path.basename(item_name))[0]
                    if os.path.exists(tsk_path + annotation_filename + '.xml'):
                        os.remove(tsk_path + annotation_filename + '.xml')

        elif project_task_type_int == 5: #image Marker
            item_filename = json_dictionary[item_name]['filename']
            marker_objects = json_dictionary[item_name]['marker_objects']
            marker_list = []

            for marker in marker_objects:
                single_marker = {}
                single_marker['classification_label'] = marker['label']
                x_cor = marker['XPos']
                y_pos = marker['YPos']

                point_2D = str(x_cor) + ',' + str(y_pos)
                single_marker['point_2D'] = point_2D
                marker_list.append(single_marker)

            json_file = {
                "annotation": {
                    "data_filename": item_filename,
                    "data_type": "image",
                    "data_annotation": {
                        "marker": marker_list
                    }
                }
            }

            if notAnnotating == 1:
                json_file = {
                    "annotation": {
                        "data_filename": item_filename,
                        "data_type": "image",
                        "data_annotation": {}
                    }
                }

            if obj_task.project.annotation_type == annotation_json_type:#JSON
                if (len(marker_list) > 0):
                    annotation_filename = os.path.splitext(os.path.basename(item_name))[0]
                    with open(tsk_path + annotation_filename + '.json', 'w') as outfile:
                        json.dump(json_file, outfile)

                if (notAnnotating == 1):
                    annotation_filename = os.path.splitext(os.path.basename(item_name))[0]
                    with open(tsk_path + annotation_filename + '.json', 'w') as outfile:
                        json.dump(json_file, outfile)

                if reset_flag == '1':
                    annotation_filename = os.path.splitext(os.path.basename(item_name))[0]
                    if os.path.exists(tsk_path + annotation_filename + '.json'):
                        os.remove(tsk_path + annotation_filename + '.json')
            else:#XML
                annotation_filename = os.path.splitext(os.path.basename(item_name))[0]
                xmldata = xmltodict.unparse(json_file)
                with open(tsk_path + annotation_filename + '.xml', 'w') as outfile:
                    outfile.write(xmldata)

                if reset_flag == '1':
                    annotation_filename = os.path.splitext(os.path.basename(item_name))[0]
                    if os.path.exists(tsk_path + annotation_filename + '.xml'):
                        os.remove(tsk_path + annotation_filename + '.xml')

        elif project_task_type_int == 6: #image Marker
            item_filename = json_dictionary[item_name]['filename']
            semantic_objects = json_dictionary[item_name]['semantic_objects']
            semantic_list = []

            for semantic in semantic_objects:
                # single_marker = {}
                # single_marker['classification_label'] = marker['label']
                # single_marker
                # x_cor = marker['XPos']
                # y_pos = marker['YPos']
                #
                # point_2D = str(x_cor) + ',' + str(y_pos)
                # single_marker['point_2D'] = point_2D
                semantic_list.append(semantic)

            json_file = {
                "annotation": {
                    "data_filename": item_filename,
                    "data_type": "image",
                    "data_annotation": {
                        "semantic": semantic_list
                    }
                }
            }

            if notAnnotating == 1:
                json_file = {
                    "annotation": {
                        "data_filename": item_filename,
                        "data_type": "image",
                        "data_annotation": {}
                    }
                }

            if obj_task.project.annotation_type == annotation_json_type:#JSON
                if (len(semantic_list) > 0):
                    annotation_filename = os.path.splitext(os.path.basename(item_name))[0]
                    with open(tsk_path + annotation_filename + '.json', 'w') as outfile:
                        json.dump(json_file, outfile)

                if (notAnnotating == 1):
                    annotation_filename = os.path.splitext(os.path.basename(item_name))[0]
                    with open(tsk_path + annotation_filename + '.json', 'w') as outfile:
                        json.dump(json_file, outfile)

                if reset_flag == '1':
                    annotation_filename = os.path.splitext(os.path.basename(item_name))[0]
                    if os.path.exists(tsk_path + annotation_filename + '.json'):
                        os.remove(tsk_path + annotation_filename + '.json')
            else:#XML
                annotation_filename = os.path.splitext(os.path.basename(item_name))[0]
                xmldata = xmltodict.unparse(json_file)
                with open(tsk_path + annotation_filename + '.xml', 'w') as outfile:
                    outfile.write(xmldata)

                if reset_flag == '1':
                    annotation_filename = os.path.splitext(os.path.basename(item_name))[0]
                    if os.path.exists(tsk_path + annotation_filename + '.xml'):
                        os.remove(tsk_path + annotation_filename + '.xml')

        annotation_dictionary = {}
        all_annotation = listdir(tsk_path)
        if len(all_annotation) > 0:
            for annotation in all_annotation:
                if obj_task.project.annotation_type == annotation_json_type:
                    with open(tsk_path + annotation) as json_data:
                        coordinates = json.load(json_data)
                else:
                    with open(tsk_path + annotation) as xml_data:
                        coordinates = xmltodict.parse(xml_data.read())
                annotation_dictionary[coordinates['annotation']['data_filename']] = coordinates
        data['recent_annotation'] = annotation_dictionary
        list_anno_files = os.listdir(tsk_path)
        obj_task.data = data_task # readable if not json_dictionary
        obj_task.ncompleted = len(list_anno_files)
        obj_task.status = 1
        obj_task.save()

        return Response(data)


def CompleteTaskFromItem(request, pk):
    obj_task = get_object_or_404(Tasks, pk=pk)
    obj_task.status = 2
    obj_task.save()
    return


class TasksViewSet(viewsets.ModelViewSet):
    serializer_class = TasksSerializer
    queryset = Tasks.objects.all()

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = serializer.validated_data

        errors = []
        project = task['project']
        exist_tasks = Tasks.objects.filter(project_id=project).count()

        if exist_tasks > 0:
            errors.append({"error": "Task Already created for this Project"})
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        number_of_tasks = request.data['number_of_tasks']
        repeatability = request.data['repeatability']
        default_tika_score_switch = request.data['tika_score_flag']
        obj_project = get_object_or_404(Projects, pk=project.id)

        base_items = '/project_data/' + str(obj_project.project_id) + '/data/'
        prj_path = settings.MEDIA_ROOT + base_items

        items_list = []
        for item in os.listdir(prj_path):
            item_path = os.path.join(prj_path, item)
            if os.path.isfile(item_path):
                items_list.append(os.path.join(base_items, item))

        task_ids = []
        for task in range(0, int(number_of_tasks)):
            task_id = None
            while not task_id:
                task_id = 'tsk' + generate_characters(5)
                try:
                    Tasks.objects.get(task_id=task_id)
                    task_id = None
                except:
                    task_ids.append(task_id)

        items_by_folder = math.ceil(obj_project.main_nitems / int(number_of_tasks))
        duplicate_images = math.ceil(items_by_folder * (int(repeatability) / 100))

        ranges_list = []
        index = 0

        numbers = range(0, obj_project.main_nitems)
        task = 0
        while (index < obj_project.main_nitems - 1):
            next_index = index + (items_by_folder - 1)
            if next_index > obj_project.main_nitems - 1:
                next_index = obj_project.main_nitems - 1

            duplicated_items = []
            while (len(duplicated_items) < duplicate_images):
                r = random.choice(numbers)
                if r not in range(index, next_index) and r not in duplicated_items:
                    duplicated_items.append(r)

            obj_task = Tasks()
            obj_task.task_id = task_ids[task]
            obj_task.project = obj_project
            obj_task.nitems = (next_index - index + 1) + duplicate_images
            obj_task.status = 1
            obj_task.tika_score_flag = int(default_tika_score_switch)
            obj_task.save()

            for item in items_list[index:next_index + 1]:
                obj_item = Items()
                obj_item.task = obj_task
                obj_item.tds_key = item
                # added for file info
                obj_item.file_info = get_object_or_404(FileInfo, project_id=obj_project,
                                                       file_name=os.path.basename(item))
                obj_item.save()

            for item in duplicated_items:
                obj_item = Items()
                obj_item.task = obj_task
                obj_item.tds_key = items_list[item]
                # added for file info
                obj_item.file_info = get_object_or_404(FileInfo, project_id=obj_project,
                                                       file_name=os.path.basename(items_list[item]))
                obj_item.save()

            task = task + 1
            index = next_index + 1

        return Response({
            "task": TasksSerializer(obj_task, context=self.get_serializer_context()).data
        })

    def destroy(self, request, pk=None):
        project_id = self.kwargs.get('pk')
        obj_tasks = Tasks.objects.filter(project_id=project_id)

        for task in obj_tasks:
            if task.assigned_user_id:
                user_id = get_object_or_404(Users, id=task.assigned_user_id)
                path_for_delete_task = settings.MEDIA_ROOT + '/user_data/' + str(user_id) + '/' + str(task.task_id)

                if os.path.exists(path_for_delete_task):
                    shutil.rmtree(path_for_delete_task)
                tika_score.objects.filter(task_id=task.task_id).delete()
                nasa_tlx.objects.filter(task_id=task.task_id).delete()
                ts_tool_metrics.objects.filter(task_id=task.task_id).delete()

        obj_tasks.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
