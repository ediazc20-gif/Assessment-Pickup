import type { RefObject } from 'react'
import type { FieldErrors } from '../lib/validarDatosCliente.ts'
import type { Customer } from '../tipos.ts'

type FormularioDelClienteProps = {
  value: Customer
  errors: FieldErrors
  nameRef: RefObject<HTMLInputElement | null>
  phoneRef: RefObject<HTMLInputElement | null>
  emailRef: RefObject<HTMLInputElement | null>
  onChange: (customer: Customer) => void
}

export function FormularioDelCliente({ value, errors, nameRef, phoneRef, emailRef, onChange }: FormularioDelClienteProps) {
  function update(field: keyof Customer, fieldValue: string) {
    onChange({ ...value, [field]: fieldValue })
  }

  return (
    <fieldset className="customer-form">
      <legend>Datos de quien recoge</legend>
      <label>
        Nombre
        <input
          ref={nameRef}
          name="name"
          autoComplete="name"
          value={value.name}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'error-name' : undefined}
          onChange={(event) => update('name', event.target.value)}
        />
        {errors.name ? <span id="error-name" className="field-error">{errors.name}</span> : null}
      </label>
      <label>
        Teléfono
        <input
          ref={phoneRef}
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="55555555"
          value={value.phone}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'error-phone' : undefined}
          onChange={(event) => update('phone', event.target.value)}
        />
        {errors.phone ? <span id="error-phone" className="field-error">{errors.phone}</span> : null}
      </label>
      <label>
        Correo electrónico <span className="muted">(opcional)</span>
        <input
          ref={emailRef}
          name="email"
          type="email"
          autoComplete="email"
          value={value.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'error-email' : undefined}
          onChange={(event) => update('email', event.target.value)}
        />
        {errors.email ? <span id="error-email" className="field-error">{errors.email}</span> : null}
      </label>
    </fieldset>
  )
}
