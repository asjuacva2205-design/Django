"""Vistas de la API de contratos."""
import time

from django.apps import apps
from django.db import connection
from django.db.models import Avg, Count, Max, Sum
from rest_framework import filters, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .fuente_secop import TAMANO_PAGINA, consultar_pagina, fila_a_contrato
from .models import Contrato
from .serializers import ContratoSerializer



# ==============================================================================
# Bateria de diagnostico (VIENE LISTA: no es un reto).
#
# GET /api/estado/ responde banderas "on/off" que las misiones de React
# traducen a Aprobado/Aun-no. Es el tablero que los instructores
# (Steven/Yesid) proyectan para mostrar el avance en vivo:
#
#   base_datos             -> ¿el motor de DATABASES responde? (Mini 1·Boveda)
#   motor_bueno            -> ¿es PostgreSQL y no SQLite?     (Mini 1)
#   tabla_contratos        -> ¿ya existe la tabla del modelo? (Mini 2)
#   contratos_registrados  -> ¿cuantos registros hay guardados? (Mini 3 y 15)
#   modelo_en_admin        -> ¿el modelo ya aparece en el Admin? (Mini 3)
# ==============================================================================
class EstadoJardinView(APIView):
    """
    Bateria de diagnostico del taller. La usan las misiones de React
    para aprobar los minis automaticamente cuando el backend responde
    lo que cada misión espera.
    """

    # El estudiante NO modifica esta vista: es el juez del taller.
    # El CORS global de toda la API es el RETO 9; este andamio solo
    # autoriza ESTA respuesta hacia el origen 5173.
    def _con_andamio_cors(self, request, datos):
        respuesta = Response(datos)
        origen = request.headers.get('Origin', '')
        if origen in ('http://localhost:5173', 'http://127.0.0.1:5173'):
            respuesta['Access-Control-Allow-Origin'] = origen
            respuesta['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
            respuesta['Vary'] = 'Origin'
        return respuesta

    def get(self, request):
        # 1. La Boveda: ¿el motor configurado en DATABASES esta vivo?
        try:
            connection.ensure_connection()
            base_datos_ok = True
        except Exception:
            base_datos_ok = False

        motor = connection.settings_dict.get('ENGINE', '')
        motor_bueno = base_datos_ok and 'postgresql' in motor

        # 2. El Almacen: ¿ya migro el modelo Contrato? Se mira por el
        #    NOMBRE de la tabla (Mini 2 genera `contratos_contrato`),
        #    sin importar el modelo (que todavia no existe en esta etapa).
        tabla_contratos = False
        total_contratos = 0
        nombre_tabla = 'contratos_contrato'

        tablas_de_postgres = connection.introspection.table_names()
        if nombre_tabla in tablas_de_postgres:
            tabla_contratos = True
            with connection.cursor() as cursor:
                cursor.execute(f'SELECT COUNT(*) FROM "{nombre_tabla}"')
                total_contratos = cursor.fetchone()[0]

        # 3. El Jefe Maestro: ¿el estudiante ya registro el modelo en el
        #    Admin (RETO 3)? Si nunca hay modelo, el cambia es innecesario.
        modelo_en_admin = False
        if any(
            modelo._meta.app_label == 'contratos'
            for modelo in apps.get_app_config('contratos').get_models()
        ):
            from django.contrib import admin  # importacion local a proposito
            modelo_en_admin = any(
                _referencia_modelo(modelo) == 'contratos.contrato'
                for modelo in admin.site._registry
            )

        return self._con_andamio_cors(request, {
            'base_datos': base_datos_ok,
            'motor_bueno': motor_bueno,
            'tabla_contratos': tabla_contratos,
            'contratos_registrados': total_contratos,
            'modelo_en_admin': modelo_en_admin,
        })


def _referencia_modelo(modelo):
    """Devuelve 'app.Modelo' para comparar el registro del Admin."""
    return f'{modelo._meta.app_label}.{modelo._meta.model_name}'


class ContratoViewSet(viewsets.ModelViewSet):
    """ViewSet de contratos: lista, detalle, crear, editar y borrar."""
    queryset = Contrato.objects.all()
    serializer_class = ContratoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['id_contrato', 'entidad_compradora', 'descripcion']
    ordering_fields = ['valor_total', 'fecha_firma', 'id_contrato']

    def get_queryset(self):
        queryset = Contrato.objects.all()
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado__iexact=estado)
        return queryset


