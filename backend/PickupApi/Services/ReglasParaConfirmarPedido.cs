using System.Collections.Concurrent;
using System.Text.RegularExpressions;

namespace PickupApi.Services;

public record ClientePedido(string Nombre, string Telefono, string Correo);

public record LineaPedido(string ProductoId, string Nombre, decimal PrecioUnitario, int Cantidad);

public record PedidoConfirmado(
    string Numero,
    string TiendaId,
    string TiendaNombre,
    LineaPedido[] Items,
    ClientePedido Cliente,
    decimal Subtotal,
    decimal Total,
    DateTime CreadoEn);

public class ReglasParaConfirmarPedido
{
    private readonly DatosDeTiendasYProductos _catalogo;
    private readonly ConcurrentDictionary<string, PedidoConfirmado> _pedidos = new();

    public ReglasParaConfirmarPedido(DatosDeTiendasYProductos catalogo) => _catalogo = catalogo;

    public PedidoConfirmado Confirmar(string tiendaId, string nombre, string telefono, string? correo, IReadOnlyList<(string ProductoId, int Cantidad)> lineas)
    {
        var tienda = _catalogo.ObtenerTienda(tiendaId);
        nombre = nombre.Trim();
        telefono = telefono.Trim();
        correo = (correo ?? "").Trim();

        if (!Regex.IsMatch(nombre, @"^\p{L}[\p{L}\s'.-]{1,79}$"))
            throw new InvalidOperationException("Escribe el nombre de quien va a recoger el pedido.");
        if (Digitos(telefono).Length != 8)
            throw new InvalidOperationException("Escribe un teléfono de 8 dígitos. Puedes anteponer 502.");
        if (correo.Length > 0 && !Regex.IsMatch(correo, @"^[^\s@]+@[^\s@]+\.[^\s@]+$"))
            throw new InvalidOperationException("El correo no tiene un formato válido. Si no quieres dejarlo, bórralo.");
        if (lineas.Count == 0)
            throw new InvalidOperationException("Agrega al menos un producto antes de confirmar.");

        var items = new List<LineaPedido>();
        foreach (var linea in lineas)
        {
            if (linea.Cantidad < 1 || linea.Cantidad > 20)
                throw new InvalidOperationException("La cantidad de cada producto debe estar entre 1 y 20.");
            var producto = _catalogo.ObtenerProducto(linea.ProductoId);
            if (!producto.Tiendas.Contains(tienda.Id))
                throw new InvalidOperationException("Hay un producto del carrito que no está disponible en esta tienda.");
            items.Add(new LineaPedido(producto.Id, producto.Nombre, producto.Precio, linea.Cantidad));
        }

        var subtotal = items.Sum(item => item.PrecioUnitario * item.Cantidad);
        string numero;
        do
        {
            numero = $"PU-{Random.Shared.Next(1000, 10000)}";
        }
        while (_pedidos.ContainsKey(numero));

        var pedido = new PedidoConfirmado(
            numero,
            tienda.Id,
            tienda.Nombre,
            items.ToArray(),
            new ClientePedido(nombre, telefono, correo),
            subtotal,
            subtotal,
            DateTime.UtcNow);
        _pedidos[numero] = pedido;
        return pedido;
    }

    public PedidoConfirmado Obtener(string numero) =>
        _pedidos.TryGetValue(numero, out var pedido)
            ? pedido
            : throw new InvalidOperationException("No hay un pedido con ese número.");

    static string Digitos(string telefono)
    {
        var digits = new string(telefono.Where(char.IsDigit).ToArray());
        if (digits.StartsWith("502") && digits.Length == 11) return digits[3..];
        return digits;
    }
}
