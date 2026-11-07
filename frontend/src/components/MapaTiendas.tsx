import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import type { LatLngExpression } from 'leaflet'
import type { Store } from '../tipos.ts'

const defaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function FlyTo({ position }: { position: LatLngExpression | null }) {
  const map = useMap()
  useEffect(() => {
    if (!position) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    map.flyTo(position, 15, { duration: reduce ? 0 : 0.5 })
  }, [map, position])
  return null
}

type MapaTiendasProps = {
  stores: Store[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function MapaTiendas({ stores, selectedId, onSelect }: MapaTiendasProps) {
  const [mapError, setMapError] = useState(false)
  const selected = stores.find((store) => store.id === selectedId)
  const focus: LatLngExpression | null = selected ? [selected.lat, selected.lng] : null

  return (
    <div className="map-wrap">
      {mapError ? (
        <p className="banner" role="status">El mapa no cargó. Puedes elegir la tienda en la lista.</p>
      ) : null}
      <div className="store-map">
        <MapContainer center={[14.611, -90.514]} zoom={12} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            eventHandlers={{ tileerror: () => setMapError(true) }}
          />
          <FlyTo position={focus} />
          {stores.map((store) => (
            <Marker key={store.id} position={[store.lat, store.lng]} icon={defaultIcon}>
              <Popup>
                <strong>{store.name}</strong>
                <p>{store.address}</p>
                <p>{store.hours}</p>
                <button type="button" className="button" onClick={() => onSelect(store.id)}>
                  Elegir esta tienda
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
