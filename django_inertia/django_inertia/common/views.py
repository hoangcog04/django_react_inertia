from rest_framework import serializers
from rest_framework.views import APIView

from django_inertia.common.pagination import LimitOffsetPagination
from django_inertia.common.pagination import get_paginated_response
from django_inertia.users.api.filters import UserCatalogueFilter
from django_inertia.users.models import UserCatalogue


class OutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCatalogue
        fields = ["id", "name", "canonical", "description"]


class TestAPI(APIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 1000

    def get(self, request):
        # filters_serializer = self.FilterSerializer(data=request.query_params)
        # filters_serializer.is_valid(raise_exception=True)
        # filters = filters_serializer.validated_data or {}

        filters = request.query_params
        qs = UserCatalogue.objects.all()
        qs = UserCatalogueFilter(filters, qs).qs

        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=OutputSerializer,
            queryset=qs,
            request=request,
            view=self,
        )
