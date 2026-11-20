import type { LessonDetail, LessonSummary, QuizQuestion } from "../domain";
import { apiClient } from "./apiClient";

export const LessonService = {
  
  // Retrieves all available lessons for the authenticated student.
  async getAllLessons(): Promise<LessonSummary[]> {
    return apiClient<LessonSummary[]>("/lessons");
  },

  
  // Retrieves full adaptive lesson details by lesson ID.
  async getLessonById(id: string): Promise<LessonDetail> {
    return apiClient<LessonDetail>(`/lessons/${id}`);
  },
  
  // Retrieves diagnostic quiz questions for a lesson.
  async getLessonQuiz(id: string): Promise<QuizQuestion[]> {
    return apiClient<QuizQuestion[]>(`/lessons/${id}/quiz`);
  },
};
