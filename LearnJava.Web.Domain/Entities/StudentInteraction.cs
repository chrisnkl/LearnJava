using LearnJava.Web.Domain.Enums;

namespace LearnJava.Web.Domain.Entities;

public class StudentInteraction : BaseEntity
{
    
    public Guid StudentId { get; set; }
    public Guid? LessonId { get; set; }
    public Guid? QuestionId { get; set; }
    public InteractionType Type { get; set; }
    public int DurationSeconds { get; set; }
    public string? AdditionalData { get; set; }
    
}