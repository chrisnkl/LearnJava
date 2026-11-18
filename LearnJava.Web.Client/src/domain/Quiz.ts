import { StudentStereotype } from "./Enums";

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  codeSnippet?: string | null;
  hintText?: string | null;
  orderIndex: number;
  options: QuizOption[];
}

export interface DetectedMisconception {
  code: string;
  title: string;
  explanation: string;
  correctiveAdvice: string;
}

export interface QuestionAnswerSubmission {
  questionId: string;
  selectedOptionId: string;
}

export interface QuizSubmissionRequest {
  lessonId: string;
  answers: QuestionAnswerSubmission[];
  durationSeconds?: number;
}

export interface QuestionEvaluation {
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  explanation: string;
  detectedMisconception?: DetectedMisconception | null;
}

export interface QuizSubmissionResult {
  lessonId: string;
  totalQuestions: number;
  score: number;
  accuracyPercentage: number;
  isPassed: boolean;
  currentStreak: number;
  highestStreak: number;
  previousStereotype: StudentStereotype;
  currentStereotype: StudentStereotype;
  stereotypeChanged: boolean;
  questionResults: QuestionEvaluation[];
  detectedMisconceptions: DetectedMisconception[];
}

