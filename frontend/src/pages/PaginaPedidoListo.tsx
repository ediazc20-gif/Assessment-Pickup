import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { mensaje, obtenerPedido } from '../conexionApi.ts'
import { ResumenDelPedido } from '../components/ResumenDelPedido.tsx'
import { usePedido } from '../context/EstadoDelPedido.tsx'
import type { ConfirmedOrder } from '../tipos.ts'

export function PaginaPedidoListo() {
  const { number } = useParams()
  const { state } = usePedido()
  const local = state.order?.number === number ? state.order : null
  const [remote, setRemote] = useState<ConfirmedOrder | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!local && Boolean(number))

  useEffect(() => {
    if (local || !number) return
    let activo = true
    obtenerPedido(number)
      .then((pedido) => {
        if (activo) setRemote(pedido)
      })
      .catch((error: unknown) => {
        if (activo) setError(mensaje(error, 'No hay un pedido con ese número.'))
      })
      .finally(() => {
        if (activo) setLoading(false)
      })
    return () => {
      activo = false
    }
  }, [local, number])

  const order = local ?? remote

  if (loading) return <p>Buscando el pedido...</p>

  if (!order) {
    return (
      <>
        <h1>Pedido no encontrado</h1>
        <p className="banner" role="alert">{error ?? `No hay un pedido ${number ?? ''} en esta sesión.`}</p>
        <Link className="button" to="/">Elegir tienda</Link>
      </>
    )
  }

  return (
    <section className="confirmation">
      <p className="order-number">Pedido #{order.number}</p>
      <h1>Tu pedido ha sido recibido correctamente.</h1>
      <p>Lugar de Pickup: {order.storeName}</p>
      <p>Tiempo estimado: 20–30 minutos.</p>
      <p>A nombre de {order.customer.name}. Teléfono {order.customer.phone}.</p>
      {order.customer.email ? <p>Correo {order.customer.email}.</p> : null}
      <ResumenDelPedido storeName={order.storeName} items={order.items} />
      <p className="page-actions">
        <Link className="button" to="/">Hacer otro pedido</Link>
      </p>
    </section>
  )
}
