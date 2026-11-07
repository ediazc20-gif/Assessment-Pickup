import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { PantallaSiFalla } from './components/PantallaSiFalla.tsx'
import { MarcoDePaginas } from './components/MarcoDePaginas.tsx'
import { ProveedorDelPedido } from './context/EstadoDelPedido.tsx'
import { PaginaCarrito } from './pages/PaginaCarrito.tsx'
import { PaginaProductos } from './pages/PaginaProductos.tsx'
import { PaginaConfirmar } from './pages/PaginaConfirmar.tsx'
import { PaginaPedidoListo } from './pages/PaginaPedidoListo.tsx'
import { PaginaTiendas } from './pages/PaginaTiendas.tsx'

function PaginaNoExiste() {
  return (
    <>
      <h1>Página no encontrada</h1>
      <p className="banner" role="alert">Esa dirección no forma parte del pedido.</p>
      <Link className="button" to="/">Ir al mapa</Link>
    </>
  )
}

export default function App() {
  return (
    <PantallaSiFalla>
      <ProveedorDelPedido>
        <BrowserRouter>
          <Routes>
            <Route element={<MarcoDePaginas />}>
              <Route index element={<PaginaTiendas />} />
              <Route path="tienda/:storeId" element={<PaginaProductos />} />
              <Route path="carrito" element={<PaginaCarrito />} />
              <Route path="confirmar" element={<PaginaConfirmar />} />
              <Route path="pedido/:number" element={<PaginaPedidoListo />} />
              <Route path="*" element={<PaginaNoExiste />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProveedorDelPedido>
    </PantallaSiFalla>
  )
}
