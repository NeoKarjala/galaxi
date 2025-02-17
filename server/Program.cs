using GaLaXiBackend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Lis�� PostgreSQL-tietokantayhteys
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Lis�� palvelut (Controllers ja Swagger dokumentaatio)
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Ota Swagger k�ytt��n vain kehitysymp�rist�ss�
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Ota k�ytt��n reititys ja ohjaa pyynn�t oikeisiin kontrolleriin
// app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
