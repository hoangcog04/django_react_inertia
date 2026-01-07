from rest_framework.pagination import LimitOffsetPagination as _LimitOffsetPagination
from rest_framework.pagination import PageNumberPagination as _PageNumberPagination
from rest_framework.response import Response


def get_paginated_response(
    *,
    pagination_class,
    serializer_class,
    queryset,
    request,
    view,
):
    type_param = (request.query_params.get("type") or "").lower()

    if type_param == "all":
        serializer = serializer_class(queryset, many=True)
        return Response(data=serializer.data)

    paginator = pagination_class()

    page = paginator.paginate_queryset(queryset, request, view=view)

    if page is not None:
        serializer = serializer_class(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    serializer = serializer_class(queryset, many=True)

    return Response(data=serializer.data)


class LimitOffsetPagination(_LimitOffsetPagination):
    default_limit = 10
    max_limit = 50

    def get_paginated_response(self, data):
        """
        We redefine this method in order to return `limit` and `offset`.
        This is used by the frontend to construct the pagination itself.
        """

        return Response(
            {
                "limit": self.limit,
                "offset": self.offset,
                "count": self.count,
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "results": data,
            },
        )


class PageNumberPagination(_PageNumberPagination):
    page_size = 10
    page_size_query_param = "perpage"
    max_page_size = (
        100  # This attribute is only valid if page_size_query_param is also set
    )

    def get_paginated_response(self, data):
        assert self.page is not None

        return Response(
            {
                "page_size": self.page.paginator.per_page,
                "page": self.page.number,
                "count": self.page.paginator.count,
                "total_pages": self.page.paginator.num_pages,
                "links": {
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "results": data,
            },
        )
