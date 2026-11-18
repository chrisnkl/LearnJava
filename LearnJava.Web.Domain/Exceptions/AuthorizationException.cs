using System.Net;

namespace LearnJava.Web.Domain.Exceptions;

public class AuthorizationException : ApiHttpException
{
    public AuthorizationException(string message = "You are not authorized to perform this action.") 
        : base(HttpStatusCode.Forbidden, message)
    {
    }
}