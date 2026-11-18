using LearnJava.Web.Domain.Enums;

namespace LearnJava.Web.Services.DTOs.Responses;

public record LessonSummaryResponse(
    Guid Id,
    string Title,
    string Summary,
    DifficultyLevel Difficulty,
    int OrderIndex,
    bool IsCompleted,
    int QuestionCount
);

public record LessonVariantDto(
    LearningStyle Style,
    string MarkdownBody,
    string? ImageUrl
);

public record LessonDetailResponse(
    Guid Id,
    string Title,
    string Summary,
    DifficultyLevel Difficulty,
    int OrderIndex,
    bool IsCompleted,
    LessonVariantDto ActiveVariant,
    IReadOnlyList<LearningStyle> AvailableStyles
);
