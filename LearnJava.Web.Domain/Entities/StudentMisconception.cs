namespace LearnJava.Web.Domain.Entities;

public class StudentMisconception : BaseEntity
{
    public Guid StudentId { get; set; }
    public Student? Student { get; set; }
    
    public Guid MisconceptionId { get; set; }
    public Misconception? Misconception { get; set; }
    
    public int OccurrenceCount { get; set; } = 1;
    public bool IsResolved { get; set; }
    public DateTime LastOccurredAt { get; set; } = DateTime.UtcNow;
}
