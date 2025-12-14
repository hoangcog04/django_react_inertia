from django.db.models.query import QuerySet

from django_inertia.users.models import User

from .filters import UserFilter


def user_list(*, filters=None) -> QuerySet[User]:
    filters = filters or {}

    qs = User.objects.all()

    return UserFilter(filters, qs).qs
