using System.Text.Json.Serialization;

namespace hawk_warehouse_api.Models;

public class Order
{
  public string Id { get; set; } = string.Empty;
  public string Type { get; set; } = string.Empty;
  public decimal Total { get; set; }
  public string Status { get; set; } = string.Empty;
  public DateTime CreatedAt { get; set; }
  public string? MetaJson { get; set; }

  public List<OrderItem> Items { get; set; } = new();
}

public class OrderItem
{
  public int Id { get; set; }
  public string ProductId { get; set; } = string.Empty;
  public int Qty { get; set; }

  [JsonIgnore]
  public Order Order { get; set; } = null!;
}