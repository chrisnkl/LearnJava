using LearnJava.Web.Domain.Entities;
using LearnJava.Web.Domain.Enums;
using LearnJava.Web.Domain.Exceptions;
using LearnJava.Web.Services.DTOs.Responses;
using LearnJava.Web.Services.Interfaces;
using LearnJava.Web.Services.Repositories;

namespace LearnJava.Web.Services.Services;

public class LessonService : ILessonService
{
    private readonly ILessonRepository _lessonRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IAnalyticsRepository _analyticsRepository;

    public LessonService(
        ILessonRepository lessonRepository,
        IStudentRepository studentRepository,
        IAnalyticsRepository analyticsRepository)
    {
        _lessonRepository = lessonRepository;
        _studentRepository = studentRepository;
        _analyticsRepository = analyticsRepository;
    }

    public async Task<IReadOnlyList<LessonSummaryResponse>> GetLessonsAsync(
        Guid studentId,
        CancellationToken cancellationToken = default)
    {
        return await _lessonRepository.GetAllSummariesAsync(studentId, cancellationToken);
    }

    public async Task<LessonDetailResponse> GetLessonDetailAsync(
        Guid lessonId,
        Guid studentId,
        CancellationToken cancellationToken = default)
    {
        var student = await _studentRepository.GetByIdAsync(studentId, cancellationToken)
            ?? throw new AuthenticationException("Student not found.");

        var lessonDetail = await _lessonRepository.GetByIdWithAdaptiveVariantAsync(
            lessonId,
            studentId,
            student.PreferredLearningStyle,
            cancellationToken
        );

        if (lessonDetail is null)
        {
            throw new ValidationException($"Lesson with ID '{lessonId}' was not found.");
        }

        // Non-intrusively log telemetry that the student opened the lesson
        await _analyticsRepository.LogInteractionAsync(new StudentInteraction
        {
            StudentId = studentId,
            LessonId = lessonId,
            Type = InteractionType.StartLesson,
            DurationSeconds = 0,
            AdditionalData = $"AdaptiveStyle:{lessonDetail.ActiveVariant.Style}"
        }, cancellationToken);

        return lessonDetail;
    }

    public async Task<IReadOnlyList<QuizQuestionResponse>> GetQuizQuestionsAsync(
        Guid lessonId,
        CancellationToken cancellationToken = default)
    {
        var questions = await _lessonRepository.GetQuizQuestionsForStudentAsync(lessonId, cancellationToken);
        if (questions.Count == 0)
        {
            var lesson = await _lessonRepository.GetByIdAsync(lessonId, cancellationToken);
            if (lesson is null)
            {
                throw new ValidationException($"Lesson with ID '{lessonId}' was not found.");
            }
        }

        return questions;
    }
}
