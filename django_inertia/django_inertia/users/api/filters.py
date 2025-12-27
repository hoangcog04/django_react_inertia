import django_filters

from django_inertia.common.filters import COMPLEX_FIELD_LOOKUPS  # noqa: F401
from django_inertia.common.filters import DEFAULT_FIELD_LOOKUPS
from django_inertia.common.filters import CreatedUpdatedFilter
from django_inertia.common.filters import SearchableFilter
from django_inertia.common.filters import SortableFilter
from django_inertia.users.models import UserCatalogue


class UserCatalogueFilter(CreatedUpdatedFilter, SearchableFilter, SortableFilter):
    searchable_fields = ("name", "description", "canonical")
    sortable_fields = (("id", "id"),)
    creator_id = django_filters.NumberFilter(field_name="creator__id")

    # https://django-filter.readthedocs.io/en/latest/guide/usage.html#generating-filters-with-meta-fields
    class Meta:
        model = UserCatalogue
        fields = {"publish": DEFAULT_FIELD_LOOKUPS}


class UserFilter(SearchableFilter):
    searchable_fields = ("name", "email")
