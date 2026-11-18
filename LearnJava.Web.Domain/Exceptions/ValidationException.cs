using System.Net;

namespace LearnJava.Web.Domain.Exceptions;

public class ValidationException : ApiHttpException
{
    public IReadOnlyCollection<string> Errors { get; }

    public ValidationException(string message) 
        : base(HttpStatusCode.BadRequest, message)
    {
        Errors = [message];
    }

    public ValidationException(IReadOnlyCollection<string> errors) 
        : base(HttpStatusCode.BadRequest, "One or more validation failures occurred.", errors)
    {
        Errors = errors;
    }
}