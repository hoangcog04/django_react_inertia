import functools
import time

from django.db import connection
from django.db import reset_queries


def log_queries(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        reset_queries()

        start_queries = len(connection.queries)
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        end_queries = len(connection.queries)

        print(f"\n{'=' * 50}")
        print("Function: " + func.__name__)
        print(f"Number of Queries: {end_queries - start_queries}")
        print(f"Finished in: {end - start}")
        print(f"{'=' * 50}")
        for i, query in enumerate(connection.queries, 1):
            print(f"\nQuery {i} - Time: {query['time']}s")
            print(query["sql"])

        return result

    return wrapper
