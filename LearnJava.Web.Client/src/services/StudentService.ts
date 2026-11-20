import type { QuizAttempt, StudentProfileResponse, UpdatePreferencesRequest } from "../domain";
import { apiClient } from "./apiClient";

export const StudentService = {
  /**
   * Retrieves the student profile including stereotype, metrics, and misconceptions.
   */
  async getProfile(): Promise<StudentProfileResponse> {
    return apiClient<StudentProfileResponse>("/student/profile");
  },

  /**
   * Updates student learning preferences (Visual, Practical, Conceptual, Auditory) and optionally the name.
   * Omitted names are left unchanged by the backend (COALESCE).
   */
  async updatePreferences(request: UpdatePreferencesRequest): Promise<void> {
    return apiClient<void>("/student/preferences", {
      method: "PUT",
      body: JSON.stringify(request),
    });
  },

  /**
   * Retrieves the most recent diagnostic quiz attempts (newest first).
   */
  async getQuizHistory(take = 20): Promise<QuizAttempt[]> {
    return apiClient<QuizAttempt[]>(`/student/history?take=${take}`);
  },
};
