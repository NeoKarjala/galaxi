using GaLaXiBackend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Lisää PostgreSQL-tietokantayhteys
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Lisää palvelut (Controllers ja Swagger dokumentaatio)
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Ota Swagger käyttöön vain kehitysympäristössä
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Ota käyttöön reititys ja ohjaa pyynnöt oikeisiin kontrolleriin
// app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
