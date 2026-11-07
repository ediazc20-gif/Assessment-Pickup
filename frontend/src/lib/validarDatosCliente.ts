import type { Customer } from '../tipos.ts'

export type FieldErrors = Partial<Record<keyof Customer, string>>

const namePattern = /^[\p{L}][\p{L}\s'.-]{1,79}$/u

export function phoneDigits(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('502') && digits.length === 11) return digits.slice(3)
  return digits
}

export function validarCliente(customer: Customer): FieldErrors {
  const errors: FieldErrors = {}
  const name = customer.name.trim()
  if (!namePattern.test(name)) {
    errors.name = 'Escribe el nombre de quien va a recoger el pedido.'
  }
  if (phoneDigits(customer.phone).length !== 8) {
    errors.phone = 'Escribe un teléfono de 8 dígitos. Puedes anteponer 502.'
  }
  const email = customer.email.trim()
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'El correo no tiene un formato válido. Si no quieres dejarlo, bórralo.'
  }
  return errors
}

