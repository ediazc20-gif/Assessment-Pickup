import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { usePedido } from '../context/EstadoDelPedido.tsx'

const steps = [
  { id: 'Tienda', label: 'Tienda', to: '/' },
  { id: 'Productos', label: 'Productos', to: '' },
  { id: 'Carrito', label: 'Carrito', to: '/carrito' },
  { id: 'Confirmar', label: 'Confirmar', to: '/confirmar' },
] as const

function currentStep(pathname: string) {
  if (pathname.startsWith('/confirmar')) return 'Confirmar'
  if (pathname.startsWith('/carrito')) return 'Carrito'
  if (pathname.startsWith('/tienda')) return 'Productos'
  return 'Tienda'
}

export function MarcoDePaginas() {
  const { state, itemCount, dismissNotice } = usePedido()
  const { pathname } = useLocation()
  const active = currentStep(pathname)
  const onConfirmation = pathname.startsWith('/pedido/')

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">Recoge</Link>
        <p className="brand-note">Pedido para recoger en tienda</p>
        <Link to="/carrito" className="cart-link">Carrito ({itemCount})</Link>
      </header>
      {state.notice ? (
        <div className="banner" role="status">
          <p>{state.notice}</p>
          <button type="button" className="text-button" onClick={dismissNotice}>Cerrar</button>
        </div>
      ) : null}
      {onConfirmation ? null : (
        <nav className="steps-wrap" aria-label="Etapas del pedido">
          <ol className="steps">
            {steps.map((step) => {
              const to = step.id === 'Productos' && state.storeId ? `/tienda/${state.storeId}` : step.to
              const enabled = step.id === 'Tienda'
                || (step.id === 'Productos' && Boolean(state.storeId))
                || (step.id === 'Carrito' && Boolean(state.storeId))
                || (step.id === 'Confirmar' && Boolean(state.storeId) && state.lines.length > 0)
              return (
                <li key={step.id}>
                  {enabled ? (
                    <NavLink to={to} end={step.id === 'Tienda'} aria-current={active === step.id ? 'step' : undefined}>
                      {step.label}
                    </NavLink>
                  ) : (
                    <span aria-disabled="true">{step.label}</span>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      )}
      <main>
        <Outlet />
      </main>
    </div>
  )
}
