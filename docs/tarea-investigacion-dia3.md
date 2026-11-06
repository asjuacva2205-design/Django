# Tarea de investigación — Día 3: Pentatlón Big Data

**Objetivo:** llegar mañana con las bases claras para cargar la base de datos con datos reales y trabajar con ellos.

## Tema central
Carga masiva de datos reales (SECOP II) y su tratamiento en una API con Django + PostgreSQL.

## Preguntas guía (investiga y responde con tus palabras)
1. ¿Qué es SECOP II y qué datos publica? ¿Qué licencia tiene?
2. ¿Qué es una carga masiva y por qué es mejor que guardar fila por fila?
3. ¿Qué hace `bulk_create` y qué parámetros son importantes (`batch_size`, `ignore_conflicts`)?
4. ¿Qué es una agregación (`aggregate`) y en qué se diferencia de `annotate`?
5. ¿Cómo funciona la paginación en una API y por qué es necesaria con miles de filas?
6. ¿Por qué un borrado masivo debe pedir confirmación y devolver un conteo?

## Recursos sugeridos
- Documentación de Django: `bulk_create`, `aggregate`, `annotate`, `filter`, `QuerySet.delete()`.
- DRF: paginación (`PageNumberPagination`), filtros (`SearchFilter`, `OrderingFilter`).
- Portal datos.gov.co: dataset “SECOP II - Contratos Electrónicos” (código `jbjy-vk9h`).

## Entregable para mañana (5–10 minutos)
- Un párrafo corto explicando qué es carga masiva y por qué la usaremos.
- Una lista de 3 riesgos de cargar datos sin control y cómo los evitamos (duplicados, memoria, borrado accidental).
- Una pregunta que te gustaría que se resuelva en clase.

## Checklist rápido
- [ ] Entiendo qué es SECOP II y de dónde vienen los datos.
- [ ] Sé qué hace `bulk_create` y por qué se usa en lotes.
- [ ] Puedo explicar la diferencia entre `aggregate` y `annotate`.
- [ ] Entiendo por qué paginamos y por qué el borrado pide confirmación.
