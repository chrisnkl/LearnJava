using LearnJava.Web.Domain.Entities;
using LearnJava.Web.Services.DTOs.Responses;

namespace LearnJava.Web.Services.Repositories;

public interface IAnalyticsRepository
{
    Task LogInteractionAsync(StudentInteraction interaction, CancellationToken cancellationToken = default);
    Task AddFeedbackAsync(StudentFeedback feedback, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<RecommendationSummaryDto>> GetActiveRecommendationsAsync(Guid studentId, CancellationToken cancellationToken = default);
    Task UpsertRecommendationAsync(Guid studentId, Guid targetLessonId, string reason, CancellationToken cancellationToken = default);
    Task MarkRecommendationCompletedAsync(Guid studentId, Guid targetLessonId, CancellationToken cancellationToken = default);
    Task<bool> HasCompletedLessonAsync(Guid studentId, Guid lessonId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<QuizAttemptDto>> GetQuizHistoryAsync(Guid studentId, int take, CancellationToken cancellationToken = default);
}
