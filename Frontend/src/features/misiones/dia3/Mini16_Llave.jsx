// RETO 16 - La Llave: VERSIÓN INICIAL (esqueleto) para desarrollar en clase.
// El panel llega vacío a propósito: los tres botones de la puerta se
// construyen con los TODO 1 a 5. Meta final: sin llave -> 401, con llave -> 200.
import { useState } from 'react'
import MisionMarco from '../MisionMarco'
import { API_URL, pedirOExplotar, peticion } from '../../../shared/api'

const INSTRUCCION =
  'En settings.py activa rest_framework.authtoken y TokenAuthentication, y corre ' +
  'manage.py migrate. En views.py escribe LlaveView: si el POST llega con ' +
  'credenciales válidas responde {"token": ..., "usuario": user.username}; si no, ' +
  '401 con {"detalle": "Credenciales inválidas."}. Protege LimpiezaMasivaView con ' +
  'IsAuthenticated y registra auth/login/ en urls.py antes del router. Al final ' +
  'desarrolla los 5 TODO (RETO 16) de este panel.'

export default function Mini16Llave({ desbloqueada, aprobada, alAprobar }) {
  // TODO 1 (RETO 16) - los estados del panel, cada uno con useState:
  //   usuario, clave : lo que se escribe en los inputs (empiezan vacíos)
  //   llave          : el token que devuelve el login (empieza VACÍA:
  //                    sin ella no hay nada que mandar en el DELETE)
  //   informe        : los números que se pintan al final (empieza en null)
  //   falla          : el error con su pista (empieza en null)
  //   trabajando     : el semáforo del doble clic (empieza en false)

  async function pedirLlave() {
    // TODO 2 (RETO 16) - el POST al login (botón "Pedir la llave"):
    //   0. if (trabajando) return : no hay doble clic
    //   1. semáforo arriba y se limpian falla e informe
    //   2. POST a ${API_URL}/auth/login/ · headers Content-Type JSON · body {username, password}
    //   3. el código decide la pista: 401 -> "usa tu superusuario (createsuperuser)";
    //      200 sin token -> "responde la llave en LlaveView";
    //      otro código -> "revisa LlaveView en views.py"
    //   4. si trae token, se guarda en el estado llave (y el botón 3 se enciende)
    //   5. finally: semáforo abajo, pase lo que pase
    //   blindaje extra: respuesta.json().catch(() => ({})) y el catch de la red rota
  }

  async function probarSinLlave() {
    // TODO 3 (RETO 16) - el ataque falso (botón "Probar sin llave"):
    //   0. semáforo, sin limpiar informe: este botón SOLO agrega su marca
    //   1. DELETE DESNUDO a ${API_URL}/contratos/limpieza/: sin encabezado
    //      Authorization y sin cuerpo (tal como llegaría cualquier visitante)
    //   2. el código decide la pista - es el diagnóstico del panel:
    //      400 -> falta permission_classes = [IsAuthenticated] (cerradura)
    //      respondió OK -> el peor caso: borró sin pedir nada
    //      403 -> falta TokenAuthentication en DEFAULT_AUTHENTICATION_CLASSES (settings)
    //      otro código -> pista genérica con el número
    //   3. con 401 (la cerradura funcionó): setInforme((prev) => ({ ...prev, sinLlave: true }))
    //   4. finally: semáforo abajo
  }

  async function borrarConLlave() {
    // TODO 4 (RETO 16) - el ciclo completo (botón "Borrar con la llave"):
    //   0. guardia: si llave está VACÍA -> pista "pide la llave primero" y no dispara
    //   1. semáforo arriba y limpia falla
    //   2. leer la bóveda ANTES: pedirOExplotar(`${API_URL}/estado/`)
    //      -> informe.antes = datos.contratos_registrados
    //   3. DELETE a ${API_URL}/contratos/limpieza/ con body {"confirmar": true} y headers:
    //        'Content-Type': 'application/json',
    //        Authorization: 'Token ' + llave      <- la ÚNICA línea que cierra el reto
    //   4. leer la bóveda DESPUÉS (como el paso 2) -> informe.quedan
    //      y armar el informe: codigo, eliminados (cuerpo.eliminados) y ms
    //   5. el código decide: 401 -> pista del TODO de este panel; otro -> pista genérica;
    //      200 -> alAprobar() (el tablero anota el mini)
    //   6. finally: semáforo abajo
  }

  return (
    <MisionMarco
      alias="Mini 16"
      titulo="La Llave"
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      {/* TODO 5 (RETO 16) - el resto del render, de a bloque:
          · primera fila: los inputs CONTROLADOS de usuario y clave
            (value + onChange) y el botón "Pedir la llave" -> pedirLlave
            (disabled: trabajando || !usuario || !clave · texto: 'Trabajando...')
          · segunda fila: botón "Probar sin llave" -> probarSinLlave y botón
            "Borrar con la llave" -> borrarConLlave (disabled: trabajando || !llave),
            con el span recordatorio DELETE /api/contratos/limpieza/
          · llave: la celda-suave "Llave guardada en el panel" (con slice(0, 10))
          · falla: el aviso de error (clase "aviso", data-tipo="error")
          · informe: las estadísticas (resumen-stats) con 401, codigo, eliminados, quedan y ms
          · aviso de bóveda vacía cuando el DELETE responde 200 con eliminados 0
        */}
    </MisionMarco>
  )
}
