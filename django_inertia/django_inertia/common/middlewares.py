flash_keys = ["success", "info", "warning", "error"]


class InertiaRequestsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # https://docs.djangoproject.com/en/5.2/topics/http/middleware/#middleware-order-and-layering
        response = self.get_response(request)
        return response  # noqa: RET504

    # this method is called if defined, and response has "render" method
    def process_template_response(self, request, response):
        if not hasattr(response, "data"):
            return response

        flash = {
            key: response.data.pop(key) for key in flash_keys if key in response.data
        }
        if flash:
            response.data["flash"] = flash

        return response
