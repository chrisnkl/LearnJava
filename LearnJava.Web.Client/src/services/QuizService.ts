import type { QuizSubmissionRequest, QuizSubmissionResult } from "../domain";
import { apiClient } from "./apiClient";

export const QuizService = {
  
  // Submits answers for a lesson quiz and evaluates student mastery & misconceptions.
  async submitQuiz(request: QuizSubmissionRequest): Promise<QuizSubmissionResult> {
    return apiClient<QuizSubmissionResult>("/quiz/submit", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },
};

