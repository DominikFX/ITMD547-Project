using Microsoft.EntityFrameworkCore;
using hawk_warehouse_api.Data;
using hawk_warehouse_api.Models;

namespace hawk_warehouse_api.Endpoints;

public static class OrderEndpoints
{
  public static void MapOrderEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/orders");

    // GET /api/orders
    group.MapGet("/", async (WarehouseContext db) =>
    {
      return await db.Orders
              .Include(o => o.Items)
              .OrderByDescending(o => o.CreatedAt)
              .ToListAsync();
    })
    .WithName("GetOrders");

    // POST /api/orders
    group.MapPost("/", async (WarehouseContext db, Order order) =>
    {
      if (string.IsNullOrEmpty(order.Id))
      {
        order.Id = Guid.NewGuid().ToString();
      }

      order.CreatedAt = DateTime.UtcNow;
      order.Status = "placed";

      db.Orders.Add(order);

      foreach (var item in order.Items)
      {
        var product = await db.Products.FindAsync(item.ProductId);
        if (product != null)
        {
          product.Stock = Math.Max(0, product.Stock - item.Qty);
        }
      }

      await db.SaveChangesAsync();
      return Results.Created($"/api/orders/{order.Id}", order);
    })
    .WithName("CreateOrder");

    // PUT /api/orders/{id}/status
    group.MapPut("/{id}/status", async (WarehouseContext db, string id, string status) =>
    {
      var order = await db.Orders.FindAsync(id);
      if (order == null) return Results.NotFound();

      order.Status = status;
      await db.SaveChangesAsync();
      return Results.Ok(order);
    })
    .WithName("UpdateOrderStatus");
  }
}