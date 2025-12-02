from django.utils.text import slugify

_resolve_map = {
    ord("đ"): "d",
}


# https://stackoverflow.com/questions/1605041/django-slug-in-vietnamese
def custom_slugify(value: str, allow_unicode: bool = False) -> str:  # noqa: FBT001, FBT002
    return slugify(value.translate(_resolve_map), allow_unicode=allow_unicode)
