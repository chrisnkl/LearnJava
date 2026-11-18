namespace LearnJava.Web.Services.DTOs.Requests;

public record QuestionAnswerSubmissionDto(
    Guid QuestionId,
    Guid SelectedOptionId
);

public record QuizSubmissionRequest(
    Guid LessonId,
    IReadOnlyList<QuestionAnswerSubmissionDto> Answers,
    int DurationSeconds = 0
);
