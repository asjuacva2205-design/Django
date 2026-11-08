from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ContratoViewSet,
    EstadisticasView,
    EstadoJardinView,
    InyeccionMasivaView,
)

router = DefaultRouter()
router.register('contratos', ContratoViewSet, basename='contrato')

urlpatterns = [
    path('estado/', EstadoJardinView.as_view(), name='estado-taller'),
    path('contratos/inyeccion/', InyeccionMasivaView.as_view(), name='inyeccion-masiva'),
    path(
        'contratos/estadisticas/',
        EstadisticasView.as_view(),
        name='contratos-estadisticas',
    ),

    *router.urls,

    # TODO (RETO 15) - Agregar la ruta de borrado masivo.
]
