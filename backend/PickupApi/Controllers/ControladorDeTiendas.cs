using Microsoft.AspNetCore.Mvc;
using PickupApi.Services;

namespace PickupApi.Controllers;

[ApiController]
[Route("api/tiendas")]
public class ControladorDeTiendas : ControllerBase
{
    private readonly DatosDeTiendasYProductos _catalogo;

    public ControladorDeTiendas(DatosDeTiendasYProductos catalogo) => _catalogo = catalogo;

    [HttpGet]
    public IActionResult Listar()
    {
        return Ok(new { codigo = 200, data = _catalogo.Tiendas() });
    }

    [HttpGet("{id}/productos")]
    public IActionResult Productos(string id)
    {
        try
        {
            return Ok(new { codigo = 200, data = _catalogo.ProductosDe(id) });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { codigo = 400, mensaje = ex.Message });
        }
    }
}
