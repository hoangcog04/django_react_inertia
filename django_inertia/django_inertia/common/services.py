from typing import Any
from typing import TypeVar

from django import http
from django.db import models
from django.utils import timezone

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
    # select_related('foo', 'bar')
    with_relation = with_relation or []

    try:
        # eager evaluation
        instance = model_or_queryset.objects.select_related(*with_relation).get(
            id=entity_id,
        )
    # https://docs.djangoproject.com/en/5.2/ref/models/querysets/#get
    except model_or_queryset.DoesNotExist as err:
        raise http.Http404 from err
    return instance


def model_list(
    *,
    queryset,
    with_relation: list[str] | None = None,
) -> models.QuerySet:
    # select_related('foo', 'bar')
    with_relation = with_relation or []

    # queryset lazy
    return queryset.select_related(*with_relation).all()


def model_soft_delete(*, instance: models.Model) -> bool:
    assert hasattr(instance, "deleted_at"), (
        f"Model {instance.__class__.__name__} does not have 'deleted_at' field."
    )

    if instance.deleted_at is None:  # pyright: ignore[reportAttributeAccessIssue]
        instance.deleted_at = timezone.now()  # pyright: ignore[reportAttributeAccessIssue]
        instance.save(update_fields=["deleted_at"])
        return True

    return False


def model_bulk_delete(
    *,
    model_or_queryset,
    ids: list[str],
    force_delete: bool = False,
) -> int:
    qs = model_or_queryset.objects.filter(id__in=ids)

    if force_delete:
        deleted_count, _ = qs.delete()
        return deleted_count

    return qs.update(deleted_at=timezone.now())


def model_bulk_update[DjangoModelType: models.Model](
    *,
    model,
    instances: list[DjangoModelType],
    data: dict[str, Any],
    fields: list[str] | None = None,
    batch_size: int | None = None,
) -> tuple[int, bool]:
    if fields is None:
        fields = list(data.keys())

    should_update = False
    update_fields = []
    to_update = []

    for instance in instances:
        for field in fields:
            if field not in data:
                continue
            if getattr(instance, field) != data[field]:
                should_update = True
                update_fields.append(field)
                setattr(instance, field, data[field])
        if should_update:
            to_update.append(instance)
        should_update = False

    if not to_update:
        return 0, False

    count = model.objects.bulk_update(
        to_update,
        fields=update_fields,
        batch_size=batch_size,
    )
    has_updated = count > 0

    return count, has_updated
