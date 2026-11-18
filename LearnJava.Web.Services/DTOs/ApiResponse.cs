using System.Net;

namespace LearnJava.Web.Services.DTOs;

public record ApiResponse(
    int Status,
    string Message,
    DateTime Timestamp
)
{
    public static ApiResponse Of(int status, string message) =>
        new(status, message, DateTime.UtcNow);

    public static ApiResponse Of(HttpStatusCode status, string message) =>
        Of((int)status, message);

    public static ApiResponse<T> Of<T>(int status, string message) =>
        new(status, message, DateTime.UtcNow, default);

    public static ApiResponse<T> Of<T>(HttpStatusCode status, string message) =>
        Of<T>((int)status, message);

    public static ApiResponse<T> Of<T>(int status, string message, T? data) =>
        new(status, message, DateTime.UtcNow, data);

    public static ApiResponse<T> Of<T>(HttpStatusCode status, string message, T? data) =>
        Of((int)status, message, data);
}

public record ApiResponse<T>(
    int Status,
    string Message,
    DateTime Timestamp,
    T? Data = default
)
{
    public static ApiResponse<T> Of(int status, string message, T? data = default) =>
        new(status, message, DateTime.UtcNow, data);

    public static ApiResponse<T> Of(HttpStatusCode status, string message, T? data = default) =>
        Of((int)status, message, data);
}

