"""Paginación del listado de contratos (RETO 14)."""
from rest_framework.pagination import PageNumberPagination


class PaginacionContratos(PageNumberPagination):
    """Página de 50 contratos, recortable desde el panel con ?page_size=."""

    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200
