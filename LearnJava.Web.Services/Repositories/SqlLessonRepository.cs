using System.Data;
using Dapper;
using LearnJava.Web.Domain.Entities;
using LearnJava.Web.Domain.Enums;
using LearnJava.Web.Services.DTOs.Responses;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace LearnJava.Web.Services.Repositories;

public class SqlLessonRepository : ILessonRepository
{
    private readonly string _connectionString;

    public SqlLessonRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? configuration.GetConnectionString("Database")
            ?? "Server=localhost\\SQLEXPRESS;Database=LearnJavaDb;Trusted_Connection=True;TrustServerCertificate=True;";
    }

    private SqlConnection CreateConnection() => new SqlConnection(_connectionString);

    public async Task<IReadOnlyList<LessonSummaryResponse>> GetAllSummariesAsync(
        Guid studentId,
        CancellationToken cancellationToken = default)
    {
        const string sql = """
            SELECT 
                l.Id,
                l.Title,
                l.Summary,
                l.Difficulty,
                l.OrderIndex,
                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM dbo.StudentInteractions si 
                        WHERE si.StudentId = @StudentId 
                          AND si.LessonId = l.Id 
                          AND si.Type = 1 -- CompleteLesson
                    ) THEN CAST(1 AS BIT)
                    ELSE CAST(0 AS BIT)
                END AS IsCompleted,
                COUNT(q.Id) AS QuestionCount
            FROM dbo.Lessons l
            LEFT JOIN dbo.Questions q ON q.LessonId = l.Id
            GROUP BY l.Id, l.Title, l.Summary, l.Difficulty, l.OrderIndex
            ORDER BY l.OrderIndex ASC;
            """;

        await using var connection = CreateConnection();
        var results = await connection.QueryAsync<LessonSummaryResponse>(
            new CommandDefinition(sql, new { StudentId = studentId }, cancellationToken: cancellationToken)
        );

        return results.ToList();
    }

    public async Task<LessonDetailResponse?> GetByIdWithAdaptiveVariantAsync(
        Guid lessonId,
        Guid studentId,
        LearningStyle preferredStyle,
        CancellationToken cancellationToken = default)
    {
        const string lessonSql = """
            SELECT 
                l.Id,
                l.Title,
                l.Summary,
                l.Difficulty,
                l.OrderIndex,
                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM dbo.StudentInteractions si 
                        WHERE si.StudentId = @StudentId 
                          AND si.LessonId = l.Id 
                          AND si.Type = 1 -- CompleteLesson
                    ) THEN CAST(1 AS BIT)
                    ELSE CAST(0 AS BIT)
                END AS IsCompleted
            FROM dbo.Lessons l
            WHERE l.Id = @LessonId;

            SELECT 
                v.Style,
                v.MarkdownBody,
                v.ImageUrl
            FROM dbo.LessonContentVariants v
            WHERE v.LessonId = @LessonId;
            """;

        await using var connection = CreateConnection();
        using var multi = await connection.QueryMultipleAsync(
            new CommandDefinition(lessonSql, new { LessonId = lessonId, StudentId = studentId }, cancellationToken: cancellationToken)
        );

        var lessonBase = await multi.ReadSingleOrDefaultAsync<dynamic>();
        if (lessonBase is null)
        {
            return null;
        }

        var variants = (await multi.ReadAsync<LessonVariantDto>()).ToList();
        if (variants.Count == 0)
        {
            // Default placeholder variant if none seeded yet
            variants.Add(new LessonVariantDto(
                preferredStyle,
                "# " + (string)lessonBase.Title + "\n\nContent for this lesson will be available soon.",
                null
            ));
        }

        // Adaptive Selection: pick student's preferred style if exists, else first available.
        // Auditory learners have no authored variant: serve the prose-heavy Conceptual variant,
        // which the client narrates via text-to-speech.
        var activeVariant = variants.FirstOrDefault(v => v.Style == preferredStyle)
            ?? (preferredStyle == LearningStyle.Auditory
                ? variants.FirstOrDefault(v => v.Style == LearningStyle.Conceptual)
                : null)
            ?? variants[0];
        var availableStyles = variants.Select(v => v.Style).Distinct().ToList();

        return new LessonDetailResponse(
            (Guid)lessonBase.Id,
            (string)lessonBase.Title,
            (string)lessonBase.Summary,
            (DifficultyLevel)(int)lessonBase.Difficulty,
            (int)lessonBase.OrderIndex,
            (bool)lessonBase.IsCompleted,
            activeVariant,
            availableStyles
        );
    }

    public async Task<IReadOnlyList<QuizQuestionResponse>> GetQuizQuestionsForStudentAsync(
        Guid lessonId,
        CancellationToken cancellationToken = default)
    {
        const string sql = """
            SELECT 
                q.Id,
                q.Prompt,
                q.CodeSnippet,
                q.HintText,
                q.OrderIndex,
                qo.Id,
                qo.Text
            FROM dbo.Questions q
            INNER JOIN dbo.QuestionOptions qo ON qo.QuestionId = q.Id
            WHERE q.LessonId = @LessonId
            ORDER BY q.OrderIndex ASC, qo.CreatedAt ASC;
            """;

        await using var connection = CreateConnection();
        var questionLookup = new Dictionary<Guid, (QuizQuestionResponse Question, List<QuizOptionResponse> Options)>();

        await connection.QueryAsync<dynamic, dynamic, QuizQuestionResponse>(
            new CommandDefinition(sql, new { LessonId = lessonId }, cancellationToken: cancellationToken),
            (qRow, oRow) =>
            {
                Guid qId = (Guid)qRow.Id;
                if (!questionLookup.TryGetValue(qId, out var entry))
                {
                    var question = new QuizQuestionResponse(
                        qId,
                        (string)qRow.Prompt,
                        (string?)qRow.CodeSnippet,
                        (string?)qRow.HintText,
                        (int)qRow.OrderIndex,
                        new List<QuizOptionResponse>()
                    );
                    entry = (question, (List<QuizOptionResponse>)question.Options);
                    questionLookup[qId] = entry;
                }

                if (oRow.Id != null)
                {
                    entry.Options.Add(new QuizOptionResponse(
                        (Guid)oRow.Id,
                        (string)oRow.Text
                    ));
                }

                return entry.Question;
            },
            splitOn: "Id"
        );

        return questionLookup.Values.Select(v => v.Question).ToList();
    }

    public async Task<IReadOnlyList<QuestionValidationModel>> GetQuestionsWithValidationAsync(
        Guid lessonId,
        CancellationToken cancellationToken = default)
    {
        const string sql = """
            SELECT 
                q.Id AS QuestionId,
                q.LessonId,
                q.Prompt,
                qo.Id,
                qo.QuestionId,
                qo.Text,
                qo.IsCorrect,
                qo.Explanation,
                qo.AssociatedMisconceptionId,
                m.Code AS MisconceptionCode,
                m.Title AS MisconceptionTitle,
                m.Explanation AS MisconceptionExplanation,
                m.CorrectiveAdvice AS MisconceptionAdvice
            FROM dbo.Questions q
            INNER JOIN dbo.QuestionOptions qo ON qo.QuestionId = q.Id
            LEFT JOIN dbo.Misconceptions m ON m.Id = qo.AssociatedMisconceptionId
            WHERE q.LessonId = @LessonId;
            """;

        await using var connection = CreateConnection();
        var questionsDict = new Dictionary<Guid, QuestionValidationModel>();

        var rows = await connection.QueryAsync<dynamic>(
            new CommandDefinition(sql, new { LessonId = lessonId }, cancellationToken: cancellationToken)
        );

        foreach (var row in rows)
        {
            Guid qId = (Guid)row.QuestionId;
            if (!questionsDict.TryGetValue(qId, out var qModel))
            {
                qModel = new QuestionValidationModel
                {
                    Id = qId,
                    LessonId = (Guid)row.LessonId,
                    Prompt = (string)row.Prompt,
                    Options = []
                };
                questionsDict[qId] = qModel;
            }

            qModel.Options.Add(new QuestionValidationOption
            {
                Id = (Guid)row.Id,
                QuestionId = qId,
                Text = (string)row.Text,
                IsCorrect = (bool)row.IsCorrect,
                Explanation = (string)row.Explanation,
                AssociatedMisconceptionId = (Guid?)row.AssociatedMisconceptionId,
                MisconceptionCode = (string?)row.MisconceptionCode,
                MisconceptionTitle = (string?)row.MisconceptionTitle,
                MisconceptionExplanation = (string?)row.MisconceptionExplanation,
                MisconceptionAdvice = (string?)row.MisconceptionAdvice
            });
        }

        return questionsDict.Values.ToList();
    }

    public async Task<Lesson?> GetByIdAsync(Guid lessonId, CancellationToken cancellationToken = default)
    {
        const string sql = """
            SELECT 
                Id,
                Title,
                Summary,
                Difficulty,
                OrderIndex,
                CreatedAt,
                UpdatedAt
            FROM dbo.Lessons
            WHERE Id = @LessonId;
            """;

        await using var connection = CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Lesson>(
            new CommandDefinition(sql, new { LessonId = lessonId }, cancellationToken: cancellationToken)
        );
    }
}
