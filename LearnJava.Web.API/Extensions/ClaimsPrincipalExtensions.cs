using System.Security.Claims;
using LearnJava.Web.Domain.Exceptions;

namespace LearnJava.Web.API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetStudentId(this ClaimsPrincipal principal)
    {
        var rawId = principal.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? principal.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(rawId) || !Guid.TryParse(rawId, out var studentId))
        {
            throw new AuthenticationException("Invalid or missing student identifier claim in JWT token.");
        }

        return studentId;
    }
}
