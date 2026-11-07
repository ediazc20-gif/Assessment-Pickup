import type { LineaDelCarrito, OrderItem, Product } from '../tipos.ts'

export function armarLineas(lines: LineaDelCarrito[], products: Product[]): OrderItem[] {
  return lines.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId)
    if (!product) return []
    return [{
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity: line.quantity,
    }]
  })
}
