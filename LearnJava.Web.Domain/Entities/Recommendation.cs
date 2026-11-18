namespace LearnJava.Web.Domain.Entities;

public class Recommendation : BaseEntity
{
    public Guid StudentId { get; set; }
    public Student? Student { get; set; }
    
    public Guid TargetLessonId { get; set; }
    public Lesson? TargetLesson { get; set; }
    
    public string Reason { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
}
