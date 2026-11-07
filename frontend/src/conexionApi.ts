import axios from 'axios'
import type { ConfirmedOrder, Product, Store } from './tipos.ts'

export const http = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '' })

export function mensaje(error: unknown, fallback: string) {
  const data = (error as { response?: { data?: { mensaje?: string } } }).response?.data
  return data?.mensaje || fallback
}

type TiendaDto = {
  id: string
  nombre: string
  direccion: string
  horario: string
  lat: number
  lng: number
}

type ProductoDto = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  imagen: string
  tiendas: string[]
}

type PedidoDto = {
  numero: string
  tiendaId: string
  tiendaNombre: string
  items: { productoId: string; nombre: string; precioUnitario: number; cantidad: number }[]
  cliente: { nombre: string; telefono: string; correo: string }
  subtotal: number
  total: number
  creadoEn: string
}

type Respuesta<T> = { codigo: number; mensaje?: string; data: T }

function aTienda(dto: TiendaDto): Store {
  return { id: dto.id, name: dto.nombre, address: dto.direccion, hours: dto.horario, lat: dto.lat, lng: dto.lng }
}

function aProducto(dto: ProductoDto): Product {
  return {
    id: dto.id,
    name: dto.nombre,
    description: dto.descripcion,
    price: dto.precio,
    image: dto.imagen,
    storeIds: dto.tiendas,
  }
}

function aPedido(dto: PedidoDto): ConfirmedOrder {
  return {
    number: dto.numero,
    storeId: dto.tiendaId,
    storeName: dto.tiendaNombre,
    items: dto.items.map((item) => ({
      productId: item.productoId,
      name: item.nombre,
      unitPrice: item.precioUnitario,
      quantity: item.cantidad,
    })),
    customer: { name: dto.cliente.nombre, phone: dto.cliente.telefono, email: dto.cliente.correo },
    subtotal: dto.subtotal,
    total: dto.total,
    createdAt: dto.creadoEn,
  }
}

let tiendasPendiente: Promise<Store[]> | null = null

export function listarTiendas() {
  if (!tiendasPendiente) {
    tiendasPendiente = http.get<Respuesta<TiendaDto[]>>('/api/tiendas')
      .then((respuesta) => respuesta.data.data.map(aTienda))
      .catch((error: unknown) => {
        tiendasPendiente = null
        throw error
      })
  }
  return tiendasPendiente
}

export function listarProductos(tiendaId: string) {
  return http.get<Respuesta<ProductoDto[]>>(`/api/tiendas/${tiendaId}/productos`)
    .then((respuesta) => respuesta.data.data.map(aProducto))
}

export function confirmarPedido(pedido: {
  tiendaId: string
  cliente: { nombre: string; telefono: string; correo: string }
  lineas: { productoId: string; cantidad: number }[]
}) {
  return http.post<Respuesta<PedidoDto>>('/api/pedidos', pedido)
    .then((respuesta) => aPedido(respuesta.data.data))
}

export function obtenerPedido(numero: string) {
  return http.get<Respuesta<PedidoDto>>(`/api/pedidos/${numero}`)
    .then((respuesta) => aPedido(respuesta.data.data))
}
