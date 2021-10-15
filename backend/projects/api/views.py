from django.contrib.auth import get_user_model
from projects.models import Projects, FileInfo
from clients.models import Clients
from tasks.models import Tasks, Items, tika_score, nasa_tlx, ts_tool_metrics
from .serializers import ProjectsSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from utilities.functions import generate_characters
from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework.decorators import api_view
from datetime import datetime
from wsgiref.util import FileWrapper
from django.http import HttpResponse
import zipfile
import shutil
import os


@api_view(['GET'])
def getAllProject(request):
    projects = Projects.objects.all().order_by('id', 'name')
    respdata = []
    for project in projects:
        delivery = Tasks.objects.filter(project=project, status=4).count()
        tasks = Tasks.objects.filter(project=project).count()
        status = 0
        # print(delivery, tasks)
        if delivery == tasks and tasks != 0:
            status = 4
        else:
            status = 1

        respdata.append({
            "id": project.id,
            "name": project.name,
            "year": project.year,
            "data_type": project.data_type,
            "task_type": project.task_type,
            "labels": project.labels,
            "annotation_type": project.annotation_type,
            "main_nitems": project.main_nitems,
            "dk_nitems": project.dk_nitems,
            "number_of_tasks": project.number_of_tasks,
            "tika_score_flag": project.tika_score_flag,
            "project_id": project.project_id,
            "client": project.client_id,
            "deadline": project.deadline,
            "status": status,
        })

    return Response(respdata)


@api_view(['POST'])
def multiProjectDelete(request):
    ids = request.data.get('projectIds')
    projects = Projects.objects.filter(pk__in=ids)

    for project in projects:
        if project:
            # in clients table, modify no_of_projects
            obj_client = get_object_or_404(Clients, pk=project.client.id)
            project.delete()
            obj_client.no_of_projects = Projects.objects.filter(client=obj_client).count()
            obj_client.save()

    return Response({
        "res": "success"
    })


@api_view(['GET'])
def exportProject(request):
    files_path = os.path.join(settings.MEDIA_ROOT, 'archive_file')
    sCurdate = datetime.now().strftime('%Y%d%m%H%M%S')

    withData = '1'
    if 'withdata' in request.GET:
        withData = request.GET['withdata']

    print(withData)

    if 'prjid' in request.GET:
        prjid = request.GET['prjid']
        exportFileName = "exportProject_" + sCurdate
        project = Projects.objects.get(pk=prjid)

        delivery = Tasks.objects.filter(project=project, status=4).count()
        tasks = Tasks.objects.filter(project=project).count()

        if delivery != tasks or tasks == 0:
            return Response({"res": "success"})

        #if status is delivery ready...
        if project:
            # project info -> json
            data_type_switcher = {
                1: 'image', 
                2: 'text',
                3: 'audio'
            }
            sDataType = data_type_switcher.get(project.data_type, 'Invalid Data')

            task_type_switcher = {
                1: 'image boundbox',
                2: 'image classification',
                3: 'text classification',
                4: 'audio classification',
                5: 'image Marker',
                6: 'image semantic',
            }
            sTaskType = task_type_switcher.get(project.task_type, 'Invalid data')

            if not os.path.exists(files_path):
                os.mkdir(files_path)
            with open(os.path.join(files_path, "info.json"), "w") as f:
                f.write(
                    '{\n\t\'projectName\' : \'' + project.name + '\', \n\t\'projectID\' : \'' + project.project_id +
                    '\', \n\t\'client\' : \'' + str(project.client.name) +
                    '\', \n\t\'data type\' : \'' + sDataType + '\', \n\t\'task type\' : \'' + sTaskType +
                    '\', \n\t\'deadline\' : \'' + str(project.deadline) + '\'\n}')
                f.close()
            # getting task info
            tasks = Tasks.objects.filter(project=project)

            for task in tasks:
                if withData == '1':
                    path_data_target = os.path.join(files_path, 'data')
                    path_data_src = os.path.join(settings.MEDIA_ROOT,
                                                 'user_data/' + str(task.assigned_user.user_id) + '/'
                                                 + str(task.task_id) + '/data')
                    # data_taget path check
                    if not os.path.exists(path_data_target):
                        os.mkdir(path_data_target)
                    # if data src exists, copy
                    if os.path.exists(path_data_src):
                        try:
                            shutil.copytree(path_data_src, path_data_target)
                        except:
                            dataFiles = os.listdir(path_data_src)

                            for dataFile in dataFiles:
                                if not os.path.exists(os.path.join(path_data_target, dataFile)):
                                    shutil.copy(os.path.join(path_data_src, dataFile), path_data_target)

                # target file directory path
                path_meta_target = os.path.join(files_path, 'meta')
                # source file directory path
                path_meta_src = os.path.join(settings.MEDIA_ROOT,
                                             'user_data/' + str(task.assigned_user.user_id) + '/'
                                             + str(task.task_id) + '/meta')
                # meta taget path check
                if not os.path.exists(path_meta_target):
                    os.mkdir(path_meta_target)
                # if meta src exits, copy
                if os.path.exists(path_meta_src):
                    try:
                        shutil.copytree(path_meta_src, path_meta_target)
                    except:
                        dataFiles = os.listdir(path_meta_src)

                        for dataFile in dataFiles:
                            if not os.path.exists(os.path.join(path_meta_target, dataFile)):
                                shutil.copy(os.path.join(path_meta_src, dataFile), path_meta_target)

            # make zip file for specific project
            path_to_zip = shutil.make_archive(files_path, "zip", files_path)
            if os.path.exists(files_path):
                shutil.rmtree(files_path)

            # download zip via HTTPResponse
            response = HttpResponse(FileWrapper(
                open(path_to_zip, 'rb')), content_type='application/zip')
            response['Content-Disposition'] = 'attachment; filename="{filename}.zip"'.format(
                filename=exportFileName.replace(" ", "_")
            )
            return response

    return Response({"result": "failed"})
    # return Response({})


class ProjectsViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectsSerializer
    queryset = Projects.objects.all()

    def create(self, request):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project = serializer.validated_data

        # create project
        print("create")
        project_id = None
        while not project_id:
            project_id = 'prj' + generate_characters(5)
            try:
                Projects.objects.get(project_id=project_id)
                project_id = None
            except:
                pass
        project['project_id'] = project_id

        obj_project = Projects()
        obj_project.name = project['name']
        obj_project.client = project['client']
        obj_project.year = project['year']
        obj_project.deadline = project['deadline']
        obj_project.data_type = project['data_type']
        obj_project.task_type = project['task_type']
        obj_project.labels = project['labels']
        obj_project.annotation_type = project['annotation_type']
        obj_project.main_file = project['main_file']
        obj_project.dk_file = project['dk_file']
        obj_project.project_id = project_id
        obj_project.save()

        obj_client = get_object_or_404(Clients, pk=project['client'].id)
        obj_client.no_of_projects = Projects.objects.filter(client=obj_client).count()
        obj_client.save()

        zip_path = settings.MEDIA_ROOT + '/projects/' + str(project['main_file'])
        zip_file = zipfile.ZipFile(zip_path)

        zip_path_dk = settings.MEDIA_ROOT + '/projects/dk/' + str(project['dk_file'])
        zip_dk_file = zipfile.ZipFile(zip_path_dk)
        # for project storing
        items = 0
        destination_path = settings.MEDIA_ROOT + '/project_data/'
        file_info_object = []

        for main_file in zip_file.infolist():
            if not main_file.is_dir():
                items = items + 1
                # if zip file contains data folder
                if main_file.filename.startswith('data/'):
                    zip_file.extract(main_file, destination_path + project_id + '/')
                    file_info_object.append(
                        FileInfo(file_name=os.path.basename(main_file.filename), project_id=obj_project))
                else:
                    zip_file.extract(main_file, destination_path + project_id + '/data/')
                    file_info_object.append(
                        FileInfo(file_name=os.path.basename('data/' + main_file.filename), project_id=obj_project))

        obj_project.main_nitems = items

        # for dk storing
        dk_items = 0
        dk_destination_path = destination_path + project_id + '/dk/'
        if not os.path.exists(dk_destination_path):
            os.makedirs(dk_destination_path)

        for main_file in zip_dk_file.infolist():
            dk_items = dk_items + 1
            zip_dk_file.extract(main_file, dk_destination_path)

        dk_items = dk_items / 2
        obj_project.dk_nitems = dk_items

        obj_project.save()
        FileInfo.objects.bulk_create(file_info_object)

        return Response({
            "project": ProjectsSerializer(obj_project, context=self.get_serializer_context()).data
        })

    def update(self, request, pk=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project_sz = serializer.validated_data

        update_id = self.kwargs.get('pk')
        project = get_object_or_404(Projects, pk=update_id)

        if project:
            # get old data
            old_project = project
            old_main_file = project.main_file
            old_dk_file = project.dk_file
            project_id = project.project_id
            project_sz['project_id'] = project_id

            if 'main_file' in project_sz and 'dk_file' in project_sz:
                # fileinfo delete
                fileinfos = FileInfo.objects.filter(project_id=project)

                for fileinfo in fileinfos:
                    fileinfo.delete()

                # delete data zip file
                if os.path.exists(settings.MEDIA_ROOT + '/' + str(old_main_file)):
                    os.remove(settings.MEDIA_ROOT + '/' + str(old_main_file))

                # delete dk zip file
                if os.path.exists(settings.MEDIA_ROOT + '/' + str(old_dk_file)):
                    os.remove(settings.MEDIA_ROOT + '/' + str(old_dk_file))

                # delete project_data folder
                if os.path.exists(settings.MEDIA_ROOT + '/project_data/' + project_id + '/'):
                    shutil.rmtree(settings.MEDIA_ROOT + '/project_data/' + project_id)

                # create data zip file
                zip_path = settings.MEDIA_ROOT + '/projects/' + str(project_sz['main_file'])
                zip_file = zipfile.ZipFile(zip_path)

                # create dk zip file
                zip_path_dk = settings.MEDIA_ROOT + '/projects/dk/' + str(project_sz['dk_file'])
                zip_dk_file = zipfile.ZipFile(zip_path_dk)

                # for main file storing
                items = 0
                destination_path = settings.MEDIA_ROOT + '/project_data/'
                file_info_object = []

                for main_file in zip_file.infolist():
                    if not main_file.is_dir():
                        items = items + 1
                        # if zip file contains data folder
                        if main_file.filename.startswith('data/'):
                            zip_file.extract(main_file, destination_path + project.id + '/')
                            file_info_object.append(
                                FileInfo(file_name=os.path.basename(main_file.filename), project_id=project))
                        else:
                            zip_file.extract(main_file, destination_path + project_id + '/data/')
                            file_info_object.append(
                                FileInfo(file_name=os.path.basename('data/' + main_file.filename), project_id=project))

                # for dk file storing
                dk_items = 0
                dk_destination_path = destination_path + project_id + '/dk/'
                if not os.path.exists(dk_destination_path):
                    os.makedirs(dk_destination_path)

                for main_file in zip_dk_file.infolist():
                    dk_items = dk_items + 1
                    zip_dk_file.extract(main_file, dk_destination_path)
                dk_items = dk_items / 2

                # new file info create
                FileInfo.objects.bulk_create(file_info_object)

                # if new file is not same as old file, delete tasks of old project
                tasks = Tasks.objects.filter(project=old_project)
                for task in tasks:
                    task.delete()

                project.main_nitems = items
                project.dk_nitems = dk_items
                project.main_file = project_sz['main_file']
                project.dk_file = project_sz['dk_file']

            # data update
            project.name = project_sz['name']
            project.year = project_sz['year']
            project.deadline = project_sz['deadline']
            project.labels = project_sz['labels']
            project.annotation_type = project_sz['annotation_type']
            project.client = project_sz['client']

            project.save()

        return Response({"project": "success"})

    def destroy(self, request, pk=None):
        project_id = self.kwargs.get('pk')
        project = get_object_or_404(Projects, pk=project_id)

        obj_task = Tasks.objects.filter(project_id=project_id)
        for task_id in obj_task:
            if task_id.assigned_user_id is not None:  # get_user_model()
                user_id = get_object_or_404(get_user_model(), pk=task_id.assigned_user_id).user_id
                path_for_delete_task = settings.MEDIA_ROOT + '/user_data/' + str(user_id) + '/' + str(task_id.task_id)
                if os.path.exists(path_for_delete_task):
                    shutil.rmtree(path_for_delete_task)
                tika_score.objects.filter(task_id=task_id.task_id).delete()
                nasa_tlx.objects.filter(task_id=task_id.task_id).delete()
                ts_tool_metrics.objects.filter(task_id=task_id.task_id).delete()
        obj_task.delete()

        # delete main_file, dk_file
        main_file = settings.MEDIA_ROOT + '/' + project.main_file
        dk_file = settings.MEDIA_ROOT + '/' + project.dk_file

        if os.path.exists(main_file):
            os.remove(main_file)

        if os.path.exists(dk_file):
            os.remove(dk_file)

        # delete project data
        project_data_path = settings.MEDIA_ROOT + '/project_data/' + str(project.project_id)
        if os.path.exists(project_data_path):
            shutil.rmtree(project_data_path)

        obj_client = get_object_or_404(Clients, pk=project.client_id)
        obj_client.no_of_projects = obj_client.no_of_projects - 1
        obj_client.save()

        project.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
