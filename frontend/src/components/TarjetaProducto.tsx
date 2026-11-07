import { usePedido } from '../context/EstadoDelPedido.tsx'
import { quetzales } from '../lib/formatoDePrecio.ts'
import type { Product } from '../tipos.ts'
import { BotonesDeCantidad } from './BotonesDeCantidad.tsx'

export function TarjetaProducto({ product }: { product: Product }) {
  const { state, addProduct, increment, decrement } = usePedido()
  const quantity = state.lines.find((line) => line.productId === product.id)?.quantity ?? 0

  return (
    <article className="product">
      <img src={product.image} alt="" width={640} height={640} />
      <div className="product-body">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p className="price">{quetzales(product.price)}</p>
        {quantity === 0 ? (
          <button type="button" className="button" onClick={() => addProduct(product.id)}>
            Agregar al pedido
          </button>
        ) : (
          <BotonesDeCantidad
            quantity={quantity}
            productName={product.name}
            onIncrement={() => increment(product.id)}
            onDecrement={() => decrement(product.id)}
          />
        )}
      </div>
    </article>
  )
}
