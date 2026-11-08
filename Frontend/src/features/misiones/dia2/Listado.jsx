import { useEffect, useState } from 'react'
import { API_URL } from '../../../shared/api'

const POR_PAGINA = 50

export default function Listado() {
  const [ruta, setRuta] = useState(`${API_URL}/contratos/?ordering=id_contrato`)
  const [pagina, setPagina] = useState(1)
  const [contratos, setContratos] = useState([])
  const [paginado, setPaginado] = useState({ count: 0, next: null, previous: null })

  useEffect(() => {
    async function traer() {
      try {
        const respuesta = await fetch(ruta)
        const datos = await respuesta.json()
        setContratos(Array.isArray(datos) ? datos : datos.results || [])
        setPaginado(
          Array.isArray(datos)
            ? { count: datos.length, next: null, previous: null }
            : { count: datos.count, next: datos.next, previous: datos.previous },
        )
      } catch (error) {
        console.error('No se pudo traer la lista de contratos.', error)
      }
    }
    traer()
  }, [ruta])

  const totalPaginas = Math.max(1, Math.ceil(paginado.count / POR_PAGINA))

  return (
    <div>
      <p>
        Página {pagina} de {totalPaginas} — {paginado.count} contratos en total.
      </p>
      <div className="fila-acciones">
        <button
          className="boton boton-mini"
          onClick={() => {
            setRuta(paginado.previous)
            setPagina(pagina - 1)
          }}
          disabled={!paginado.previous}
        >
          Anterior
        </button>
        <button
          className="boton boton-mini"
          onClick={() => {
            setRuta(paginado.next)
            setPagina(pagina + 1)
          }}
          disabled={!paginado.next}
        >
          Siguiente
        </button>
      </div>
      <ul>
        {contratos.map((contrato) => (
          <li key={contrato.id_contrato} data-id-contrato={contrato.id_contrato}>
            {contrato.id_contrato} — {contrato.entidad_compradora} — valor{' '}
            ${Number(contrato.valor_total).toLocaleString('es-CO')}
          </li>
        ))}
      </ul>
    </div>
  )
}
