using Dapper;
using LearnJava.Web.Services.DTOs.Responses;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace LearnJava.Web.Services.Repositories;

public class SqlMisconceptionRepository : IMisconceptionRepository
{
    private readonly string _connectionString;

    public SqlMisconceptionRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? configuration.GetConnectionString("Database")
            ?? "Server=localhost\\SQLEXPRESS;Database=LearnJavaDb;Trusted_Connection=True;TrustServerCertificate=True;";
    }

    private SqlConnection CreateConnection() => new SqlConnection(_connectionString);

    public async Task<IReadOnlyList<MisconceptionSummaryDto>> GetActiveByStudentIdAsync(
        Guid studentId,
        CancellationToken cancellationToken = default)
    {
        const string sql = """
            SELECT 
                m.Id AS MisconceptionId,
                m.Code,
                m.Title,
                m.Explanation,
                m.CorrectiveAdvice,
                sm.OccurrenceCount,
                sm.IsResolved,
                sm.LastOccurredAt
            FROM dbo.StudentMisconceptions sm
            INNER JOIN dbo.Misconceptions m ON m.Id = sm.MisconceptionId
            WHERE sm.StudentId = @StudentId AND sm.IsResolved = 0
            ORDER BY sm.OccurrenceCount DESC, sm.LastOccurredAt DESC;
            """;

        await using var connection = CreateConnection();
        var results = await connection.QueryAsync<MisconceptionSummaryDto>(
            new CommandDefinition(sql, new { StudentId = studentId }, cancellationToken: cancellationToken)
        );

        return results.ToList();
    }

    public async Task UpsertStudentMisconceptionAsync(
        Guid studentId,
        Guid misconceptionId,
        CancellationToken cancellationToken = default)
    {
        const string sql = """
            MERGE INTO dbo.StudentMisconceptions AS target
            USING (SELECT @StudentId AS StudentId, @MisconceptionId AS MisconceptionId) AS source
            ON target.StudentId = source.StudentId AND target.MisconceptionId = source.MisconceptionId
            WHEN MATCHED THEN
                UPDATE SET 
                    OccurrenceCount = target.OccurrenceCount + 1,
                    IsResolved = 0,
                    LastOccurredAt = SYSUTCDATETIME(),
                    UpdatedAt = SYSUTCDATETIME()
            WHEN NOT MATCHED THEN
                INSERT (Id, StudentId, MisconceptionId, OccurrenceCount, IsResolved, LastOccurredAt, CreatedAt, UpdatedAt)
                VALUES (NEWID(), source.StudentId, source.MisconceptionId, 1, 0, SYSUTCDATETIME(), SYSUTCDATETIME(), SYSUTCDATETIME());
            """;

        await using var connection = CreateConnection();
        await connection.ExecuteAsync(new CommandDefinition(
            sql,
            new { StudentId = studentId, MisconceptionId = misconceptionId },
            cancellationToken: cancellationToken
        ));
    }

    public async Task ResolveStudentMisconceptionAsync(
        Guid studentId,
        Guid misconceptionId,
        CancellationToken cancellationToken = default)
    {
        const string sql = """
            UPDATE dbo.StudentMisconceptions
            SET 
                IsResolved = 1,
                UpdatedAt = SYSUTCDATETIME()
            WHERE StudentId = @StudentId AND MisconceptionId = @MisconceptionId;
            """;

        await using var connection = CreateConnection();
        await connection.ExecuteAsync(new CommandDefinition(
            sql,
            new { StudentId = studentId, MisconceptionId = misconceptionId },
            cancellationToken: cancellationToken
        ));
    }
}
