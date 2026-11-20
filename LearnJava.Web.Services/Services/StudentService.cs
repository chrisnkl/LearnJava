using LearnJava.Web.Domain.Exceptions;
using LearnJava.Web.Services.DTOs.Requests;
using LearnJava.Web.Services.DTOs.Responses;
using LearnJava.Web.Services.Interfaces;
using LearnJava.Web.Services.Repositories;

namespace LearnJava.Web.Services.Services;

public class StudentService : IStudentService
{
    private readonly IStudentRepository _studentRepository;
    private readonly IMisconceptionRepository _misconceptionRepository;
    private readonly IAnalyticsRepository _analyticsRepository;
    private readonly IAdaptiveInferenceEngine _inferenceEngine;

    public StudentService(
        IStudentRepository studentRepository,
        IMisconceptionRepository misconceptionRepository,
        IAnalyticsRepository analyticsRepository,
        IAdaptiveInferenceEngine inferenceEngine)
    {
        _studentRepository = studentRepository;
        _misconceptionRepository = misconceptionRepository;
        _analyticsRepository = analyticsRepository;
        _inferenceEngine = inferenceEngine;
    }

    public async Task<StudentProfileResponse> GetProfileAsync(
        Guid studentId,
        CancellationToken cancellationToken = default)
    {
        var student = await _studentRepository.GetByIdAsync(studentId, cancellationToken)
            ?? throw new AuthenticationException("Student not found.");

        // Ensure stored stereotype tier reflects current lifetime performance
        var expectedStereotype = _inferenceEngine.InferStereotype(
            student.AccuracyCorrectQuestionsPercentage,
            student.TotalQuestionsAnswered,
            student.CurrentStreak,
            student.TotalLessonsCompleted
        );

        if (expectedStereotype != student.CurrentStereotype)
        {
            student.CurrentStereotype = expectedStereotype;
            await _studentRepository.UpdateTelemetryAndStereotypeAsync(student, cancellationToken);
        }

        var activeMisconceptions = await _misconceptionRepository.GetActiveByStudentIdAsync(
            studentId,
            cancellationToken
        );

        var activeRecommendations = await _analyticsRepository.GetActiveRecommendationsAsync(
            studentId,
            cancellationToken
        );

        return new StudentProfileResponse(
            student.Id,
            student.Email,
            student.FirstName,
            student.LastName,
            student.PreferredLearningStyle,
            student.CurrentStereotype,
            student.TotalLessonsCompleted,
            student.TotalLessonsAttempted,
            student.TotalQuestionsAnswered,
            student.TotalQuestionsCorrect,
            student.CurrentStreak,
            student.HighestStreak,
            student.AccuracyCorrectQuestionsPercentage,
            activeMisconceptions,
            activeRecommendations
        );
    }

    public async Task UpdatePreferencesAsync(
        Guid studentId,
        UpdatePreferencesRequest request,
        CancellationToken cancellationToken = default)
    {
        var student = await _studentRepository.GetByIdAsync(studentId, cancellationToken)
            ?? throw new AuthenticationException("Student not found.");

        if (!Enum.IsDefined(request.PreferredLearningStyle))
        {
            throw new ValidationException($"Unknown learning style '{(int)request.PreferredLearningStyle}'.");
        }

        await _studentRepository.UpdatePreferencesAsync(
            studentId,
            request.PreferredLearningStyle,
            request.FirstName,
            request.LastName,
            cancellationToken
        );
    }

    public async Task<IReadOnlyList<QuizAttemptDto>> GetQuizHistoryAsync(
        Guid studentId,
        int take,
        CancellationToken cancellationToken = default)
    {
        return await _analyticsRepository.GetQuizHistoryAsync(studentId, Math.Clamp(take, 1, 100), cancellationToken);
    }
}
