import django_filters
from django.db.models import Q

DEFAULT_FIELD_LOOKUPS: list[str] = ["exact"]
COMPLEX_FIELD_LOOKUPS: list[str] = ["gt", "gte", "lt", "lte", "exact", "in", "range"]

LOOKUP_OPERATOR_MAP: dict[str, str] = {
    "search": "icontains",
    "exact_search": "exact",
    "prefix_search": "istartswith",
    "suffix_search": "iendswith",
}


class SearchableFilter(django_filters.FilterSet):
    """
    A filter set that adds search functionality to a queryset.
    Extend this class and set the `search_fields` attribute to enable search.
    FE: search?
    """

    searchable_fields: tuple[str, ...] = ()

    search = django_filters.CharFilter(
        method="_filter_search",
        required=False,
    )
    exact_search = django_filters.CharFilter(
        method="_filter_search",
        required=False,
    )
    prefix_search = django_filters.CharFilter(
        method="_filter_search",
        required=False,
    )
    suffix_search = django_filters.CharFilter(
        method="_filter_search",
        required=False,
    )

    def _filter_search(self, queryset, name, value):
        if not value or not self.searchable_fields:
            return queryset

        lookup_type = LOOKUP_OPERATOR_MAP.get(name, "icontains")

        q_objects = Q()
        for field in self.searchable_fields:
            if isinstance(field, str):
                # **kargs, unpack the dictionary into keyword arguments
                q_objects |= Q(**{f"{field}__{lookup_type}": value})

        return queryset.filter(q_objects)


# https://django-filter.readthedocs.io/en/latest/ref/filters.html#django_filters.filters.DateFromToRangeFilter
class CreatedUpdatedFilter(django_filters.FilterSet):
    """
    Filter for created and updated timestamps.
    FE: created_at_before, created_at_after, updated_at_before, updated_at_after
    """

    created_at = django_filters.DateFromToRangeFilter()
    updated_at = django_filters.DateFromToRangeFilter()


class SortableFilter(django_filters.FilterSet):
    """A filter set that adds sorting functionality to a queryset.
    Extend this class and set the `sortable_fields` attribute to enable sorting.
    `sortable_fields` is a tuple of tuples, where each inner tuple contains
    the field name and the parameter name used for sorting.
    """

    sortable_fields: tuple[tuple[str, str], ...] = ()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if self.sortable_fields:
            self.filters["ordering"] = django_filters.OrderingFilter(
                fields=self.sortable_fields,
            )
