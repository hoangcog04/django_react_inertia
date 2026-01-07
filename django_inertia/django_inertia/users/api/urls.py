from django.urls import include
from django.urls import path

from django_inertia.users.api.views import UserCatalogueDeleteApi
from django_inertia.users.api.views import UserCatalogueDetailApi
from django_inertia.users.api.views import UserCatalogueListApi
from django_inertia.users.api.views import UserCatalogueSaveApi
from django_inertia.users.api.views import UserCatalogueUpdateApi
from django_inertia.users.api.views import UserListApi

app_name = "users"
# https://github.com/HackSoftware/Django-Styleguide?tab=readme-ov-file#urls
urlpatterns = [
    path(
        "user_catalogue/",
        include(
            [
                path("save/", UserCatalogueSaveApi.as_view()),
                path("<int:user_catalogue_id>/save/", UserCatalogueUpdateApi.as_view()),
                path("<int:user_catalogue_id>/get/", UserCatalogueDetailApi.as_view()),
                path(
                    "<int:user_catalogue_id>/delete/",
                    UserCatalogueDeleteApi.as_view(),
                ),
                path("", UserCatalogueListApi.as_view()),
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
]
