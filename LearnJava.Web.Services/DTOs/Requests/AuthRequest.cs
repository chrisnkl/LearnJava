using LearnJava.Web.Domain.Exceptions;

namespace LearnJava.Web.Services.DTOs.Requests;

public record AuthRequest
{
    public string Email { get; init; }
    public string Password { get; init; }

    public AuthRequest(string email, string password)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ValidationException("Email is required and cannot be empty.");

        if (!email.Contains('@') || !email.Contains('.'))
            throw new ValidationException("A valid email address is required.");

        if (string.IsNullOrWhiteSpace(password))
            throw new ValidationException("Password is required.");

        if (password.Length < 6)
            throw new ValidationException("Password must be at least 6 characters long.");

        Email = email.Trim().ToLowerInvariant();
        Password = password;
    }
}