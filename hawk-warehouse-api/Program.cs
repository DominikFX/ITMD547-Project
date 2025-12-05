using Microsoft.EntityFrameworkCore;
using Azure.Storage.Blobs;
using System.Text.Json.Serialization;

using hawk_warehouse_api.Data;
using hawk_warehouse_api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// CORS
builder.Services.AddCors(options =>
{
  options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

// SQL
builder.Services.AddDbContext<WarehouseContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5, 
            maxRetryDelay: TimeSpan.FromSeconds(30), 
            errorNumbersToAdd: null)
    ));
// Azure
builder.Services.AddSingleton(x => 
  new BlobServiceClient(builder.Configuration.GetConnectionString("AzureStorage")));

builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

var app = builder.Build();

if (app.Environment.IsDevelopment())
  app.MapOpenApi();

// Database init
using (var scope = app.Services.CreateScope())
{
  var db = scope.ServiceProvider.GetRequiredService<WarehouseContext>();
  db.Database.EnsureCreated();
}

app.UseCors();
app.UseHttpsRedirection();

app.MapProductEndpoints();
app.MapOrderEndpoints();
app.MapImageEndpoints();

app.Run();