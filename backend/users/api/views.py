from users.models import Users
from .serializers import UsersSerializer
from rest_framework import viewsets
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from users.models import Users
from clients.models import Clients
from projects.models import Projects
from tasks.models import Tasks
from django.core.paginator import Paginator
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.conf import settings
import shutil
import os


@api_view(['POST'])
def multiDelete(request):
    userIds = request.data.get('userId')
    users = Users.objects.filter(pk__in=userIds)

    for user in users:
        if user:
            user.delete()

    return Response({
        "res": "success"
    })


@api_view(['GET'])
def adminDashboardData(request):
    resClients = []
    clients = Clients.objects.all()
    clicnt = 1
    for client in clients:
        if client:
            resClients.append({
                "num": clicnt,
                "id": client.id,
                "name": client.name,
            })
            clicnt += 1

    prjcnt = 1
    resProjects = []
    projects = Projects.objects.all()
    for project in projects:
        if project:
            resProjects.append({
                "num": prjcnt,
                "id": project.id,
                "name": project.name,
                "data_type": project.data_type
            })
            prjcnt += 1

    taskcnt = 1
    resTasklist = []
    tasklist = Tasks.objects.all()
    for task in tasklist:
        if task:
            resTasklist.append({
                "num": taskcnt,
                "id": task.id,
                "name": task.task_id,
                "project_name": task.project.name,
                "datatype": task.project.data_type,
                "items": task.nitems,
                "manager": str(task.assigned_manager)
            })
            taskcnt += 1

    return Response({
        "clients": resClients,
        "projects": resProjects,
        "tasklist": resTasklist,
    })


@api_view(['POST'])
def updateUser(request):
    userid = request.data['id']
    user = Users.objects.get(pk=userid)

    res = {"result": "failed"}
    if user:
        user.username = request.data['username']
        user.first_name = request.data['first_name']
        user.last_name = request.data['last_name']
        user.email = request.data['email']
        user.type_user = request.data['type_user']
        user.password = make_password(request.data['password'])
        user.save()

        res = {"result": "success"}

    return Response(res)


@api_view(['GET'])
def getCurrentClientData(request):
    page = request.GET.get('page')
    page_limit = request.GET.get('limit')

    resClients = []
    client_list = Clients.objects.all()
    paginator = Paginator(client_list, page_limit)

    clients = paginator.get_page(page)
    clicnt = 1
    for client in clients:
        if client:
            resClients.append({
                "num": clicnt,
                "id": client.id,
                "name": client.name,
            })
            clicnt += 1
    return Response({
        "clients": resClients,
        "totalRecords": len(client_list.values()),
        "pageLimit": int(page_limit),
    })


class UsersViewSet(viewsets.ModelViewSet):
    serializer_class = UsersSerializer
    queryset = Users.objects.all()

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        user['password'] = make_password(user['password'])
        user = serializer.save()
        print(user)
        return Response({
            "user": UsersSerializer(user, context=self.get_serializer_context()).data
        })

    def destroy(self, request, pk=None):
        user_id = self.kwargs.get('pk')
        user = get_object_or_404(Users, pk=user_id)

        user_data_path = settings.MEDIA_ROOT + '/user_data/' + str(user.user_id)
        if os.path.exists(user_data_path):
            shutil.rmtree(user_data_path)
        user.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
