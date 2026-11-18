import type { SubmitFeedbackRequest, TrackInteractionRequest } from "../domain";
import { apiClient } from "./apiClient";

export const AnalyticsService = {
  /**
   * Tracks learner interactions, dwell time, hint requests, and reading times non-intrusively.
   * Pass `keepalive: true` when called while the page is being unloaded so the request survives.
   */
  async trackInteraction(
    request: TrackInteractionRequest,
    options?: { keepalive?: boolean }
  ): Promise<void> {
    try {
      await apiClient<void>("/analytics/interaction", {
        method: "POST",
        body: JSON.stringify(request),
        keepalive: options?.keepalive,
      });
    } catch (err) {
      // Telemetry shouldn't block the UI if network hiccups occur
      console.warn("Failed to track telemetry interaction", err);
    }
  },

  /**
   * Submits student rating and feedback for a lesson.
   */
  async submitFeedback(request: SubmitFeedbackRequest): Promise<void> {
    return apiClient<void>("/analytics/feedback", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },
};
