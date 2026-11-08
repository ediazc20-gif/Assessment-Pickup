using Microsoft.AspNetCore.Mvc;
using PickupApi.Services;

namespace PickupApi.Controllers;

[ApiController]
[Route("api/pedidos")]
public class ControladorDePedidos : ControllerBase
{
    private readonly ReglasParaConfirmarPedido _pedidos;

    public ControladorDePedidos(ReglasParaConfirmarPedido pedidos) => _pedidos = pedidos;

    public record ClienteRequest(string Nombre, string Telefono, string? Correo);
    public record LineaRequest(string ProductoId, int Cantidad);
    public record PedidoRequest(string TiendaId, ClienteRequest? Cliente, List<LineaRequest>? Lineas);

    [HttpPost]
    public IActionResult Confirmar([FromBody] PedidoRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.TiendaId) || request.Cliente is null || request.Lineas is null)
            return BadRequest(new { codigo = 400, mensaje = "El pedido está incompleto." });
        if (string.IsNullOrWhiteSpace(request.Cliente.Nombre) || string.IsNullOrWhiteSpace(request.Cliente.Telefono))
            return BadRequest(new { codigo = 400, mensaje = "El nombre y el teléfono son obligatorios." });

        try
        {
            var pedido = _pedidos.Confirmar(
                request.TiendaId,
                request.Cliente.Nombre,
                request.Cliente.Telefono,
                request.Cliente.Correo,
                request.Lineas.Select(linea => (linea.ProductoId, linea.Cantidad)).ToArray());
            return Ok(new { codigo = 200, mensaje = "Tu pedido ha sido recibido correctamente.", data = pedido });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { codigo = 400, mensaje = ex.Message });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine(ex);
            return StatusCode(500, new { codigo = 500, mensaje = "No se pudo confirmar el pedido." });
        }
    }

    [HttpGet("{numero}")]
    public IActionResult Obtener(string numero)
    {
        try
        {
            return Ok(new { codigo = 200, data = _pedidos.Obtener(numero) });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { codigo = 400, mensaje = ex.Message });
        }
    }
}
