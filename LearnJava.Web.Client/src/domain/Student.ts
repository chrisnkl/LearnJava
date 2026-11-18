import { LearningStyle, StudentStereotype } from "./Enums";

export interface MisconceptionSummary {
  misconceptionId: string;
  code: string;
  title: string;
  explanation: string;
  correctiveAdvice: string;
  occurrenceCount: number;
  isResolved: boolean;
  lastOccurredAt: string;
}

export interface RecommendationSummary {
  id: string;
  targetLessonId: string;
  lessonTitle: string;
  reason: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface StudentProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  preferredLearningStyle: LearningStyle;
  currentStereotype: StudentStereotype;
  totalLessonsCompleted: number;
  totalLessonsAttempted: number;
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  currentStreak: number;
  highestStreak: number;
  accuracyPercentage: number;
  activeMisconceptions: MisconceptionSummary[];
  activeRecommendations: RecommendationSummary[];
}

export interface UpdatePreferencesRequest {
  preferredLearningStyle: LearningStyle;
  firstName?: string | null;
  lastName?: string | null;
}

/** One diagnostic quiz attempt (GET /student/history). */
export interface QuizAttempt {
  lessonId: string;
  lessonTitle: string;
  score: number;
  total: number;
  accuracyPercentage: number;
  isPassed: boolean;
  durationSeconds: number;
  attemptedAt: string;
}

