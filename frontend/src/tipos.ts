export type Store = {
  id: string
  name: string
  address: string
  hours: string
  lat: number
  lng: number
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  storeIds: string[]
}

export type LineaDelCarrito = {
  productId: string
  quantity: number
}

export type Customer = {
  name: string
  phone: string
  email: string
}

export type OrderItem = {
  productId: string
  name: string
  unitPrice: number
  quantity: number
}

export type ConfirmedOrder = {
  number: string
  storeId: string
  storeName: string
  items: OrderItem[]
  customer: Customer
  subtotal: number
  total: number
  createdAt: string
}

export type OrderState = {
  storeId: string | null
  lines: LineaDelCarrito[]
  customer: Customer
  order: ConfirmedOrder | null
  notice: string | null
}
