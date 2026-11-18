using LearnJava.Web.Domain.Enums;

namespace LearnJava.Web.Services.DTOs.Requests;

public record TrackInteractionRequest(
    Guid? LessonId,
    Guid? QuestionId,
    InteractionType Type,
    int DurationSeconds,
    string? AdditionalData = null
);

public record SubmitFeedbackRequest(
    Guid LessonId,
    int Rating,
    string? Comment = null
);
