using LearnJava.Web.Services.DTOs.Responses;

namespace LearnJava.Web.Services.Interfaces;

public interface ILessonService
{
    Task<IReadOnlyList<LessonSummaryResponse>> GetLessonsAsync(Guid studentId, CancellationToken cancellationToken = default);
    Task<LessonDetailResponse> GetLessonDetailAsync(Guid lessonId, Guid studentId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<QuizQuestionResponse>> GetQuizQuestionsAsync(Guid lessonId, CancellationToken cancellationToken = default);
}
