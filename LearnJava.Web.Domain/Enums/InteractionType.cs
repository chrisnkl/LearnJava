namespace LearnJava.Web.Domain.Enums;

public enum InteractionType
{
    StartLesson = 0,
    CompleteLesson = 1,
    RequestHint = 2,
    AnswerQuestion = 3,
    ViewExplanation = 4,
    RateDifficulty = 5,
    // Passive reading-time heartbeat sent by the client when a lesson is left.
    // Deliberately distinct from CompleteLesson, which drives lesson completion status.
    ReadLesson = 6
}