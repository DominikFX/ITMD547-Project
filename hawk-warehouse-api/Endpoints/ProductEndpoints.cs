using Microsoft.EntityFrameworkCore;
using hawk_warehouse_api.Data;
using hawk_warehouse_api.Models;

namespace hawk_warehouse_api.Endpoints;

public static class ProductEndpoints
{
  public static void MapProductEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/products");

    // GET /api/products
    group.MapGet("/", async (WarehouseContext db) =>
    {
      return await db.Products.OrderByDescending(p => p.Stock).ToListAsync();
    })
    .WithName("GetProducts");

    // POST /api/products
    group.MapPost("/", async (WarehouseContext db, Product product) =>
    {
      db.Products.Add(product);
      await db.SaveChangesAsync();
      return Results.Created($"/api/products/{product.Id}", product);
    })
    .WithName("AddProduct");

    // PUT /api/products
    group.MapPut("/", async (WarehouseContext db, Product product) =>
    {
      var existing = await db.Products.FindAsync(product.Id);
      if (existing == null) return Results.NotFound();

      existing.Name = product.Name;
      existing.Category = product.Category;
      existing.Stock = product.Stock;
      existing.PriceMsrp = product.PriceMsrp;
      existing.PriceSale = product.PriceSale;
      existing.RentalRatePerDay = product.RentalRatePerDay;
      existing.Description = product.Description;
      existing.ImageUrl = product.ImageUrl;

      await db.SaveChangesAsync();
      return Results.Ok(existing);
    })
    .WithName("UpdateProduct");

    // DELETE /api/products/{id}
    group.MapDelete("/{id}", async (WarehouseContext db, string id) =>
    {
      var p = await db.Products.FindAsync(id);
      if (p == null) return Results.NotFound();

      db.Products.Remove(p);
      await db.SaveChangesAsync();
      return Results.Ok();
    })
    .WithName("DeleteProduct");
  }
}