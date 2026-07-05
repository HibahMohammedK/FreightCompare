from django.urls import path

from .views import (
    NotificationListView,
    MarkNotificationReadView,
    MarkAllNotificationsReadView,
    DeleteNotificationView,
    ClearNotificationsView
)

urlpatterns = [

    path("", NotificationListView.as_view(), ),
    path("<uuid:pk>/read/", MarkNotificationReadView.as_view(), ),
    path("read-all/", MarkAllNotificationsReadView.as_view(), ),
    path("<uuid:pk>/", DeleteNotificationView.as_view(),),
    path("clear/", ClearNotificationsView.as_view(),),

]