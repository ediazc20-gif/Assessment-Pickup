import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { confirmarPedido, mensaje } from '../conexionApi.ts'
import { validarCliente } from '../lib/validarDatosCliente.ts'
import type { LineaDelCarrito, ConfirmedOrder, Customer, OrderItem, OrderState } from '../tipos.ts'

const STORAGE_KEY = 'recoge-pedido'
const MAX_QUANTITY = 20

const emptyCustomer: Customer = { name: '', phone: '', email: '' }

const emptyState: OrderState = {
  storeId: null,
  lines: [],
  customer: emptyCustomer,
  order: null,
  notice: null,
}

type ConfirmResult = { ok: true; number: string } | { ok: false; message: string }

type OrderApi = {
  state: OrderState
  itemCount: number
  selectStore: (id: string) => void
  addProduct: (productId: string) => void
  increment: (productId: string) => void
  decrement: (productId: string) => void
  remove: (productId: string) => void
  setCustomer: (customer: Customer) => void
  confirmOrder: () => Promise<ConfirmResult>
  dismissNotice: () => void
}

const ContextoDelPedido = createContext<OrderApi | null>(null)

function isLine(value: unknown): value is LineaDelCarrito {
  if (!value || typeof value !== 'object') return false
  const line = value as LineaDelCarrito
  return typeof line.productId === 'string' && Number.isInteger(line.quantity) && line.quantity > 0
}

function isOrderItem(value: unknown): value is OrderItem {
  if (!value || typeof value !== 'object') return false
  const item = value as OrderItem
  return typeof item.productId === 'string'
    && typeof item.name === 'string'
    && typeof item.unitPrice === 'number'
    && Number.isInteger(item.quantity)
    && item.quantity > 0
}

function isOrder(value: unknown): value is ConfirmedOrder {
  if (!value || typeof value !== 'object') return false
  const order = value as ConfirmedOrder
  return typeof order.number === 'string'
    && typeof order.storeId === 'string'
    && typeof order.storeName === 'string'
    && typeof order.subtotal === 'number'
    && typeof order.total === 'number'
    && typeof order.createdAt === 'string'
    && Array.isArray(order.items)
    && order.items.every(isOrderItem)
}

function loadState(): OrderState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState
    const parsed = JSON.parse(raw) as Partial<OrderState>
    const storeId = typeof parsed.storeId === 'string' && parsed.storeId ? parsed.storeId : null
    const lines = Array.isArray(parsed.lines) ? parsed.lines.filter(isLine) : []
    const customer = parsed.customer
    const order = isOrder(parsed.order) ? parsed.order : null
    return {
      storeId,
      lines,
      customer: {
        name: typeof customer?.name === 'string' ? customer.name : '',
        phone: typeof customer?.phone === 'string' ? customer.phone : '',
        email: typeof customer?.email === 'string' ? customer.email : '',
      },
      order,
      notice: null,
    }
  } catch {
    return emptyState
  }
}

export function ProveedorDelPedido({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OrderState>(loadState)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const persisted = {
      storeId: state.storeId,
      lines: state.lines,
      customer: state.customer,
      order: state.order,
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
  }, [state])

  const selectStore = useCallback((id: string) => {
    setState((prev) => {
      if (!id) return { ...prev, notice: 'Esa tienda no existe.' }
      if (prev.storeId === id) return prev
      const cleared = prev.lines.length > 0
      return {
        ...prev,
        storeId: id,
        lines: [],
        notice: cleared
          ? 'Cambiaste de tienda, así que el carrito se vació. Cada tienda muestra solo sus productos.'
          : null,
      }
    })
  }, [])

  const changeQuantity = useCallback((productId: string, delta: number) => {
    setState((prev) => {
      if (!prev.storeId) return { ...prev, notice: 'Elige una tienda antes de armar el pedido.' }
      const current = prev.lines.find((line) => line.productId === productId)?.quantity ?? 0
      const next = current + delta
      if (next > MAX_QUANTITY) {
        return { ...prev, notice: `El máximo es ${MAX_QUANTITY} unidades de este producto.` }
      }
      const lines = next <= 0
        ? prev.lines.filter((line) => line.productId !== productId)
        : current === 0
          ? [...prev.lines, { productId, quantity: next }]
          : prev.lines.map((line) => (line.productId === productId ? { ...line, quantity: next } : line))
      return { ...prev, lines, notice: null }
    })
  }, [])

  const addProduct = useCallback((productId: string) => changeQuantity(productId, 1), [changeQuantity])
  const increment = useCallback((productId: string) => changeQuantity(productId, 1), [changeQuantity])
  const decrement = useCallback((productId: string) => changeQuantity(productId, -1), [changeQuantity])

  const remove = useCallback((productId: string) => {
    setState((prev) => ({
      ...prev,
      lines: prev.lines.filter((line) => line.productId !== productId),
    }))
  }, [])

  const setCustomer = useCallback((customer: Customer) => {
    setState((prev) => ({ ...prev, customer }))
  }, [])

  const confirmOrder = useCallback(async (): Promise<ConfirmResult> => {
    const current = stateRef.current
    const fieldErrors = validarCliente(current.customer)
    const message = fieldErrors.name ?? fieldErrors.phone ?? fieldErrors.email
    if (!current.storeId) return { ok: false, message: 'Elige una tienda antes de confirmar.' }
    if (current.lines.length === 0) return { ok: false, message: 'Agrega al menos un producto antes de confirmar.' }
    if (message) return { ok: false, message }

    try {
      const order = await confirmarPedido({
        tiendaId: current.storeId,
        cliente: {
          nombre: current.customer.name.trim(),
          telefono: current.customer.phone.trim(),
          correo: current.customer.email.trim(),
        },
        lineas: current.lines.map((line) => ({ productoId: line.productId, cantidad: line.quantity })),
      })
      setState((prev) => ({ ...prev, lines: [], order, notice: null }))
      return { ok: true, number: order.number }
    } catch (error) {
      return { ok: false, message: mensaje(error, 'No se pudo confirmar el pedido.') }
    }
  }, [])

  const dismissNotice = useCallback(() => {
    setState((prev) => ({ ...prev, notice: null }))
  }, [])

  const api = useMemo<OrderApi>(() => ({
    state,
    itemCount: state.lines.reduce((sum, line) => sum + line.quantity, 0),
    selectStore,
    addProduct,
    increment,
    decrement,
    remove,
    setCustomer,
    confirmOrder,
    dismissNotice,
  }), [state, selectStore, addProduct, increment, decrement, remove, setCustomer, confirmOrder, dismissNotice])

  return <ContextoDelPedido.Provider value={api}>{children}</ContextoDelPedido.Provider>
}

export function usePedido() {
  const value = useContext(ContextoDelPedido)
  if (!value) throw new Error('usePedido debe usarse dentro de ProveedorDelPedido.')
  return value
}
