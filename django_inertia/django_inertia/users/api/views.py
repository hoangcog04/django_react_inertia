from time import sleep

from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.mixins import UpdateModelMixin
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from django_inertia.common.constant import EmailNotification
from django_inertia.common.pagination import LimitOffsetPagination
from django_inertia.common.pagination import PageNumberPagination
from django_inertia.common.pagination import get_paginated_response
from django_inertia.common.services import model_list
from django_inertia.common.utils import custom_slugify as slugify
from django_inertia.users.api.filters import UserCatalogueFilter
from django_inertia.users.api.selectors import user_list
from django_inertia.users.api.services import user_catalogue_delete
from django_inertia.users.api.services import user_catalogue_get
from django_inertia.users.api.services import user_catalogue_save
from django_inertia.users.models import User
from django_inertia.users.models import UserCatalogue

from .serializers import UserSerializer


class UserViewSet(RetrieveModelMixin, ListModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = "username"

    def get_queryset(self, *args, **kwargs):
        assert isinstance(self.request.user.id, int)  # pyright: ignore[reportAttributeAccessIssue]
        return self.queryset.filter(id=self.request.user.id)  # pyright: ignore[reportAttributeAccessIssue, reportOptionalMemberAccess]

    @action(detail=False)
    def me(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class OutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCatalogue
        fields = ["id", "name", "canonical", "description"]


class InputSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCatalogue
        fields = ["name", "canonical", "description", "publish"]
        # disable unique validator to use custom one
        # because slugify is only applied in validate_canonical
        extra_kwargs: dict = {"canonical": {"validators": []}}

    def validate_canonical(self, value):
        slugged_value = slugify(value)
        queryset = UserCatalogue.objects.filter(canonical=slugged_value)
        updating_pk = self.context.get("updating_pk")
        if updating_pk:
            queryset = queryset.exclude(id=updating_pk)
        if queryset.exists():
            raise serializers.ValidationError("Canonical must be unique")
        return slugged_value


class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = (
            "password",
            "last_login",
            "is_superuser",
            "is_staff",
            "is_active",
            "date_joined",
            "user_permissions",
            "groups",
        )


class UserListApi(APIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 20

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ["id", "email", "name"]

    def get(self, request):
        filters = request.query_params
        user_list_qs = user_list(filters=filters)

        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=self.OutputSerializer,
            queryset=user_list_qs,
            request=request,
            view=self,
        )


class UserCatalogueSaveApi(APIView):
    def post(self, request):
        serializer = InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # You must now use the .validated_data attribute
        # if you need to inspect the data before saving
        user_catalogue = user_catalogue_save(
            request=request,
            data=serializer.validated_data,
        )
        data = OutputSerializer(user_catalogue).data

        return Response(data=data, status=status.HTTP_201_CREATED)


class UserCatalogueUpdateApi(APIView):
    @extend_schema(
        responses=OutputSerializer,
    )
    def put(self, request, user_catalogue_id):
        serializer = InputSerializer(
            data=request.data,
            context={"updating_pk": user_catalogue_id},
            partial=True,  # PATCH-like behavior
        )
        serializer.is_valid(raise_exception=True)
        user_catalogue = user_catalogue_save(
            request=request,
            data=serializer.validated_data,
            entity_id=user_catalogue_id,
        )
        data = OutputSerializer(user_catalogue).data

        return Response(data=data, status=status.HTTP_200_OK)


class UserCatalogueDetailApi(APIView):
    class UserCatalogueDetailOutput(serializers.ModelSerializer):
        creator = serializers.SerializerMethodField()

        class Meta:
            model = UserCatalogue
            fields = [
                "id",
                "name",
                "canonical",
                "description",
                "creator",
                "created_at",
                "updated_at",
            ]

        # get_ prefix is required for SerializerMethodField
        def get_creator(self, obj):
            # https://stackoverflow.com/questions/53679250/django-check-if-a-foreign-key-field-has-been-loaded
            # do not use hasattr(obj, "creator")
            if UserCatalogue.creator.field.is_cached(obj):
                return obj.creator.username
            return None

    # https://drf-spectacular.readthedocs.io/en/latest/customization.html#step-2-extend-schema
    # https://github.com/tfranzel/drf-spectacular/issues/90
    @extend_schema(
        responses=UserCatalogueDetailOutput,
    )
    def get(self, request, user_catalogue_id):
        with_relation = ["creator"]

        user_catalogue = user_catalogue_get(
            entity_id=user_catalogue_id,
            with_relation=with_relation,
        )
        data = self.UserCatalogueDetailOutput(user_catalogue).data

        return Response(data=data, status=status.HTTP_200_OK)


class UserCatalogueListApi(APIView):
    class Pagination(PageNumberPagination):
        pass

    class OutputSerializer(serializers.ModelSerializer):
        creator = UserPublicSerializer(read_only=True)

        class Meta:
            model = UserCatalogue
            fields = [
                "id",
                "name",
                "description",
                "publish",
                "creator",
                "created_at",
                "updated_at",
            ]

    def get(self, request):
        with_relation = ["creator"]

        filters = request.query_params
        qs = model_list(
            model_or_queryset=UserCatalogue,
            with_relation=with_relation,
        )
        qs = UserCatalogueFilter(filters, qs).qs
        sleep(1)

        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=self.OutputSerializer,
            queryset=qs,
            request=request,
            view=self,
        )


class UserCatalogueDeleteApi(APIView):
    def delete(self, request, user_catalogue_id):
        deleted = user_catalogue_delete(entity_id=user_catalogue_id)

        return Response(
            data={"deleted": deleted, "info": EmailNotification.SENT},
            status=status.HTTP_200_OK,
        )
