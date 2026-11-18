import { DifficultyLevel, LearningStyle } from "./Enums";

export interface LessonSummary {
  id: string;
  title: string;
  summary: string;
  difficulty: DifficultyLevel;
  orderIndex: number;
  isCompleted: boolean;
  questionCount: number;
}

export interface LessonVariant {
  style: LearningStyle;
  markdownBody: string;
  imageUrl?: string | null;
}

export interface LessonDetail {
  id: string;
  title: string;
  summary: string;
  difficulty: DifficultyLevel;
  orderIndex: number;
  isCompleted: boolean;
  activeVariant: LessonVariant;
  availableStyles: LearningStyle[];
}

