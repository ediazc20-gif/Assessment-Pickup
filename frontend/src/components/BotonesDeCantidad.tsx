type BotonesDeCantidadProps = {
  quantity: number
  productName: string
  onIncrement: () => void
  onDecrement: () => void
}

export function BotonesDeCantidad({ quantity, productName, onIncrement, onDecrement }: BotonesDeCantidadProps) {
  return (
    <div className="stepper">
      <button type="button" onClick={onDecrement} aria-label={`Quitar una unidad de ${productName}`}>
        −
      </button>
      <span aria-live="polite" aria-label={`Cantidad de ${productName}`}>{quantity}</span>
      <button type="button" onClick={onIncrement} aria-label={`Agregar una unidad de ${productName}`}>
        +
      </button>
    </div>
  )
}
