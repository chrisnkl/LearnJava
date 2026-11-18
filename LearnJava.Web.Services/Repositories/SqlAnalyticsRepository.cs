using System.Data;
using Dapper;
using LearnJava.Web.Domain.Entities;
using LearnJava.Web.Services.DTOs.Responses;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace LearnJava.Web.Services.Repositories;

public class SqlAnalyticsRepository : IAnalyticsRepository
{
    private readonly string _connectionString;

    public SqlAnalyticsRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? configuration.GetConnectionString("Database")
            ?? "Server=localhost\\SQLEXPRESS;Database=LearnJavaDb;Trusted_Connection=True;TrustServerCertificate=True;";
    }

    private SqlConnection CreateConnection() => new SqlConnection(_connectionString);

    public async Task LogInteractionAsync(StudentInteraction interaction, CancellationToken cancellationToken = default)
    {
        const string sql = """
            INSERT INTO dbo.StudentInteractions (
                Id,
                StudentId,
                LessonId,
                QuestionId,
                Type,
                DurationSeconds,
                AdditionalData,
                CreatedAt,
                UpdatedAt
            ) VALUES (
                @Id,
                @StudentId,
                @LessonId,
                @QuestionId,
                @Type,
                @DurationSeconds,
                @AdditionalData,
                @CreatedAt,
                @UpdatedAt
            );
            """;

        await using var connection = CreateConnection();
        await connection.ExecuteAsync(new CommandDefinition(
            sql,
            new
            {
                interaction.Id,
                interaction.StudentId,
                interaction.LessonId,
                interaction.QuestionId,
                Type = (int)interaction.Type,
                interaction.DurationSeconds,
                interaction.AdditionalData,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            cancellationToken: cancellationToken
        ));
    }

    public async Task AddFeedbackAsync(StudentFeedback feedback, CancellationToken cancellationToken = default)
    {
        const string sql = """
            INSERT INTO dbo.StudentFeedbacks (
                Id,
                StudentId,
                LessonId,
                Rating,
                Comment,
                CreatedAt,
                UpdatedAt
            ) VALUES (
                @Id,
                @StudentId,
                @LessonId,
                @Rating,
                @Comment,
                SYSUTCDATETIME(),
                SYSUTCDATETIME()
            );
            """;

        await using var connection = CreateConnection();
        await connection.ExecuteAsync(new CommandDefinition(
            sql,
            feedback,
            cancellationToken: cancellationToken
        ));
    }

    public async Task<IReadOnlyList<RecommendationSummaryDto>> GetActiveRecommendationsAsync(
        Guid studentId,
        CancellationToken cancellationToken = default)
    {
        const string sql = """
            SELECT 
                r.Id,
                r.TargetLessonId,
                l.Title AS LessonTitle,
                r.Reason,
                r.IsCompleted,
                r.CreatedAt
            FROM dbo.Recommendations r
            INNER JOIN dbo.Lessons l ON l.Id = r.TargetLessonId
            WHERE r.StudentId = @StudentId AND r.IsCompleted = 0
            ORDER BY r.CreatedAt DESC;
            """;

        await using var connection = CreateConnection();
        var results = await connection.QueryAsync<RecommendationSummaryDto>(
            new CommandDefinition(sql, new { StudentId = studentId }, cancellationToken: cancellationToken)
        );

        return results.ToList();
    }

    public async Task UpsertRecommendationAsync(
        Guid studentId,
        Guid targetLessonId,
        string reason,
        CancellationToken cancellationToken = default)
    {
        const string sql = """
            IF NOT EXISTS (
                SELECT 1 FROM dbo.Recommendations 
                WHERE StudentId = @StudentId AND TargetLessonId = @TargetLessonId AND IsCompleted = 0
            )
            BEGIN
                INSERT INTO dbo.Recommendations (Id, StudentId, TargetLessonId, Reason, IsCompleted, CreatedAt, UpdatedAt)
                VALUES (NEWID(), @StudentId, @TargetLessonId, @Reason, 0, SYSUTCDATETIME(), SYSUTCDATETIME());
            END;
            """;

        await using var connection = CreateConnection();
        await connection.ExecuteAsync(new CommandDefinition(
            sql,
            new { StudentId = studentId, TargetLessonId = targetLessonId, Reason = reason },
            cancellationToken: cancellationToken
        ));
    }

    public async Task MarkRecommendationCompletedAsync(
        Guid studentId,
        Guid targetLessonId,
        CancellationToken cancellationToken = default)
    {
        const string sql = """
            UPDATE dbo.Recommendations
            SET 
                IsCompleted = 1,
                UpdatedAt = SYSUTCDATETIME()
            WHERE StudentId = @StudentId AND TargetLessonId = @TargetLessonId AND IsCompleted = 0;
            """;

        await using var connection = CreateConnection();
        await connection.ExecuteAsync(new CommandDefinition(
            sql,
            new { StudentId = studentId, TargetLessonId = targetLessonId },
            cancellationToken: cancellationToken
        ));
    }

    public async Task<bool> HasCompletedLessonAsync(
        Guid studentId,
        Guid lessonId,
        CancellationToken cancellationToken = default)
    {
        // Same definition of "completed" used by SqlLessonRepository.IsCompleted.
        const string sql = """
            SELECT CASE WHEN EXISTS (
                SELECT 1 FROM dbo.StudentInteractions
                WHERE StudentId = @StudentId AND LessonId = @LessonId AND Type = 1 -- CompleteLesson
            ) THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END;
            """;

        await using var connection = CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(
            sql,
            new { StudentId = studentId, LessonId = lessonId },
            cancellationToken: cancellationToken
        ));
    }

    public async Task<IReadOnlyList<QuizAttemptDto>> GetQuizHistoryAsync(
        Guid studentId,
        int take,
        CancellationToken cancellationToken = default)
    {
        // Quiz attempts are logged by QuizService as CompleteLesson (passed) or AnswerQuestion (failed)
        // interactions whose AdditionalData is a JSON score summary. Column order matches the
        // QuizAttemptDto constructor so Dapper can materialize the positional record.
        const string sql = """
            SELECT TOP (@Take)
                si.LessonId,
                l.Title AS LessonTitle,
                CAST(JSON_VALUE(si.AdditionalData, '$.Score') AS INT) AS Score,
                CAST(JSON_VALUE(si.AdditionalData, '$.Total') AS INT) AS Total,
                CAST(JSON_VALUE(si.AdditionalData, '$.AccuracyPercentage') AS FLOAT) AS AccuracyPercentage,
                CAST(CASE WHEN JSON_VALUE(si.AdditionalData, '$.IsPassed') = 'true' THEN 1 ELSE 0 END AS BIT) AS IsPassed,
                si.DurationSeconds,
                si.CreatedAt AS AttemptedAt
            FROM dbo.StudentInteractions si
            INNER JOIN dbo.Lessons l ON l.Id = si.LessonId
            WHERE si.StudentId = @StudentId
              AND si.Type IN (1, 3) -- CompleteLesson, AnswerQuestion
              AND ISJSON(si.AdditionalData) = 1
              AND JSON_VALUE(si.AdditionalData, '$.Total') IS NOT NULL
            ORDER BY si.CreatedAt DESC;
            """;

        await using var connection = CreateConnection();
        var results = await connection.QueryAsync<QuizAttemptDto>(new CommandDefinition(
            sql,
            new { StudentId = studentId, Take = take },
            cancellationToken: cancellationToken
        ));

        return results.ToList();
    }
}
