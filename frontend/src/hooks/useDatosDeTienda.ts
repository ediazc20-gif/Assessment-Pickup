import { useEffect, useState } from 'react'
import { listarProductos, listarTiendas, mensaje } from '../conexionApi.ts'
import type { Product, Store } from '../tipos.ts'

export function useTiendas() {
  const [tiendas, setTiendas] = useState<Store[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let activo = true
    listarTiendas()
      .then((data) => {
        if (activo) setTiendas(data)
      })
      .catch((error: unknown) => {
        if (activo) setError(mensaje(error, 'No se pudieron cargar las tiendas.'))
      })
      .finally(() => {
        if (activo) setLoading(false)
      })
    return () => {
      activo = false
    }
  }, [])

  return { tiendas, error, loading }
}

export function useProductos(tiendaId: string | undefined) {
  const [productos, setProductos] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(Boolean(tiendaId))

  useEffect(() => {
    if (!tiendaId) return
    let activo = true
    setLoading(true)
    listarProductos(tiendaId)
      .then((data) => {
        if (!activo) return
        setProductos(data)
        setError(null)
      })
      .catch((error: unknown) => {
        if (activo) setError(mensaje(error, 'No se pudieron cargar los productos.'))
      })
      .finally(() => {
        if (activo) setLoading(false)
      })
    return () => {
      activo = false
    }
  }, [tiendaId])

  return { productos, error, loading }
}
