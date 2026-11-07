import { useNavigate } from 'react-router-dom'
import { MapaTiendas } from '../components/MapaTiendas.tsx'
import { usePedido } from '../context/EstadoDelPedido.tsx'
import { useTiendas } from '../hooks/useDatosDeTienda.ts'

export function PaginaTiendas() {
  const navigate = useNavigate()
  const { state, selectStore } = usePedido()
  const { tiendas, error, loading } = useTiendas()

  function choose(id: string) {
    selectStore(id)
    navigate(`/tienda/${id}`)
  }

  return (
    <>
      <h1>Elige dónde recoger</h1>
      <p className="lede">Hay dos tiendas. El catálogo muestra solo lo que esa tienda tiene hoy.</p>
      {loading ? <p>Cargando tiendas...</p> : null}
      {error ? <p className="banner" role="alert">{error}</p> : null}
      <div className="stores-layout">
        <MapaTiendas stores={tiendas} selectedId={state.storeId} onSelect={choose} />
        <ul className="store-list">
          {tiendas.map((store) => {
            const selected = store.id === state.storeId
            return (
              <li key={store.id}>
                <article className={selected ? 'store-card is-selected' : 'store-card'}>
                  <h2>{store.name}</h2>
                  <p>{store.address}</p>
                  <p>{store.hours}</p>
                  <button type="button" className="button" onClick={() => choose(store.id)}>
                    {selected ? 'Ver productos' : 'Seleccionar tienda'}
                  </button>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
