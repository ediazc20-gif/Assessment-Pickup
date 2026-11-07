import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FormularioDelCliente } from '../components/FormularioDelCliente.tsx'
import { ResumenDelPedido } from '../components/ResumenDelPedido.tsx'
import { usePedido } from '../context/EstadoDelPedido.tsx'
import { useProductos, useTiendas } from '../hooks/useDatosDeTienda.ts'
import { armarLineas } from '../lib/calcularLineas.ts'
import { validarCliente } from '../lib/validarDatosCliente.ts'

export function PaginaConfirmar() {
  const navigate = useNavigate()
  const { state, setCustomer, confirmOrder } = usePedido()
  const { tiendas, loading } = useTiendas()
  const store = tiendas.find((tienda) => tienda.id === state.storeId)
  const { productos } = useProductos(store?.id)
  const items = armarLineas(state.lines, productos)
  const [attempted, setAttempted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const errors = attempted ? validarCliente(state.customer) : {}

  if (submitted) return null

  if (loading) return <p>Cargando tienda...</p>

  if (!store) {
    return (
      <>
        <h1>Confirmar pedido</h1>
        <p className="banner" role="status">Primero elige una tienda en el mapa.</p>
        <Link className="button" to="/">Ver tiendas</Link>
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <h1>Confirmar pedido</h1>
        <p className="banner" role="status">El carrito está vacío.</p>
        <Link className="button" to={`/tienda/${store.id}`}>Ver productos</Link>
      </>
    )
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return
    setAttempted(true)
    const fieldErrors = validarCliente(state.customer)
    if (fieldErrors.name) {
      nameRef.current?.focus()
      return
    }
    if (fieldErrors.phone) {
      phoneRef.current?.focus()
      return
    }
    if (fieldErrors.email) {
      emailRef.current?.focus()
      return
    }
    setSending(true)
    const result = await confirmOrder()
    if (!result.ok) {
      setFormError(result.message)
      setSending(false)
      return
    }
    setSubmitted(true)
    navigate(`/pedido/${result.number}`)
  }

  return (
    <>
      <h1>Confirmar pedido</h1>
      <form className="split" onSubmit={submit} noValidate>
        <div>
          <FormularioDelCliente
            value={state.customer}
            errors={errors}
            nameRef={nameRef}
            phoneRef={phoneRef}
            emailRef={emailRef}
            onChange={setCustomer}
          />
          {formError ? <p className="banner" role="alert">{formError}</p> : null}
          <p className="page-actions">
            <button type="submit" className="button" disabled={sending}>
              {sending ? 'Confirmando...' : 'Confirmar pedido'}
            </button>
          </p>
        </div>
        <ResumenDelPedido storeName={store.name} items={items} />
      </form>
    </>
  )
}
