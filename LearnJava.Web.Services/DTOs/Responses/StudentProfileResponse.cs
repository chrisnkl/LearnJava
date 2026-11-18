using LearnJava.Web.Domain.Enums;

namespace LearnJava.Web.Services.DTOs.Responses;

public record MisconceptionSummaryDto(
    Guid MisconceptionId,
    string Code,
    string Title,
    string Explanation,
    string CorrectiveAdvice,
    int OccurrenceCount,
    bool IsResolved,
    DateTime LastOccurredAt
);

public record RecommendationSummaryDto(
    Guid Id,
    Guid TargetLessonId,
    string LessonTitle,
    string Reason,
    bool IsCompleted,
    DateTime CreatedAt
);

public record QuizAttemptDto(
    Guid LessonId,
    string LessonTitle,
    int Score,
    int Total,
    double AccuracyPercentage,
    bool IsPassed,
    int DurationSeconds,
    DateTime AttemptedAt
);

public record StudentProfileResponse(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    LearningStyle PreferredLearningStyle,
    StudentStereotype CurrentStereotype,
    int TotalLessonsCompleted,
    int TotalLessonsAttempted,
    int TotalQuestionsAnswered,
    int TotalQuestionsCorrect,
    int CurrentStreak,
    int HighestStreak,
    double AccuracyPercentage,
    IReadOnlyList<MisconceptionSummaryDto> ActiveMisconceptions,
    IReadOnlyList<RecommendationSummaryDto> ActiveRecommendations
);
