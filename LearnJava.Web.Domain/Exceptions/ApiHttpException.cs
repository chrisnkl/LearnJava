using System.Net;

namespace LearnJava.Web.Domain.Exceptions;

public class ApiHttpException : ApiException
{
    public HttpStatusCode StatusCode { get; }
    public object? Details { get; }

    public ApiHttpException(HttpStatusCode statusCode, string message, object? details = null, Exception? innerException = null) 
        : base(message, innerException)
    {
        StatusCode = statusCode;
        Details = details;
    }

    public ApiHttpException(int statusCode, string message, object? details = null, Exception? innerException = null) 
        : this((HttpStatusCode)statusCode, message, details, innerException)
    {
    }
}
