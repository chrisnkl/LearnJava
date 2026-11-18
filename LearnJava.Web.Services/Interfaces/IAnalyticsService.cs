using LearnJava.Web.Services.DTOs.Requests;

namespace LearnJava.Web.Services.Interfaces;

public interface IAnalyticsService
{
    Task TrackInteractionAsync(Guid studentId, TrackInteractionRequest request, CancellationToken cancellationToken = default);
    Task SubmitFeedbackAsync(Guid studentId, SubmitFeedbackRequest request, CancellationToken cancellationToken = default);
}
