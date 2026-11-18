using LearnJava.Web.Domain.Entities;
using LearnJava.Web.Domain.Enums;
using LearnJava.Web.Services.DTOs.Responses;

namespace LearnJava.Web.Services.Repositories;

public class QuestionValidationOption
{
    public Guid Id { get; set; }
    public Guid QuestionId { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public string Explanation { get; set; } = string.Empty;
    public Guid? AssociatedMisconceptionId { get; set; }
    public string? MisconceptionCode { get; set; }
    public string? MisconceptionTitle { get; set; }
    public string? MisconceptionExplanation { get; set; }
    public string? MisconceptionAdvice { get; set; }
}

public class QuestionValidationModel
{
    public Guid Id { get; set; }
    public Guid LessonId { get; set; }
    public string Prompt { get; set; } = string.Empty;
    public List<QuestionValidationOption> Options { get; set; } = [];
}

public interface ILessonRepository
{
    Task<IReadOnlyList<LessonSummaryResponse>> GetAllSummariesAsync(Guid studentId, CancellationToken cancellationToken = default);
    Task<LessonDetailResponse?> GetByIdWithAdaptiveVariantAsync(Guid lessonId, Guid studentId, LearningStyle preferredStyle, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<QuizQuestionResponse>> GetQuizQuestionsForStudentAsync(Guid lessonId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<QuestionValidationModel>> GetQuestionsWithValidationAsync(Guid lessonId, CancellationToken cancellationToken = default);
    Task<Lesson?> GetByIdAsync(Guid lessonId, CancellationToken cancellationToken = default);
}
