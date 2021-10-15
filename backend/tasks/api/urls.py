from tasks.api.views import TasksViewSet, TasksApiView, managerDashboardData, resetResult, resetImageResult, rejectTask, deliveryTask
from rest_framework.routers import DefaultRouter
from django.urls import path, include

router = DefaultRouter()
router.register(r'', TasksViewSet, basename='tasks')

#urlpatterns = router.urls
urlpatterns = [

    path('assign-task', TasksApiView.AssignTask),
    path('unassign-manager', TasksApiView.UnAssignTaskToManager),
    path('unassign-user', TasksApiView.UnAssignTaskToUser),
    path('reset-task', TasksApiView.ResetTask),
    path('get-all', TasksApiView.GetUserTasks),
    path('get-task', TasksApiView.GetTask),
    path('save-data', TasksApiView.SaveDataTask),
    path('save-img-data', TasksApiView.SaveImgDataTask),
    path('url-to-text', TasksApiView.ConvertToText),
    path('relinquish-task', TasksApiView.RelinquishTask),
    path('complete-task', TasksApiView.CompleteTask),
    path('manager-dashboard', managerDashboardData),
    path('resetText/', resetResult),
    path('resetImage/', resetImageResult),
    path('reject/', rejectTask),
    path('delivery/', deliveryTask),

    path('', include(router.urls)),
]