import { useState } from 'react'

export default function Contador() {
  const [cuenta, setCuenta] = useState(0)

  function aumentar() {
    setCuenta(cuenta + 1)
  }

  function disminuir() {
    if (cuenta > 0) {
      setCuenta(cuenta - 1)
    }
  }

  function reiniciar() {
    setCuenta(0)
  }

  return (
    <div>
      <output data-cuenta>{cuenta}</output>
      <button type="button" data-aumentar onClick={aumentar}>
        Colocar pieza
      </button>
      <button type="button" onClick={disminuir}>
        Quitar pieza
      </button>
      <button type="button" onClick={reiniciar}>
        Reiniciar
      </button>
    </div>
  )
}