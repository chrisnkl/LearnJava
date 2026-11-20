using System.Text.Json;
using LearnJava.Web.Domain.Entities;
using LearnJava.Web.Domain.Enums;
using LearnJava.Web.Domain.Exceptions;
using LearnJava.Web.Services.DTOs.Requests;
using LearnJava.Web.Services.DTOs.Responses;
using LearnJava.Web.Services.Interfaces;
using LearnJava.Web.Services.Repositories;

namespace LearnJava.Web.Services.Services;

public class QuizService : IQuizService
{
    private readonly ILessonRepository _lessonRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IMisconceptionRepository _misconceptionRepository;
    private readonly IAnalyticsRepository _analyticsRepository;
    private readonly IAdaptiveInferenceEngine _inferenceEngine;

    public QuizService(
        ILessonRepository lessonRepository,
        IStudentRepository studentRepository,
        IMisconceptionRepository misconceptionRepository,
        IAnalyticsRepository analyticsRepository,
        IAdaptiveInferenceEngine inferenceEngine)
    {
        _lessonRepository = lessonRepository;
        _studentRepository = studentRepository;
        _misconceptionRepository = misconceptionRepository;
        _analyticsRepository = analyticsRepository;
        _inferenceEngine = inferenceEngine;
    }

    public async Task<QuizSubmissionResultResponse> SubmitQuizAsync(
        Guid studentId,
        QuizSubmissionRequest request,
        CancellationToken cancellationToken = default)
    {
        var student = await _studentRepository.GetByIdAsync(studentId, cancellationToken)
            ?? throw new AuthenticationException("Student not found.");

        var lesson = await _lessonRepository.GetByIdAsync(request.LessonId, cancellationToken)
            ?? throw new ValidationException($"Lesson with ID '{request.LessonId}' does not exist.");

        var questionsWithValidation = await _lessonRepository.GetQuestionsWithValidationAsync(
            request.LessonId,
            cancellationToken
        );

        if (questionsWithValidation.Count == 0)
        {
            throw new ValidationException("No quiz questions found for this lesson.");
        }

        var activeMisconceptions = await _misconceptionRepository.GetActiveByStudentIdAsync(
            studentId,
            cancellationToken
        );

        var selectedAnswers = request.Answers.ToDictionary(a => a.QuestionId, a => a.SelectedOptionId);

        var lessonAlreadyCompleted = await _analyticsRepository.HasCompletedLessonAsync(
            studentId,
            lesson.Id,
            cancellationToken
        );

        var context = new EvaluationContext(student, lesson, questionsWithValidation, selectedAnswers, lessonAlreadyCompleted);
        var result = _inferenceEngine.EvaluateQuizSubmission(context, activeMisconceptions);

        var previousStereotype = student.CurrentStereotype;

        // Persist student telemetry
        student.TotalLessonsAttempted++;
        if (result.IsNewLessonCompletion)
        {
            student.TotalLessonsCompleted++;
        }
        student.TotalQuestionsAnswered += result.TotalQuestions;
        student.TotalQuestionsCorrect += result.CorrectCount;
        student.CurrentStreak = result.NewCurrentStreak;
        student.HighestStreak = result.NewHighestStreak;
        student.CurrentStereotype = result.NewStereotype;

        await _studentRepository.UpdateTelemetryAndStereotypeAsync(student, cancellationToken);

        // Update diagnosed misconceptions in database
        foreach (var miscId in result.MisconceptionIdsToUpsert)
        {
            await _misconceptionRepository.UpsertStudentMisconceptionAsync(studentId, miscId, cancellationToken);
        }

        // Mark resolved misconceptions
        foreach (var resolvedId in result.MisconceptionIdsToResolve)
        {
            await _misconceptionRepository.ResolveStudentMisconceptionAsync(studentId, resolvedId, cancellationToken);
        }

        // Manage recommendations
        if (result.IsPassed)
        {
            await _analyticsRepository.MarkRecommendationCompletedAsync(studentId, lesson.Id, cancellationToken);
        }

        foreach (var (targetLessonId, reason) in result.NewRecommendations)
        {
            await _analyticsRepository.UpsertRecommendationAsync(studentId, targetLessonId, reason, cancellationToken);
        }

        // Log telemetry interaction
        await _analyticsRepository.LogInteractionAsync(new StudentInteraction
        {
            StudentId = studentId,
            LessonId = lesson.Id,
            Type = result.IsPassed ? InteractionType.CompleteLesson : InteractionType.AnswerQuestion,
            DurationSeconds = request.DurationSeconds,
            AdditionalData = JsonSerializer.Serialize(new
            {
                Score = result.CorrectCount,
                Total = result.TotalQuestions,
                result.AccuracyPercentage,
                result.IsPassed
            })
        }, cancellationToken);

        return new QuizSubmissionResultResponse(
            lesson.Id,
            result.TotalQuestions,
            result.CorrectCount,
            result.AccuracyPercentage,
            result.IsPassed,
            result.NewCurrentStreak,
            result.NewHighestStreak,
            previousStereotype,
            result.NewStereotype,
            result.StereotypeChanged,
            result.Evaluations,
            result.NewlyDetectedMisconceptions
        );
    }
}
