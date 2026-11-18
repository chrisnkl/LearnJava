namespace LearnJava.Web.Domain.Enums;

public enum LearningStyle
{
    
    Visual = 0,
    Practical = 1,
    Conceptual = 2,
    /// <summary>
    /// Listening-oriented learner (assignment: "οπτικός ή ακουστικός τρόπος").
    /// No dedicated content variant is authored; the client narrates the lesson with
    /// text-to-speech and the repository serves the prose-heavy Conceptual variant first.
    /// </summary>
    Auditory = 3
    
}