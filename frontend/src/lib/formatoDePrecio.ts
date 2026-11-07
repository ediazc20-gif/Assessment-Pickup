const quetzal = new Intl.NumberFormat('es-GT', {
  style: 'currency',
  currency: 'GTQ',
})

export function quetzales(amount: number) {
  return quetzal.format(amount)
}
