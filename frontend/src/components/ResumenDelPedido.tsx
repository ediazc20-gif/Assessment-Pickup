import { quetzales } from '../lib/formatoDePrecio.ts'
import type { OrderItem } from '../tipos.ts'

export function ResumenDelPedido({ storeName, items }: { storeName: string; items: OrderItem[] }) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  return (
    <section className="summary" aria-label="Resumen del pedido">
      <h2>Resumen</h2>
      <p>Tienda seleccionada: <strong>{storeName}</strong></p>
      {items.length === 0 ? (
        <p>Todavía no hay productos en el pedido.</p>
      ) : (
        <ul className="summary-lines">
          {items.map((item) => (
            <li key={item.productId}>
              <span>{item.name}</span>
              <span>Cantidad {item.quantity}</span>
              <span>Precio {quetzales(item.unitPrice)}</span>
              <span>Subtotal {quetzales(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="totals">Subtotal <strong>{quetzales(subtotal)}</strong></p>
      <p className="totals">Total <strong>{quetzales(subtotal)}</strong></p>
      <p className="muted">El total es igual al subtotal: recoger en tienda no agrega envío.</p>
    </section>
  )
}
