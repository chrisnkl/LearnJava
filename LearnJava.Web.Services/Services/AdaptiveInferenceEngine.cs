using LearnJava.Web.Domain.Enums;
using LearnJava.Web.Services.DTOs.Responses;
using LearnJava.Web.Services.Interfaces;

namespace LearnJava.Web.Services.Services;

/// <summary>
/// Core inference engine implementing:
/// 1. Stereotype User Modeling (Rule-based inference for student categorization)
/// 2. Buggy Rules / Misconception Detection (Distractor analysis on student quiz options)
/// 3. Adaptive Recommendation Generation (Remediation targeting detected cognitive gaps)
/// </summary>
public class AdaptiveInferenceEngine : IAdaptiveInferenceEngine
{
    public StudentStereotype InferStereotype(
        double accuracyPercentage,
        int totalQuestionsAnswered,
        int currentStreak,
        int lessonsCompleted)
    {
        // Standard rounding to nearest integer percentage (e.g. 89.9% -> 90%)
        // aligns user-facing display with milestone thresholds
        double roundedAccuracy = Math.Round(accuracyPercentage, MidpointRounding.AwayFromZero);

        // Stereotype inference rules using modern C# pattern matching
        return (roundedAccuracy, totalQuestionsAnswered, currentStreak, lessonsCompleted) switch
        {
            ( >= 90.0, >= 15, >= 5, >= 3) => StudentStereotype.Professional,
            ( >= 75.0, >= 10, _, >= 2)    => StudentStereotype.Advanced,
            ( >= 50.0, >= 4, _, _)        => StudentStereotype.Intermediate,
            _                             => StudentStereotype.Beginner
        };
    }

    public InferenceResult EvaluateQuizSubmission(
        EvaluationContext context,
        IReadOnlyList<MisconceptionSummaryDto> currentlyActiveMisconceptions)
    {
        var evaluations = new List<QuestionEvaluationDto>();
        var newlyDetected = new List<DetectedMisconceptionDto>();
        var misconceptionsToUpsert = new HashSet<Guid>();
        var misconceptionsToResolve = new HashSet<Guid>();
        var recommendations = new List<(Guid TargetLessonId, string Reason)>();

        var activeMisconceptionIds = currentlyActiveMisconceptions
            .Select(m => m.MisconceptionId)
            .ToHashSet();

        int correctCount = 0;

        foreach (var question in context.Questions)
        {
            var correctOption = question.Options.FirstOrDefault(o => o.IsCorrect)
                ?? throw new InvalidOperationException($"Question {question.Id} is malformed: no correct option found.");

            context.SelectedAnswers.TryGetValue(question.Id, out var selectedOptionId);
            var selectedOption = question.Options.FirstOrDefault(o => o.Id == selectedOptionId);

            bool isCorrect = selectedOption != null && selectedOption.IsCorrect;
            if (isCorrect)
            {
                correctCount++;

                // If student got it right, check if any distractor for this question matches an active misconception
                // Answering correctly demonstrates mastery and resolves the cognitive gap!
                foreach (var opt in question.Options.Where(o => !o.IsCorrect && o.AssociatedMisconceptionId.HasValue))
                {
                    if (activeMisconceptionIds.Contains(opt.AssociatedMisconceptionId!.Value))
                    {
                        misconceptionsToResolve.Add(opt.AssociatedMisconceptionId.Value);
                    }
                }

                evaluations.Add(new QuestionEvaluationDto(
                    question.Id,
                    selectedOptionId,
                    correctOption.Id,
                    IsCorrect: true,
                    Explanation: correctOption.Explanation,
                    DetectedMisconception: null
                ));
            }
            else
            {
                DetectedMisconceptionDto? detectedDto = null;

                // Check for diagnosed misconception on chosen distractor
                if (selectedOption?.AssociatedMisconceptionId is not null)
                {
                    var miscId = selectedOption.AssociatedMisconceptionId.Value;
                    misconceptionsToUpsert.Add(miscId);

                    detectedDto = new DetectedMisconceptionDto(
                        selectedOption.MisconceptionCode ?? "MISC_UNKNOWN",
                        selectedOption.MisconceptionTitle ?? "Conceptual Misconception",
                        selectedOption.MisconceptionExplanation ?? selectedOption.Explanation,
                        selectedOption.MisconceptionAdvice ?? "Review this lesson to solidify the core principles."
                    );

                    newlyDetected.Add(detectedDto);

                    // Add recommendation to review current lesson
                    recommendations.Add((
                        context.Lesson.Id,
                        $"Review '{context.Lesson.Title}': Recommended to address detected misconception '{detectedDto.Title}'."
                    ));
                }

                evaluations.Add(new QuestionEvaluationDto(
                    question.Id,
                    selectedOptionId,
                    correctOption.Id,
                    IsCorrect: false,
                    Explanation: selectedOption?.Explanation ?? "No option was selected.",
                    DetectedMisconception: detectedDto
                ));
            }
        }

        int totalQuestions = context.Questions.Count;
        double accuracy = totalQuestions == 0 ? 0.0 : Math.Round((double)correctCount / totalQuestions * 100.0, 1);
        bool isPassed = accuracy >= 60.0;

        // Telemetry Streak Calculation
        int updatedCurrentStreak = isPassed ? context.Student.CurrentStreak + 1 : 0;
        int updatedHighestStreak = Math.Max(context.Student.HighestStreak, updatedCurrentStreak);

        int updatedTotalAnswered = context.Student.TotalQuestionsAnswered + totalQuestions;
        int updatedTotalCorrect = context.Student.TotalQuestionsCorrect + correctCount;
        // Only the first pass of a lesson counts as a completed lesson; retakes do not inflate the stereotype.
        bool isNewLessonCompletion = isPassed && !context.LessonAlreadyCompleted;
        int updatedLessonsCompleted = context.Student.TotalLessonsCompleted + (isNewLessonCompletion ? 1 : 0);

        double lifetimeAccuracy = updatedTotalAnswered == 0
            ? 0.0
            : Math.Round((double)updatedTotalCorrect / updatedTotalAnswered * 100.0, 1);

        // Infer new stereotype using the Stereotype Method
        var newStereotype = InferStereotype(
            lifetimeAccuracy,
            updatedTotalAnswered,
            updatedCurrentStreak,
            updatedLessonsCompleted
        );

        bool stereotypeChanged = newStereotype != context.Student.CurrentStereotype;

        return new InferenceResult(
            totalQuestions,
            correctCount,
            accuracy,
            isPassed,
            updatedCurrentStreak,
            updatedHighestStreak,
            newStereotype,
            stereotypeChanged,
            evaluations,
            newlyDetected,
            misconceptionsToUpsert.ToList(),
            misconceptionsToResolve.ToList(),
            recommendations,
            isNewLessonCompletion
        );
    }
}
