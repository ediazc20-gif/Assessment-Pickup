import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TarjetaProducto } from '../components/TarjetaProducto.tsx'
import { usePedido } from '../context/EstadoDelPedido.tsx'
import { useProductos, useTiendas } from '../hooks/useDatosDeTienda.ts'

export function PaginaProductos() {
  const { storeId } = useParams()
  const { tiendas, loading: loadingTiendas, error: errorTiendas } = useTiendas()
  const store = tiendas.find((tienda) => tienda.id === storeId)
  const { state, selectStore } = usePedido()
  const { productos, loading: loadingProductos, error: errorProductos } = useProductos(store?.id)

  useEffect(() => {
    if (store && state.storeId !== store.id) selectStore(store.id)
  }, [store, state.storeId, selectStore])

  if (loadingTiendas) return <p>Cargando tienda...</p>
  if (errorTiendas) return <p className="banner" role="alert">{errorTiendas}</p>

  if (!store) {
    return (
      <p className="banner" role="alert">
        No encontramos esa tienda. <Link to="/">Volver al mapa</Link>
      </p>
    )
  }

  return (
    <>
      <h1>{store.name}</h1>
      <p className="lede">{store.address}. {store.hours}.</p>
      {loadingProductos ? <p>Cargando productos...</p> : null}
      {errorProductos ? <p className="banner" role="alert">{errorProductos}</p> : null}
      {!loadingProductos && !errorProductos && productos.length === 0 ? (
        <p className="banner" role="status">Esta tienda no tiene productos disponibles ahora.</p>
      ) : (
        <ul className="catalog">
          {productos.map((product) => (
            <li key={product.id}>
              <TarjetaProducto product={product} />
            </li>
          ))}
        </ul>
      )}
      <p className="page-actions">
        <Link className="button" to="/carrito">Ver carrito</Link>
      </p>
    </>
  )
}
