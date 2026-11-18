# ADR-005: Unified REST Contract, DTO Security & Non-Intrusive Telemetry

## Status
**Accepted**

## Context
The frontend for this educational system is built using **React + Vite + TypeScript**. To ensure a seamless developer experience and prevent runtime bugs, the API contract must:
1. Provide uniform envelopes for all responses (success and error alike).
2. Avoid leaking exam keys, correct answers, or internal diagnostic mappings over the wire.
3. Configure Cross-Origin Resource Sharing (CORS) correctly for local Vite development (`http://localhost:5173`).
4. Support non-intrusive usage behavior tracking as mandated by the assignment (*"Πώς μπορεί το σύστημα να συλλέξει πληροφορίες για τον χρήστη χωρίς ο ίδιος να ενοχληθεί ιδιαίτερα"*).

## Decision

### 1. Consistent API Envelope (`ApiResponse<T>`)
All endpoints return instances of `ApiResponse<T>`:
```json
{
  "status": 200,
  "message": "Adaptive lesson content retrieved successfully.",
  "timestamp": "2026-10-23T21:18:00Z",
  "data": { ... }
}
```

### 2. Modern Centralized Exception Handling (`IExceptionHandler`)
Instead of scattered try-catch blocks across controllers, we implemented `GlobalExceptionHandler` registering as an ASP.NET Core `IExceptionHandler`. Any domain exception (`ValidationException`, `AuthenticationException`, `ApiHttpException`) is caught globally and translated into a formatted `ApiResponse` with the correct HTTP status code.

### 3. Payload Projection Security
When students request quiz questions (`GET /api/v1/lessons/{id}/quiz`), the repository projects rows into `QuizQuestionResponse` and `QuizOptionResponse`. Fields such as `IsCorrect`, `Explanation`, and `AssociatedMisconceptionId` are omitted from the projection. Answers can only be evaluated through the server-side `POST /api/v1/quiz/submit` pipeline.

### 4. CORS Policy for React + Vite
Configured `FrontendPolicy` in `Program.cs` allowing `http://localhost:5173` with credentials, any method, and any header.

### 5. Non-Intrusive Telemetry
Telemetry is collected via two complementary mechanisms:
- **Implicit Server-Side Tracking**: Reading events are logged transparently when endpoints are consumed (`LessonService.GetLessonDetailAsync`).
- **Client Heartbeat Tracking**: `AnalyticsController.TrackInteraction` accepts time durations, hint requests, and reading times sent periodically by the client without prompting the user.

## Consequences

### Benefits
- **Bulletproof Frontend Integration**: Predictable TypeScript typings generated from a consistent envelope.
- **Cheating Prevention**: Network payload inspections in browser dev tools cannot reveal quiz answers.
- **Rich Behavioral Analytics**: Teachers and administrators gain visibility into student learning patterns and dwell times without invasive survey prompts.

### Trade-offs
- Every response incurs a minor wrapper envelope (`data` property access on frontend).
