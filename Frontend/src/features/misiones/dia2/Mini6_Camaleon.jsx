import { useRef, useState } from 'react'
import MisionMarco from '../MisionMarco'
import Camaleon from './Camaleon'

const INSTRUCCION =
  'Construye en Camaleon.jsx un componente que presente SECOP II. Debe mostrar una sección, un h1 con la clase titulo-gigante y un párrafo.'

export default function Mini6Camaleon({ desbloqueada, aprobada, alAprobar }) {
  const camaleonRef = useRef(null)
  const [verificacion, setVerificacion] = useState(null)

  function verificar() {
    const seccion = camaleonRef.current?.querySelector('section')
    const titulo = seccion?.querySelector('h1')
    const descripcion = seccion?.querySelector('p')
    const textoTitulo = titulo?.textContent.trim() || ''
    const textoDescripcion = descripcion?.textContent.trim() || ''
    const tituloEsMarcador = /^(todo|escribe un título|tu título)$/i.test(textoTitulo)
    const descripcionEsMarcador = /^(todo|escribe una descripción|tu descripción)$/i.test(textoDescripcion)

    if (
      seccion &&
      titulo?.classList.contains('titulo-gigante') &&
      textoTitulo &&
      !tituloEsMarcador &&
      textoDescripcion &&
      !descripcionEsMarcador
    ) {
      alAprobar()
      setVerificacion({
        ok: true,
        mensaje: 'Tu componente muestra una sección, un título y una descripción.',
      })
      return
    }

    setVerificacion({
      ok: false,
      mensaje: 'Revisa la sección, el h1 con su clase y el párrafo con texto propio.',
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
