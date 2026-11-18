using LearnJava.Web.Domain.Enums;

namespace LearnJava.Web.Services.DTOs.Requests;

public record UpdatePreferencesRequest(
    LearningStyle PreferredLearningStyle,
    string? FirstName = null,
    string? LastName = null
);
