from rest_framework import serializers
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.mixins import UpdateModelMixin
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from django_inertia.common.utils import custom_slugify as slugify
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
        assert isinstance(self.request.user.id, int)
        return self.queryset.filter(id=self.request.user.id)

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
        fields = ["name", "canonical", "description"]
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
    def put(self, request, user_catalogue_id):
        serializer = InputSerializer(
            data=request.data,
            context={"updating_pk": user_catalogue_id},
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
    class OutputSerializer(serializers.ModelSerializer):
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

    def get(self, request, user_catalogue_id):
        with_relation = ["creator"]

        user_catalogue = user_catalogue_get(
            entity_id=user_catalogue_id,
            with_relation=with_relation,
        )
        data = self.OutputSerializer(user_catalogue).data

        return Response(data=data, status=status.HTTP_200_OK)
