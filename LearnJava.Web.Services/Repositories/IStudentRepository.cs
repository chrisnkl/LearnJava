using LearnJava.Web.Domain.Entities;
using LearnJava.Web.Domain.Enums;

namespace LearnJava.Web.Services.Repositories;

public interface IStudentRepository
{
    Task<Student?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<Student?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task AddAsync(Student student, CancellationToken cancellationToken = default);
    Task UpdatePreferencesAsync(Guid studentId, LearningStyle preferredStyle, string? firstName, string? lastName, CancellationToken cancellationToken = default);
    Task UpdateTelemetryAndStereotypeAsync(Student student, CancellationToken cancellationToken = default);
}
