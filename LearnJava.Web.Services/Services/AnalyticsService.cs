using LearnJava.Web.Domain.Entities;
using LearnJava.Web.Domain.Exceptions;
using LearnJava.Web.Services.DTOs.Requests;
using LearnJava.Web.Services.Interfaces;
using LearnJava.Web.Services.Repositories;

namespace LearnJava.Web.Services.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly IAnalyticsRepository _analyticsRepository;
    private readonly ILessonRepository _lessonRepository;

    public AnalyticsService(
        IAnalyticsRepository analyticsRepository,
        ILessonRepository lessonRepository)
    {
        _analyticsRepository = analyticsRepository;
        _lessonRepository = lessonRepository;
    }

    public async Task TrackInteractionAsync(
        Guid studentId,
        TrackInteractionRequest request,
        CancellationToken cancellationToken = default)
    {
        if (!Enum.IsDefined(request.Type))
        {
            throw new ValidationException($"Unknown interaction type '{(int)request.Type}'.");
        }

        if (request.DurationSeconds < 0)
        {
            throw new ValidationException("DurationSeconds cannot be negative.");
        }

        var interaction = new StudentInteraction
        {
            StudentId = studentId,
            LessonId = request.LessonId,
            QuestionId = request.QuestionId,
            Type = request.Type,
            DurationSeconds = request.DurationSeconds,
            AdditionalData = request.AdditionalData
        };

        await _analyticsRepository.LogInteractionAsync(interaction, cancellationToken);
    }

    public async Task SubmitFeedbackAsync(
        Guid studentId,
        SubmitFeedbackRequest request,
        CancellationToken cancellationToken = default)
    {
        if (request.Rating is < 1 or > 5)
        {
            throw new ValidationException("Rating must be between 1 and 5 stars.");
        }

        var lesson = await _lessonRepository.GetByIdAsync(request.LessonId, cancellationToken);
        if (lesson is null)
        {
            throw new ValidationException($"Lesson with ID '{request.LessonId}' does not exist.");
        }

        var feedback = new StudentFeedback
        {
            StudentId = studentId,
            LessonId = request.LessonId,
            Rating = request.Rating,
            Comment = request.Comment
        };

        await _analyticsRepository.AddFeedbackAsync(feedback, cancellationToken);
    }
}
