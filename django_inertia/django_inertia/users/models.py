from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import CharField
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from django_inertia.common.models import BaseModel


class User(AbstractUser):
    """
    Default custom user model for django_inertia.
    If adding fields that need to be filled at user signup,
    check forms.SignupForm and forms.SocialSignupForms accordingly.
    """

    # First and last name do not cover name patterns around the globe
    name = CharField(_("Name of User"), blank=True, max_length=255)
    first_name = None  # type: ignore[assignment]
    last_name = None  # type: ignore[assignment]
    created_at = models.DateTimeField(
        _("Created at"),
        db_index=True,
        default=timezone.now,
    )
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)

    def get_absolute_url(self) -> str:
        """Get URL for user's detail view.

        Returns:
            str: URL for user detail.

        """
        return reverse("users:detail", kwargs={"username": self.username})


class Publish(models.IntegerChoices):
    PUBLISHED = 1, "1"
    UNPUBLISHED = 2, "2"


class UserCatalogue(BaseModel):
    """Category to classify users (e.g., Admin, Editor, Member...)"""

    name = models.CharField(_("Name"), max_length=255)
    canonical = models.CharField(_("Canonical"), max_length=255, unique=True)
    description = models.TextField(_("Description"), default="", blank=True)
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        # fetch catalogues created by a user: my_user.created_catalogues.all()
        related_name="created_catalogues",
        db_column="user_id",
        verbose_name=_("Creator"),
    )
    publish = models.IntegerField(choices=Publish.choices, default=Publish.UNPUBLISHED)

    class Meta:
        verbose_name = _("User Catalogue")
        verbose_name_plural = _("User Catalogues")
        constraints = [
            models.CheckConstraint(
                name="%(app_label)s_%(class)s_publish_valid",
                condition=models.Q(publish__in=Publish.values),
            ),
        ]

    def __str__(self):
        return f"{self.name}"


class Permission(BaseModel):
    name = models.CharField(max_length=255)
    canonical = models.CharField(_("Canonical"), max_length=255, unique=True)
    description = models.TextField(default="", blank=True)
    publish = models.IntegerField(choices=Publish.choices, default=Publish.UNPUBLISHED)
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_permissions",
        db_column="user_id",
    )

    class Meta:
        verbose_name = _("Permission")
        verbose_name_plural = _("Permissions")
        constraints = [
            models.CheckConstraint(
                name="%(app_label)s_%(class)s_publish_valid",
                condition=models.Q(publish__in=Publish.values),
            ),
        ]

    def __str__(self):
        return f"{self.name}"
