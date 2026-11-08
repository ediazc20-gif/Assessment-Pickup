namespace PickupApi.Services;

public record Tienda(string Id, string Nombre, string Direccion, string Horario, double Lat, double Lng);

public record Producto(string Id, string Nombre, string Descripcion, decimal Precio, string Imagen, string[] Tiendas);

public class DatosDeTiendasYProductos
{
    private static readonly Tienda[] TiendasData =
    [
        new("zona-10", "Tienda Zona 10", "12 calle 1-25, zona 10, Ciudad de Guatemala", "Lunes a sábado, 8:00 a 20:00", 14.5967, -90.5136),
        new("zona-4", "Tienda Zona 4", "Vía 5 4-50, zona 4, Ciudad de Guatemala", "Lunes a domingo, 9:00 a 19:00", 14.6264, -90.5152),
    ];

    private static readonly Producto[] ProductosData =
    [
        new("cafe", "Café de altura", "Taza de 12 oz preparada al momento. Se entrega tapada para llevar.", 42, "/img/cafe.jpg", ["zona-10", "zona-4"]),
        new("pan", "Pan de masa madre", "Pieza del día, horneada en la mañana. Disponible mientras haya existencia.", 28, "/img/pan.jpg", ["zona-10", "zona-4"]),
        new("fruta", "Tabla de fruta", "Porción de fruta de temporada, lista para llevar.", 36, "/img/fruta.jpg", ["zona-10", "zona-4"]),
        new("jugo", "Jugo de naranja", "Vaso de 16 oz, exprimido en tienda. Se entrega frío.", 22, "/img/jugo.jpg", ["zona-10", "zona-4"]),
        new("chocolate", "Chocolate de Antigua", "Barra de 80 g. Solo se prepara y se entrega en Zona 10.", 48, "/img/chocolate.jpg", ["zona-10"]),
        new("tacos", "Tacos de la casa", "Orden de tres tacos. Solo se preparan en Zona 4.", 18, "/img/tacos.jpg", ["zona-4"]),
    ];

    public IReadOnlyList<Tienda> Tiendas() => TiendasData;

    public Tienda ObtenerTienda(string id) =>
        TiendasData.FirstOrDefault(tienda => tienda.Id == id)
        ?? throw new InvalidOperationException("Esa tienda no existe.");

    public IReadOnlyList<Producto> ProductosDe(string tiendaId)
    {
        ObtenerTienda(tiendaId);
        return ProductosData.Where(producto => producto.Tiendas.Contains(tiendaId)).ToArray();
    }

    public Producto ObtenerProducto(string id) =>
        ProductosData.FirstOrDefault(producto => producto.Id == id)
        ?? throw new InvalidOperationException("Ese producto no existe.");
}
