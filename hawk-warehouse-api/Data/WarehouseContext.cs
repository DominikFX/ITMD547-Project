using Microsoft.EntityFrameworkCore;
using hawk_warehouse_api.Models;

namespace hawk_warehouse_api.Data;

public class WarehouseContext : DbContext
{
  public WarehouseContext(DbContextOptions<WarehouseContext> options) : base(options) { }

  public DbSet<Product> Products { get; set; }
  public DbSet<Order> Orders { get; set; }
  public DbSet<OrderItem> OrderItems { get; set; }
}