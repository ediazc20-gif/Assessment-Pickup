import { quetzales } from '../lib/formatoDePrecio.ts'
import { usePedido } from '../context/EstadoDelPedido.tsx'
import type { Product } from '../tipos.ts'
import { BotonesDeCantidad } from './BotonesDeCantidad.tsx'

export function LineaDelCarrito({ product, quantity }: { product: Product; quantity: number }) {
  const { increment, decrement, remove } = usePedido()
  const subtotal = product.price * quantity

  return (
    <li className="cart-line">
      <img src={product.image} alt="" width={96} height={96} />
      <div>
        <h2>{product.name}</h2>
        <p className="muted">Precio {quetzales(product.price)}</p>
        <button type="button" className="text-button" onClick={() => remove(product.id)}>
          Eliminar
        </button>
      </div>
      <BotonesDeCantidad
        quantity={quantity}
        productName={product.name}
        onIncrement={() => increment(product.id)}
        onDecrement={() => decrement(product.id)}
      />
      <p className="line-subtotal">
        <span className="muted">Subtotal</span>
        <strong>{quetzales(subtotal)}</strong>
      </p>
    </li>
  )
}
