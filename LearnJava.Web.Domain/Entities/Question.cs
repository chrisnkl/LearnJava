namespace LearnJava.Web.Domain.Entities;

public class Question : BaseEntity
{
    public Guid LessonId { get; set; }
    public Lesson? Lesson { get; set; }
    
    public string Prompt { get; set; } = string.Empty;
    public string? CodeSnippet { get; set; }
    public string? HintText { get; set; }
    public int OrderIndex { get; set; }
    
    public ICollection<QuestionOption> Options { get; set; } = [];
}
