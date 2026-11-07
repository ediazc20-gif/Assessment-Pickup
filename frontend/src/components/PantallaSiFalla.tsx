import { Component, type ReactNode } from 'react'

type BoundaryState = { failed: boolean }

export class PantallaSiFalla extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { failed: false }

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="app-error">
          <h1>No se pudo mostrar el pedido</h1>
          <p>Recarga la página. Si el problema sigue, vacía los datos de este sitio en el navegador.</p>
          <button type="button" className="button" onClick={() => window.location.assign('/')}>
            Volver al inicio
          </button>
        </main>
      )
    }
    return this.props.children
  }
}
