using LearnJava.Web.Domain.Enums;

namespace LearnJava.Web.Domain.Entities;

public class StudentFeedback : BaseEntity
{
    
    public Guid StudentId { get; set; }
    public Guid LessonId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; } = string.Empty;

}