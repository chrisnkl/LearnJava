# ADR-001: Stereotype-Based User Modeling & Rule Inference Engine

## Status
**Accepted**

## Context
The project requires maintaining a dynamic model of each learner's knowledge level without relying on opaque machine learning models or cumbersome manual administrative adjustments. The assignment specifies utilizing the **Stereotype Method**

We needed an inference engine that:
1. Translates historical learner metrics (accuracy percentage, completed lessons, streaks, total question volume) into discrete pedagogical stereotypes: `Beginner`, `Intermediate`, `Advanced`, `Professional`.
2. Re-evaluates stereotype classification deterministically and dynamically upon every quiz evaluation.
3. Remains highly readable, testable, and maintainable without complex external rule engine frameworks.

## Decision
We implemented `AdaptiveInferenceEngine` utilizing modern C# 13 relational and logical pattern matching over positional tuples:

```csharp
public StudentStereotype InferStereotype(
    double accuracyPercentage,
    int totalQuestionsAnswered,
    int currentStreak,
    int lessonsCompleted)
{
    return (accuracyPercentage, totalQuestionsAnswered, currentStreak, lessonsCompleted) switch
    {
        ( >= 90.0, >= 15, >= 5, >= 3) => StudentStereotype.Professional,
        ( >= 75.0, >= 10, _, >= 2)    => StudentStereotype.Advanced,
        ( >= 50.0, >= 4, _, _)        => StudentStereotype.Intermediate,
        _                             => StudentStereotype.Beginner
    };
}
```

### Educational Inference Rules
- **Professional**: Accuracy $\ge 90\%$, at least 15 questions answered, streak $\ge 5$, and at least 3 lessons completed.
- **Advanced**: Accuracy $\ge 75\%$, at least 10 questions answered, and at least 2 lessons completed.
- **Intermediate**: Accuracy $\ge 50\%$, at least 4 questions answered.
- **Beginner**: Default entry stereotype or when foundation thresholds have not yet been met.

## Consequences

### Benefits
- **Zero Framework Bloat**: No dependency on external rule engines (e.g. Drools or RulesEngine). Pure native C# pattern matching runs in nanoseconds.
- **Determinism & Transparency**: Academic grading and student tier progression is completely auditable and explainable.
- **Educational Alignment**: Perfectly matches Rich's classical user modeling stereotype methodology where stereotypes serve as default collections of traits activated by heuristic triggers.

### Trade-offs
- Static thresholds require code changes or configuration expansion if grading criteria need adjustment across semesters.
