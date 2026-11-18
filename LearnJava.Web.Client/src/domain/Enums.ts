// NOTE: tsconfig enables `erasableSyntaxOnly`, which forbids TypeScript `enum`.
// Each "enum" is therefore a frozen const object plus a same-named union type.
// Usage is unchanged: `DifficultyLevel.Beginner` (value) and `DifficultyLevel` (type).
// Numeric values mirror the C# enums in LearnJava.Web.Domain/Enums (serialized as numbers).

export const DifficultyLevel = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
  Professional: 3,
  Expert: 4,
} as const;
export type DifficultyLevel = (typeof DifficultyLevel)[keyof typeof DifficultyLevel];

export const LearningStyle = {
  Visual: 0,
  Practical: 1,
  Conceptual: 2,
  Auditory: 3,
} as const;
export type LearningStyle = (typeof LearningStyle)[keyof typeof LearningStyle];

export const StudentStereotype = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
  Professional: 3,
} as const;
export type StudentStereotype = (typeof StudentStereotype)[keyof typeof StudentStereotype];

export const InteractionType = {
  StartLesson: 0,
  CompleteLesson: 1,
  RequestHint: 2,
  AnswerQuestion: 3,
  ViewExplanation: 4,
  RateDifficulty: 5,
  ReadLesson: 6,
} as const;
export type InteractionType = (typeof InteractionType)[keyof typeof InteractionType];
