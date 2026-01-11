from django.db import transaction

from django_inertia.common.services import model_get
from django_inertia.common.services import model_soft_delete
from django_inertia.common.services import model_update
from django_inertia.users.models import UserCatalogue


def _before_save(*, _):
    pass


def _after_save(*, _):
    pass


@transaction.atomic
def user_catalogue_save(
    *,
    request,
    data,
    entity_id=None,
):
    """
    Updates an existing record (when entity_id is provided)
    or creates a new record of UserCatalogue.
    Returns:
        The saved UserCatalogue model instance (the created or updated instance).
    """

    # prepare model data
    data["creator_id"] = request.user.id

    # before save hook
    _before_save(_=None)

    # save or update
    res = None
    if entity_id is not None:
        user_catalogue = user_catalogue_get(entity_id=entity_id)
        res, _ = model_update(instance=user_catalogue, data=data)
    else:
        res = UserCatalogue.objects.create(**data)

    # after save hook
    _after_save(_=None)

    return res


def user_catalogue_get(*, entity_id, with_relation: list[str] | None = None):
    return model_get(
        model_or_queryset=UserCatalogue,
        entity_id=entity_id,
        with_relation=with_relation,
    )


@transaction.atomic
def user_catalogue_delete(
    *,
    entity_id,
) -> bool:
    # prepare model data
    # before save hook
    _before_save(_=None)

    instance = model_get(model_or_queryset=UserCatalogue, entity_id=entity_id)
    deleted = model_soft_delete(instance=instance)

    # after save hook
    _after_save(_=None)

    return deleted
