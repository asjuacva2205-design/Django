import { useRef, useState } from 'react'
import MisionMarco from '../MisionMarco'
import Camaleon from './Camaleon'

const INSTRUCCION =
  'React compone interfaces con componentes. Crea EtiquetaSecop para mostrar SECOP II y úsalo dentro de Camaleon junto con un h1 titulo-gigante y un párrafo.'

export default function Mini6Camaleon({ desbloqueada, aprobada, alAprobar }) {
  const camaleonRef = useRef(null)
  const [verificacion, setVerificacion] = useState(null)

  function verificar() {
    const seccion = camaleonRef.current?.querySelector('section')
    const etiqueta = seccion?.querySelector('span')
    const titulo = seccion?.querySelector('h1')
    const descripcion = seccion?.querySelector('p')
    const textoEtiqueta = etiqueta?.textContent.trim() || ''
    const textoTitulo = titulo?.textContent.trim() || ''
    const textoDescripcion = descripcion?.textContent.trim() || ''
    const etiquetaEsCorrecta = /^secop ii$/i.test(textoEtiqueta)
    const tituloEsMarcador = /^(todo|escribe un título|tu título)$/i.test(textoTitulo)
    const descripcionEsMarcador = /^(todo|escribe una descripción|tu descripción)$/i.test(textoDescripcion)

    if (
      seccion &&
      etiquetaEsCorrecta &&
      titulo?.classList.contains('titulo-gigante') &&
      textoTitulo &&
      !tituloEsMarcador &&
      textoDescripcion &&
      !descripcionEsMarcador
    ) {
      alAprobar()
      setVerificacion({
        ok: true,
        mensaje: 'La etiqueta, el título y la descripción se muestran correctamente.',
      })
      return
    }

    setVerificacion({
      ok: false,
      mensaje: 'Revisa EtiquetaSecop, el h1 con su clase y el párrafo.',
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
