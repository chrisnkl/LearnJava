using LearnJava.Web.Domain.Entities;
using LearnJava.Web.Domain.Enums;
using LearnJava.Web.Services.DTOs.Responses;
using LearnJava.Web.Services.Repositories;

namespace LearnJava.Web.Services.Interfaces;

public record EvaluationContext(
    Student Student,
    Lesson Lesson,
    IReadOnlyList<QuestionValidationModel> Questions,
    IReadOnlyDictionary<Guid, Guid> SelectedAnswers,
    // True when the student already passed this lesson before. Retakes must not
    // count as additional completed lessons in the stereotype rules.
    bool LessonAlreadyCompleted = false
);

public record InferenceResult(
    int TotalQuestions,
    int CorrectCount,
    double AccuracyPercentage,
    bool IsPassed,
    int NewCurrentStreak,
    int NewHighestStreak,
    StudentStereotype NewStereotype,
    bool StereotypeChanged,
    IReadOnlyList<QuestionEvaluationDto> Evaluations,
    IReadOnlyList<DetectedMisconceptionDto> NewlyDetectedMisconceptions,
    IReadOnlyList<Guid> MisconceptionIdsToUpsert,
    IReadOnlyList<Guid> MisconceptionIdsToResolve,
    IReadOnlyList<(Guid TargetLessonId, string Reason)> NewRecommendations,
    bool IsNewLessonCompletion
);

public interface IAdaptiveInferenceEngine
{
    StudentStereotype InferStereotype(
        double accuracyPercentage,
        int totalQuestionsAnswered,
        int currentStreak,
        int lessonsCompleted);

    InferenceResult EvaluateQuizSubmission(
        EvaluationContext context,
        IReadOnlyList<MisconceptionSummaryDto> currentlyActiveMisconceptions);
}
