export const CLAVE_TABLERO = 'taller-secop-misiones-aprobadas'
const CLAVE_REVALIDACION = 'taller-secop-misiones-revalidacion-v1'
const CLAVE_REVALIDACION_MINI6 = 'taller-secop-mini6-revalidacion-v2'
const MISIONES_POR_REVALIDAR = [6, 7, 10, 12]

export function leerAprobadas() {
  const guardado = localStorage.getItem(CLAVE_TABLERO)
  if (!guardado) {
    localStorage.setItem(CLAVE_REVALIDACION_MINI6, 'true')
    return []
  }
  try {
    let aprobadas = JSON.parse(guardado)
    if (!Array.isArray(aprobadas)) return []

    if (localStorage.getItem(CLAVE_REVALIDACION) !== 'true') {
      aprobadas = aprobadas.filter((numero) => {
        return !MISIONES_POR_REVALIDAR.includes(numero)
      })
      localStorage.setItem(CLAVE_REVALIDACION, 'true')
    }

    if (localStorage.getItem(CLAVE_REVALIDACION_MINI6) !== 'true') {
      aprobadas = aprobadas.filter((numero) => numero !== 6)
      localStorage.setItem(CLAVE_REVALIDACION_MINI6, 'true')
    }

    localStorage.setItem(CLAVE_TABLERO, JSON.stringify(aprobadas))
    return aprobadas
  } catch {
    return []
  }
}

export function aprobarMision(numero) {
  const aprobadas = leerAprobadas()
  if (!aprobadas.includes(numero)) {
    localStorage.setItem(CLAVE_TABLERO, JSON.stringify(aprobadas.concat(numero)))
  }
}

export function borrarTablero() {
  localStorage.removeItem(CLAVE_TABLERO)
}
