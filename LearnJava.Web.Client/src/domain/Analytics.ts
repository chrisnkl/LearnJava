import { InteractionType } from "./Enums";

export interface TrackInteractionRequest {
  lessonId?: string | null;
  questionId?: string | null;
  type: InteractionType;
  durationSeconds: number;
  additionalData?: string | null;
}

export interface SubmitFeedbackRequest {
  lessonId: string;
  rating: number;
  comment?: string | null;
}

