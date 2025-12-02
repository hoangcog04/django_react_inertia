from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import CharField
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from django_inertia.common.models import BaseModel


class User(BaseModel, AbstractUser):
    """
    Default custom user model for django_inertia.
    If adding fields that need to be filled at user signup,
    check forms.SignupForm and forms.SocialSignupForms accordingly.
    """

    # First and last name do not cover name patterns around the globe
    name = CharField(_("Name of User"), blank=True, max_length=255)
    first_name = None  # type: ignore[assignment]
    last_name = None  # type: ignore[assignment]

    def get_absolute_url(self) -> str:
        """Get URL for user's detail view.

        Returns:
            str: URL for user detail.

        """
        return reverse("users:detail", kwargs={"username": self.username})


class UserCatalogue(BaseModel):
    """Category to classify users (e.g., Admin, Editor, Member...)"""

    name = models.CharField(_("Name"), max_length=255)
    canonical = models.CharField(_("Canonical"), max_length=255, unique=True)
    description = models.TextField(_("Description"), default="", blank=True)
    deleted_at = models.DateTimeField(_("Deleted at"), null=True, blank=True)
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        # fetch catalogues created by a user: my_user.created_catalogues.all()
        related_name="created_catalogues",
        db_column="user_id",
        verbose_name=_("Creator"),
    )
    # pivot table: user_catalogue_user
    users: models.ManyToManyField = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        # through specifies the custom intermediate table
        through="UserCatalogueUser",
        # fetch catalogues a user belongs to: my_user.catalogues.all()
        related_name="catalogues",
        verbose_name=_("Users in this catalogue"),
    )

    class Meta:
        db_table = "user_catalogues"
        verbose_name = _("User Catalogue")
        verbose_name_plural = _("User Catalogues")

    def __str__(self):
        return f"{self.name}"


class UserCatalogueUser(BaseModel):
    """Pivot table: which User belongs to which Catalogue"""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        db_column="user_id",
    )
    user_catalogue = models.ForeignKey(
        UserCatalogue,
        on_delete=models.CASCADE,
        db_column="user_catalogue_id",
    )

    class Meta:
        db_table = "user_catalogue_user"
        verbose_name = _("User Catalogue Assignment")
        verbose_name_plural = _("User Catalogue Assignments")

    def __str__(self):
        return f"{self.user} - {self.user_catalogue}"
