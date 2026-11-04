import { useRef, useState } from 'react'
import MisionMarco from '../MisionMarco'
import Camaleon from './Camaleon'

const INSTRUCCION =
  'En Camaleon.jsx cambia solo el texto dentro del span por tu nombre. Conserva el saludo, el h1 y la clase titulo-gigante.'

export default function Mini6Camaleon({ desbloqueada, aprobada, alAprobar }) {
  const camaleonRef = useRef(null)
  const [verificacion, setVerificacion] = useState(null)

  function verificar() {
    const titulo = camaleonRef.current?.querySelector('h1')
    const span = titulo?.querySelector('span')
    const nombre = span?.textContent.trim() || ''
    const conservaSaludo = titulo?.firstChild?.textContent.trim() === 'Hola,'
    const esMarcador = /^(tu nombre aquí|escribe tu nombre aquí|cambia solo este texto|todo)$/i.test(nombre)

    if (
      titulo?.classList.contains('titulo-gigante') &&
      titulo.children.length === 1 &&
      span?.tagName === 'SPAN' &&
      conservaSaludo &&
      nombre &&
      !esMarcador
    ) {
      alAprobar()
      setVerificacion({
        ok: true,
        mensaje: 'Cambiaste el texto del span y conservaste el título.',
      })
      return
    }

    setVerificacion({
      ok: false,
      mensaje: 'Cambia solo el texto del span. Conserva el saludo, el h1 y la clase.',
    })
  }

  return (
    <MisionMarco
      alias="Mini 6"
      titulo="El Camaleón"
      desbloqueada={desbloqueada}
      aprobada={aprobada}
    >
      <p className="mision-instruccion">{INSTRUCCION}</p>

      <div ref={camaleonRef}>
        <Camaleon />
      </div>

      <button className="boton" onClick={verificar}>
        Verificar el componente
      </button>

      {verificacion && (
        <div className="aviso" data-tipo={verificacion.ok ? 'ok' : 'error'}>
          {verificacion.mensaje}
        </div>
      )}
    </MisionMarco>
  )
}
