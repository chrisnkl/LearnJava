using System.Net;

namespace LearnJava.Web.Domain.Exceptions;

public class AuthenticationException : ApiHttpException
{
    public IReadOnlyCollection<string> Errors { get; }

    public AuthenticationException(string message) 
        : base(HttpStatusCode.Unauthorized, message)
    {
        Errors = [message];
    }

    public AuthenticationException(IReadOnlyCollection<string> errors) 
        : base(HttpStatusCode.Unauthorized, "Authentication failed.", errors)
    {
        Errors = errors;
    }
}