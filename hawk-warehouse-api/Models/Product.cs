namespace hawk_warehouse_api.Models;

public class Product
{
  public string Id { get; set; } = string.Empty;
  public string Type { get; set; } = string.Empty;
  public string Name { get; set; } = string.Empty;
  public string Category { get; set; } = string.Empty;
  public decimal? PriceMsrp { get; set; }
  public decimal? PriceSale { get; set; }
  public decimal? RentalRatePerDay { get; set; }
  public int Stock { get; set; }
  public string ImageUrl { get; set; } = string.Empty;
  public string? Description { get; set; }
}