namespace LearnJava.Web.Domain.Entities;

public class QuestionOption : BaseEntity
{
    public Guid QuestionId { get; set; }
    public Question? Question { get; set; }
    
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public string Explanation { get; set; } = string.Empty;
    
    public Guid? AssociatedMisconceptionId { get; set; }
    public Misconception? AssociatedMisconception { get; set; }
}
