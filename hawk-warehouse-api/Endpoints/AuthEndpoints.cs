using Microsoft.AspNetCore.Mvc;

namespace hawk_warehouse_api.Endpoints;

public record LoginRequest(string Token);

public static class AuthEndpoints
{
  public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
  {
    app.MapPost("/api/auth/login", ([FromBody] LoginRequest req, IConfiguration config) =>
    {
      var actualPassword = config["AdminPassword"];

      if (req.Token == actualPassword)
      {
        return Results.Ok(new { message = "Logged in" });
      }

      return Results.Unauthorized();
    })
    .WithName("Login");
  }
}