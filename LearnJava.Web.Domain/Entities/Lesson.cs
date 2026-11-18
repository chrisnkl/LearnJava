using LearnJava.Web.Domain.Enums;

namespace LearnJava.Web.Domain.Entities;

public class Lesson : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public DifficultyLevel Difficulty { get; set; } = DifficultyLevel.Beginner;
    public int OrderIndex { get; set; }
    
    public ICollection<LessonContentVariant> ContentVariants { get; set; } = [];
    public ICollection<Question> Questions { get; set; } = [];
}