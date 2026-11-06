from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ContratoViewSet, EstadoJardinView, InyeccionMasivaView

router = DefaultRouter()
router.register('contratos', ContratoViewSet, basename='contrato')

urlpatterns = [
    path('estado/', EstadoJardinView.as_view(), name='estado-taller'),
    path('contratos/inyeccion/', InyeccionMasivaView.as_view(), name='inyeccion-masiva'),

    *router.urls,

    # TODO (RETO 12) - Agregar la ruta de estadísticas.

    # TODO (RETO 15) - Agregar la ruta de borrado masivo.
]
