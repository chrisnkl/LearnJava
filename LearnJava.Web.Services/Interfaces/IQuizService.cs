using LearnJava.Web.Services.DTOs.Requests;
using LearnJava.Web.Services.DTOs.Responses;

namespace LearnJava.Web.Services.Interfaces;

public interface IQuizService
{
    Task<QuizSubmissionResultResponse> SubmitQuizAsync(
        Guid studentId,
        QuizSubmissionRequest request,
        CancellationToken cancellationToken = default);
}
