from rest_framework_simplejwt.authentication import (
    JWTAuthentication as _JWTAuthentication,
)


# https://www.django-rest-framework.org/api-guide/authentication/#unauthorized-and-forbidden-responses
# https://django-rest-framework-simplejwt.readthedocs.io/en/latest/rest_framework_simplejwt.html#rest_framework_simplejwt.authentication.JWTAuthentication.authenticate_header
# response with 401 Unauthorized instead of 403 Forbidden
class JWTAuthentication(_JWTAuthentication):
    def authenticate_header(self, request):
        return "Bearer"
