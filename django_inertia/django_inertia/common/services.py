from typing import Any
from typing import TypeVar

from django import http
from django.db import models

DjangoModelType = TypeVar("DjangoModelType", bound=models.Model)


# https://docs.astral.sh/ruff/rules/non-pep695-generic-function/
def model_update[DjangoModelType: models.Model](
    *,
    instance: DjangoModelType,
    data: dict[str, Any],
    fields: list[str] | None = None,
) -> tuple[DjangoModelType, bool]:
    if fields is None:
        fields = list(data.keys())

    has_updated = False
    update_fields = []

    for field in fields:
        if field not in data:
            continue
        if getattr(instance, field) != data[field]:
            has_updated = True
            update_fields.append(field)
            setattr(instance, field, data[field])
    if has_updated:
        instance.full_clean()
        instance.save(update_fields=update_fields)

    return instance, has_updated


def model_get(
    *,
    model_or_queryset,
    entity_id: int,
    with_relation: list[str] | None = None,
) -> models.Model:
    with_relation = with_relation or []

    # select_related('foo', 'bar')
    instance = model_or_queryset.objects.select_related(*with_relation).get(
        id=entity_id,
    )

    if instance is None:
        raise http.Http404
    return instance
