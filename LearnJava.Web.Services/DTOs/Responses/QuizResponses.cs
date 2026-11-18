using LearnJava.Web.Domain.Enums;

namespace LearnJava.Web.Services.DTOs.Responses;

public record QuizOptionResponse(
    Guid Id,
    string Text
);

public record QuizQuestionResponse(
    Guid Id,
    string Prompt,
    string? CodeSnippet,
    string? HintText,
    int OrderIndex,
    IReadOnlyList<QuizOptionResponse> Options
);

public record DetectedMisconceptionDto(
    string Code,
    string Title,
    string Explanation,
    string CorrectiveAdvice
);

public record QuestionEvaluationDto(
    Guid QuestionId,
    Guid SelectedOptionId,
    Guid CorrectOptionId,
    bool IsCorrect,
    string Explanation,
    DetectedMisconceptionDto? DetectedMisconception
);

public record QuizSubmissionResultResponse(
    Guid LessonId,
    int TotalQuestions,
    int Score,
    double AccuracyPercentage,
    bool IsPassed,
    int CurrentStreak,
    int HighestStreak,
    StudentStereotype PreviousStereotype,
    StudentStereotype CurrentStereotype,
    bool StereotypeChanged,
    IReadOnlyList<QuestionEvaluationDto> QuestionResults,
    IReadOnlyList<DetectedMisconceptionDto> DetectedMisconceptions
);
