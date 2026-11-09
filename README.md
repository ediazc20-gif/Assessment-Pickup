# Recoge

Pedido para recoger en tienda. El cliente elige la tienda en un mapa, ve solo los productos de esa tienda, arma el carrito y confirma. El número `PU-` lo genera la API.

La carpeta está organizada como el examen de parqueo: un frontend y un backend.

```text
assessment-pickup/
  frontend/          React + TypeScript + Vite
  backend/PickupApi/ ASP.NET Core 8
```

## Cómo ejecutarlo en local

Hacen falta Node.js 20 y .NET 8. En dos terminales:

```bash
cd backend/PickupApi
dotnet run
```

```bash
cd frontend
npm install
npm run dev
```

La API queda en http://localhost:5187 y la aplicación en http://127.0.0.1:5173/. Vite reenvía `/api` a la API, igual que el frontend del parqueo llama a su backend.

Swagger: http://localhost:5187/swagger

## Cómo está hecha la API

El mismo recorrido que `TicketController` y `ParqueoService`:

1. La pantalla llama con axios (`frontend/src/conexionApi.ts`).
2. `ControladorDeTiendas` o `ControladorDePedidos` recibe el cuerpo y revisa que venga completo.
3. `DatosDeTiendasYProductos` o `ReglasParaConfirmarPedido` aplica la regla.
4. La respuesta siempre trae `codigo`, y cuando aplica `mensaje` y `data`.

Rutas:

- `GET /api/tiendas`
- `GET /api/tiendas/{id}/productos`
- `POST /api/pedidos`
- `GET /api/pedidos/{numero}`

El carrito vive en el navegador hasta confirmar. Al confirmar, el service revisa tienda, productos, cantidades, nombre, teléfono y correo, y devuelve el pedido con su número.

## Decisiones

- React en el frontend porque el assessment lo exige.
- ASP.NET Core 8 en el backend, con controllers y services, para explicarlo con el mismo mapa mental del parqueo.
- Sin Oracle ni login. El enunciado los deja fuera. El catálogo está en `DatosDeTiendasYProductos` y los pedidos confirmados quedan en memoria mientras la API está encendida.
- Leaflet, sin llave de Google Maps.
- Subtotal y total coinciden: recoger en tienda no suma envío. Los dos se muestran porque el enunciado pide ambos.

## Recorrido de la aplicación

1. Elegir Tienda Zona 10 en el mapa.
2. Mostrar que el chocolate aparece y los tacos no. Esos datos salen de `GET /api/tiendas/zona-10/productos`.
3. Agregar café y chocolate, subir la cantidad y señalar precio, subtotal y total.
4. Cambiar a Zona 4: el carrito se vacía y aparecen los tacos.
5. Enviar el formulario vacío para ver la validación. Luego completarlo.
6. Leer el número `PU-`, la tienda y los 20–30 minutos. Ese número lo creó `ReglasParaConfirmarPedido`, no la pantalla.
