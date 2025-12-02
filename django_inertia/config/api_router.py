from django.conf import settings
from django.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework.routers import SimpleRouter

from django_inertia.users.api.views import UserViewSet

router = DefaultRouter() if settings.DEBUG else SimpleRouter()

# GET /api/users/
# POST /api/users/
# GET /api/users/{username}/
# PUT/PATCH /api/users/{username}/
# DELETE /api/users/{username}/
router.register("users", UserViewSet)


app_name = "api"
urlpatterns = router.urls

urlpatterns += [
    path("", include("django_inertia.users.api.urls")),
]
