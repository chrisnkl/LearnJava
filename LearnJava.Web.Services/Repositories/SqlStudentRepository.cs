using System.Data;
using Dapper;
using LearnJava.Web.Domain.Entities;
using LearnJava.Web.Domain.Enums;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace LearnJava.Web.Services.Repositories;

public class SqlStudentRepository : IStudentRepository
{
    private readonly string _connectionString;

    public SqlStudentRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? configuration.GetConnectionString("Database")
            ?? "Server=localhost\\SQLEXPRESS;Database=LearnJavaDb;Trusted_Connection=True;TrustServerCertificate=True;";
    }

    private SqlConnection CreateConnection() => new SqlConnection(_connectionString);

    public async Task<Student?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        const string sql = """
            SELECT 
                Id,
                Email,
                PasswordHash,
                FirstName,
                LastName,
                PreferredLearningStyle,
                CurrentStereotype,
                TotalLessonsCompleted,
                TotalLessonsAttempted,
                TotalQuestionsAnswered,
                TotalQuestionsCorrect,
                CurrentStreak,
                HighestStreak,
                CreatedAt,
                UpdatedAt
            FROM dbo.Students
            WHERE Email = @Email;
            """;

        await using var connection = CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Student>(
            new CommandDefinition(sql, new { Email = email }, cancellationToken: cancellationToken)
        );
    }

    public async Task<Student?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        const string sql = """
            SELECT 
                Id,
                Email,
                PasswordHash,
                FirstName,
                LastName,
                PreferredLearningStyle,
                CurrentStereotype,
                TotalLessonsCompleted,
                TotalLessonsAttempted,
                TotalQuestionsAnswered,
                TotalQuestionsCorrect,
                CurrentStreak,
                HighestStreak,
                CreatedAt,
                UpdatedAt
            FROM dbo.Students
            WHERE Id = @Id;
            """;

        await using var connection = CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Student>(
            new CommandDefinition(sql, new { Id = id }, cancellationToken: cancellationToken)
        );
    }

    public async Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        const string sql = """
            SELECT CASE WHEN EXISTS (
                SELECT 1 FROM dbo.Students WHERE Email = @Email
            ) THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END;
            """;

        await using var connection = CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(sql, new { Email = email }, cancellationToken: cancellationToken)
        );
    }

    public async Task AddAsync(Student student, CancellationToken cancellationToken = default)
    {
        const string sql = """
            INSERT INTO dbo.Students (
                Id,
                Email,
                PasswordHash,
                FirstName,
                LastName,
                PreferredLearningStyle,
                CurrentStereotype,
                TotalLessonsCompleted,
                TotalLessonsAttempted,
                TotalQuestionsAnswered,
                TotalQuestionsCorrect,
                CurrentStreak,
                HighestStreak,
                CreatedAt,
                UpdatedAt
            ) VALUES (
                @Id,
                @Email,
                @PasswordHash,
                @FirstName,
                @LastName,
                @PreferredLearningStyle,
                @CurrentStereotype,
                @TotalLessonsCompleted,
                @TotalLessonsAttempted,
                @TotalQuestionsAnswered,
                @TotalQuestionsCorrect,
                @CurrentStreak,
                @HighestStreak,
                @CreatedAt,
                @UpdatedAt
            );
            """;

        await using var connection = CreateConnection();
        await connection.ExecuteAsync(
            new CommandDefinition(sql, student, cancellationToken: cancellationToken)
        );
    }

    public async Task UpdatePreferencesAsync(
        Guid studentId,
        LearningStyle preferredStyle,
        string? firstName,
        string? lastName,
        CancellationToken cancellationToken = default)
    {
        const string sql = """
            UPDATE dbo.Students
            SET 
                PreferredLearningStyle = @PreferredLearningStyle,
                FirstName = COALESCE(@FirstName, FirstName),
                LastName = COALESCE(@LastName, LastName),
                UpdatedAt = SYSUTCDATETIME()
            WHERE Id = @Id;
            """;

        await using var connection = CreateConnection();
        await connection.ExecuteAsync(new CommandDefinition(
            sql,
            new
            {
                Id = studentId,
                PreferredLearningStyle = (int)preferredStyle,
                FirstName = firstName,
                LastName = lastName
            },
            cancellationToken: cancellationToken
        ));
    }

    public async Task UpdateTelemetryAndStereotypeAsync(Student student, CancellationToken cancellationToken = default)
    {
        const string sql = """
            UPDATE dbo.Students
            SET 
                CurrentStereotype = @CurrentStereotype,
                TotalLessonsCompleted = @TotalLessonsCompleted,
                TotalLessonsAttempted = @TotalLessonsAttempted,
                TotalQuestionsAnswered = @TotalQuestionsAnswered,
                TotalQuestionsCorrect = @TotalQuestionsCorrect,
                CurrentStreak = @CurrentStreak,
                HighestStreak = @HighestStreak,
                UpdatedAt = SYSUTCDATETIME()
            WHERE Id = @Id;
            """;

        await using var connection = CreateConnection();
        await connection.ExecuteAsync(new CommandDefinition(
            sql,
            new
            {
                student.Id,
                CurrentStereotype = (int)student.CurrentStereotype,
                student.TotalLessonsCompleted,
                student.TotalLessonsAttempted,
                student.TotalQuestionsAnswered,
                student.TotalQuestionsCorrect,
                student.CurrentStreak,
                student.HighestStreak
            },
            cancellationToken: cancellationToken
        ));
    }
}
