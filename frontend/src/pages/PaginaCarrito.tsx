import { Link } from 'react-router-dom'
import { LineaDelCarrito } from '../components/LineaDelCarrito.tsx'
import { ResumenDelPedido } from '../components/ResumenDelPedido.tsx'
import { usePedido } from '../context/EstadoDelPedido.tsx'
import { useProductos, useTiendas } from '../hooks/useDatosDeTienda.ts'
import { armarLineas } from '../lib/calcularLineas.ts'

export function PaginaCarrito() {
  const { state } = usePedido()
  const { tiendas, loading } = useTiendas()
  const store = tiendas.find((tienda) => tienda.id === state.storeId)
  const { productos, error } = useProductos(store?.id)

  if (loading) return <p>Cargando carrito...</p>

  if (!store) {
    return (
      <>
        <h1>Carrito</h1>
        <p className="banner" role="status">Primero elige una tienda en el mapa.</p>
        <Link className="button" to="/">Ver tiendas</Link>
      </>
    )
  }

  const lines = state.lines.flatMap((line) => {
    const product = productos.find((item) => item.id === line.productId)
    return product ? [{ product, quantity: line.quantity }] : []
  })

  return (
    <>
      <h1>Carrito</h1>
      <p className="lede">Recoges en {store.name}.</p>
      {error ? <p className="banner" role="alert">{error}</p> : null}
      {lines.length === 0 ? (
        <p className="banner" role="status">
          Todavía no hay productos. <Link to={`/tienda/${store.id}`}>Agregar del catálogo</Link>
        </p>
      ) : (
        <div className="split">
          <ul className="cart-list">
            {lines.map(({ product, quantity }) => (
              <LineaDelCarrito key={product.id} product={product} quantity={quantity} />
            ))}
          </ul>
          <div>
            <ResumenDelPedido storeName={store.name} items={armarLineas(state.lines, productos)} />
            <p className="page-actions">
              <Link className="button button-secondary" to={`/tienda/${store.id}`}>Agregar productos</Link>
              <Link className="button" to="/confirmar">Continuar</Link>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
