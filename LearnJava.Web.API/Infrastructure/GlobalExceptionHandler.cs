using System.Net;
using System.Text.Json;
using LearnJava.Web.Domain.Exceptions;
using LearnJava.Web.Services.DTOs;
using Microsoft.AspNetCore.Diagnostics;

namespace LearnJava.Web.API.Infrastructure;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        int statusCode;
        string message;
        object? details;

        switch (exception)
        {
            case ValidationException vex:
                statusCode = (int)vex.StatusCode;
                message = vex.Message;
                details = vex.Errors;
                break;

            case AuthenticationException auex:
                statusCode = (int)auex.StatusCode;
                message = auex.Message;
                details = auex.Errors;
                break;

            case ApiHttpException httpex:
                statusCode = (int)httpex.StatusCode;
                message = httpex.Message;
                details = httpex.Details;
                break;

            default:
                statusCode = (int)HttpStatusCode.InternalServerError;
                message = "An unexpected server error occurred. Please try again later.";
                details = null;
                break;
        }

        if (statusCode >= 500)
        {
            _logger.LogError(exception, "Unhandled exception encountered: {Message}", exception.Message);
        }
        else
        {
            _logger.LogWarning("Handled domain exception: {StatusCode} - {Message}", statusCode, exception.Message);
        }

        httpContext.Response.StatusCode = statusCode;
        httpContext.Response.ContentType = "application/json";

        var response = ApiResponse.Of(statusCode, message, details);

        await httpContext.Response.WriteAsJsonAsync(
            response,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase },
            cancellationToken: cancellationToken
        );

        return true;
    }
}
