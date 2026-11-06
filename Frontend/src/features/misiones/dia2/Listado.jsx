import { useEffect, useState } from 'react'
import { API_URL } from '../../../shared/api'

export default function Listado() {
  const [contratos, setContratos] = useState([])

  useEffect(() => {
    async function traer() {
      try {
        const respuesta = await fetch(`${API_URL}/contratos/`)
        const datos = await respuesta.json()
        setContratos(Array.isArray(datos) ? datos : datos.results || [])
      } catch (error) {
        console.error('No se pudo traer la lista de contratos.', error)
      }
    }
    traer()
  }, [])

  return (
    <ul>
      {contratos.map((contrato) => (
        <li key={contrato.id_contrato} data-id-contrato={contrato.id_contrato}>
          {contrato.id_contrato} — {contrato.entidad_compradora} — valor{' '}
          ${Number(contrato.valor_total).toLocaleString('es-CO')}
        </li>
      ))}
    </ul>
  )
}