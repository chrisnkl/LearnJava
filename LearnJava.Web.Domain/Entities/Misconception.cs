namespace LearnJava.Web.Domain.Entities;

public class Misconception : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Explanation { get; set; } = string.Empty;
    public string CorrectiveAdvice { get; set; } = string.Empty;
}
