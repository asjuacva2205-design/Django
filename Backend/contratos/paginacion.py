"""Paginacion del listado de contratos (RETO 14)."""
from rest_framework.pagination import PageNumberPagination


class PaginacionContratos(PageNumberPagination):
    """Pagina de 50 contratos: el panel la recorta con ?page_size=."""

    page_size = 50
    page_size_query_param = 'page_size'
