using LearnJava.Web.Services.DTOs.Requests;
using LearnJava.Web.Services.DTOs.Responses;

namespace LearnJava.Web.Services.Interfaces;

public interface IStudentService
{
    Task<StudentProfileResponse> GetProfileAsync(Guid studentId, CancellationToken cancellationToken = default);
    Task UpdatePreferencesAsync(Guid studentId, UpdatePreferencesRequest request, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<QuizAttemptDto>> GetQuizHistoryAsync(Guid studentId, int take, CancellationToken cancellationToken = default);
}