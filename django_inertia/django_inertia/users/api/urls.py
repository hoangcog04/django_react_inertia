from django.urls import include
from django.urls import path

from django_inertia.users.api.views import PermissionBulkApi
from django_inertia.users.api.views import PermissionDeleteApi
from django_inertia.users.api.views import PermissionDetailApi
from django_inertia.users.api.views import PermissionListApi
from django_inertia.users.api.views import PermissionSaveApi
from django_inertia.users.api.views import UserCatalogueBulkApi
from django_inertia.users.api.views import UserCatalogueDeleteApi
from django_inertia.users.api.views import UserCatalogueDetailApi
from django_inertia.users.api.views import UserCatalogueListApi
from django_inertia.users.api.views import UserCatalogueSaveApi
from django_inertia.users.api.views import UserListApi

app_name = "users"
# https://github.com/HackSoftware/Django-Styleguide?tab=readme-ov-file#urls
urlpatterns = [
    path(
        "user_catalogue/",
        include(
            [
                path("save/", UserCatalogueSaveApi.as_view()),
                path("<int:user_catalogue_id>/save/", UserCatalogueSaveApi.as_view()),
                path("<int:user_catalogue_id>/get/", UserCatalogueDetailApi.as_view()),
                path(
                    "<int:user_catalogue_id>/delete/",
                    UserCatalogueDeleteApi.as_view(),
                ),
                path("", UserCatalogueListApi.as_view()),
                path("bulk/", UserCatalogueBulkApi.as_view()),
            ],
        ),
    ),
    path(
        "users/",
        include(
            [
                path("", UserListApi.as_view()),
            ],
        ),
    ),
    path(
        "permission/",
        include(
            [
                path("save/", PermissionSaveApi.as_view()),
                path("<int:permission_id>/save/", PermissionSaveApi.as_view()),
                path("<int:permission_id>/get/", PermissionDetailApi.as_view()),
                path(
                    "<int:permission_id>/delete/",
                    PermissionDeleteApi.as_view(),
                ),
                path("", PermissionListApi.as_view()),
                path("bulk/", PermissionBulkApi.as_view()),
            ],
        ),
    ),
]
