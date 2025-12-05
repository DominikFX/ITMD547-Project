using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace hawk_warehouse_api.Endpoints;

public static class ImageEndpoints
{
  public static void MapImageEndpoints(this IEndpointRouteBuilder app)
  {
    app.MapPost("/api/upload", async (HttpRequest req, BlobServiceClient blobService) =>
    {
      if (!req.HasFormContentType || req.Form.Files.Count == 0)
        return Results.BadRequest("No file uploaded.");

      var file = req.Form.Files[0];
      var container = blobService.GetBlobContainerClient("product-images");
      await container.CreateIfNotExistsAsync(PublicAccessType.Blob);

      var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
      var blob = container.GetBlobClient(fileName);

      using var stream = file.OpenReadStream();
      await blob.UploadAsync(stream, overwrite: true);

      return Results.Ok(new { url = blob.Uri.ToString() });
    })
    .WithName("UploadImage")
    .DisableAntiforgery();
  }
}