using PickupApi.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddSingleton<DatosDeTiendasYProductos>();
builder.Services.AddSingleton<ReglasParaConfirmarPedido>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("frontend");
app.MapControllers();
app.Run();
