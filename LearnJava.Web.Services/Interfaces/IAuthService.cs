using LearnJava.Web.Services.DTOs.Requests;
using LearnJava.Web.Services.DTOs.Responses;

namespace LearnJava.Web.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(AuthRequest request);
    Task<AuthResponse> RegisterAsync(AuthRequest request);
    Task<StudentProfileResponse> GetLoggedInStudent(string studentId, CancellationToken cancellationToken);
}