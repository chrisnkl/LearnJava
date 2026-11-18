using LearnJava.Web.Services.DTOs.Responses;

namespace LearnJava.Web.Services.Repositories;

public interface IMisconceptionRepository
{
    Task<IReadOnlyList<MisconceptionSummaryDto>> GetActiveByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default);
    Task UpsertStudentMisconceptionAsync(Guid studentId, Guid misconceptionId, CancellationToken cancellationToken = default);
    Task ResolveStudentMisconceptionAsync(Guid studentId, Guid misconceptionId, CancellationToken cancellationToken = default);
}
