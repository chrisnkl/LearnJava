using LearnJava.Web.Domain.Enums;

namespace LearnJava.Web.Domain.Entities;

public class LessonContentVariant : BaseEntity
{
    public Guid LessonId { get; set; }
    public Lesson? Lesson { get; set; }
    
    public LearningStyle Style { get; set; } = LearningStyle.Visual;
    public string MarkdownBody { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
}