# TODO (RETO 11) - Crear descargar_contratos(cantidad) en este archivo: valida
# cantidad, pide paginas con consultar_pagina y convierte las filas con
# fila_a_contrato (funciones listas en fuente_secop.py), evita repetir
# identificadores y guarda los nuevos con bulk_create(batch_size=1000,
# ignore_conflicts=True). Responde con creados, recibidos, omitidos, total,
# ms y por_segundo. Despues escribe InyeccionMasivaView, que valida cantidad
# responde 400 si es invalida y delega en esa funcion.

def descargar_contratos(cantidad):
    """Descarga `cantidad` contratos de SECOP II y los guarda en bloque."""
    inicio = time.perf_counter()

    identificadores = set(Contrato.objects.values_list('id_contrato', flat=True))
    contratos_nuevos = []
    recibidos = 0
    desplazamiento = 0

    while recibidos < cantidad:
        limite = min(TAMANO_PAGINA, cantidad - recibidos)
        filas = consultar_pagina(limite, desplazamiento)
        if not filas:
            break
        for fila in filas:
            if recibidos >= cantidad:
                break
            recibidos += 1
            contrato = fila_a_contrato(fila)
            if contrato is None:
                continue
            if contrato.id_contrato in identificadores:
                continue
            identificadores.add(contrato.id_contrato)
            contratos_nuevos.append(contrato)
        desplazamiento += len(filas)
        if len(filas) < limite:
            break

    total_antes = Contrato.objects.count()
    if contratos_nuevos:
        Contrato.objects.bulk_create(
            contratos_nuevos, batch_size=1000, ignore_conflicts=True,
        )
    total_despues = Contrato.objects.count()
    creados = total_despues - total_antes

    ms = (time.perf_counter() - inicio) * 1000
    por_segundo = round(recibidos / (ms / 1000), 2) if ms > 0 else 0

    return {
        'creados': creados,
        'recibidos': recibidos,
        'omitidos': recibidos - creados,
        'total': total_despues,
        'ms': round(ms),
        'por_segundo': por_segundo,
    }


class InyeccionMasivaView(APIView):
    """POST /api/contratos/inyeccion/ — descarga masiva desde SECOP II."""

    def post(self, request):
        try:
            cantidad = int(request.data.get('cantidad'))
        except (TypeError, ValueError):
            return Response(
                {'detalle': 'cantidad debe ser un entero entre 1 y 50000.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if cantidad < 1 or cantidad > 50000:
            return Response(
                {'detalle': 'cantidad debe ser un entero entre 1 y 50000.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            resultado = descargar_contratos(cantidad)
        except Exception as error:  # noqa: BLE001 - reportamos el fallo al cliente
            return Response(
                {'detalle': f'No se pudo consultar SECOP II: {error}'},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        return Response(resultado)


class EstadisticasView(APIView):
    """GET /api/contratos/estadisticas/ — informe con aggregate y annotate."""

    def get(self, request):
        metricas = Contrato.objects.aggregate(
            total_contratos=Count('id'),
            suma_valor_total=Sum('valor_total'),
            promedio_valor_total=Avg('valor_total'),
            maximo_valor_total=Max('valor_total'),
        )

        estados = (
            Contrato.objects.values('estado')
            .annotate(contratos=Count('id'), suma=Sum('valor_total'))
            .order_by('estado')
        )
        por_estado = {
            fila['estado']: {'contratos': fila['contratos'], 'suma': fila['suma']}
            for fila in estados
        }

        dias = (
            Contrato.objects.values('fecha_firma')
            .annotate(contratos=Count('id'))
            .order_by('fecha_firma')
        )
        por_dia = [
            {
                'fecha': fila['fecha_firma'].isoformat(),
                'contratos': fila['contratos'],
            }
            for fila in dias
        ]

        return Response({
            'metricas': metricas,
            'por_estado': por_estado,
            'por_dia': por_dia,
        })


# TODO (RETO 14) - Crear la clase de paginacion en contratos/paginacion.py.


class LimpiezaMasivaView(APIView):
    """DELETE /api/contratos/limpieza/ — vacía la tabla con confirmación."""

    def delete(self, request):
        confirmar = (
            request.data.get('confirmar')
            if hasattr(request.data, 'get')
            else None
        )
        if confirmar is not True:
            return Response(
                {'detalle': 'Envía {"confirmar": true} para borrar la tabla completa.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        inicio = time.perf_counter()
        eliminados, _ = Contrato.objects.all().delete()
        ms = round((time.perf_counter() - inicio) * 1000, 2)
        return Response({'eliminados': eliminados, 'ms': ms})
