using LearnJava.Web.Domain.Enums;

namespace LearnJava.Web.Domain.Entities;

public class Student : BaseEntity
{
    
    // Authentication
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    
    // Personalization
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public LearningStyle PreferredLearningStyle { get; set; } = LearningStyle.Visual;
    public StudentStereotype CurrentStereotype { get; set; } = StudentStereotype.Beginner;
    
    // Telemetry
    public int TotalLessonsCompleted { get; set; }
    public int TotalLessonsAttempted { get; set; }
    public int TotalQuestionsAnswered { get; set; }
    public int TotalQuestionsCorrect { get; set; }
    public int CurrentStreak { get; set; }
    public int HighestStreak { get; set; }
    
    // Properties
    public double AccuracyCorrectQuestionsPercentage => TotalQuestionsAnswered == 0 ? 0.0 : Math.Round((double)TotalQuestionsCorrect / TotalQuestionsAnswered * 100.0, 1);

    public ICollection<StudentInteraction> Interactions { get; set; } = [];
    public ICollection<StudentMisconception> Misconceptions { get; set; } = [];
    public ICollection<Recommendation> Recommendations { get; set; } = [];
    public ICollection<StudentFeedback> Feedbacks { get; set; } = [];
}