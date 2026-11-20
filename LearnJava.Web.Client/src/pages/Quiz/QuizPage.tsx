import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  StudentStereotype,
  type QuizQuestion,
  type QuizSubmissionResult,
  InteractionType,
} from "../../domain";
import { LessonService, QuizService, AnalyticsService } from "../../services";
import Spinner from "../../components/Spinner/Spinner";

const STEREOTYPE_NAMES: Record<StudentStereotype, string> = {
  [StudentStereotype.Beginner]: "Beginner",
  [StudentStereotype.Intermediate]: "Intermediate",
  [StudentStereotype.Advanced]: "Advanced",
  [StudentStereotype.Professional]: "Professional",
};

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quiz progression
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [hintsRevealed, setHintsRevealed] = useState<Record<string, boolean>>({});

  // Submission & Diagnostic Results
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizSubmissionResult | null>(null);

  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    startTimeRef.current = Date.now();

    async function loadQuiz() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await LessonService.getLessonQuiz(id!);
        if (!ignore) {
          setQuestions(data.sort((a, b) => a.orderIndex - b.orderIndex));
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load quiz.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadQuiz();

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleToggleHint = (question: QuizQuestion) => {
    const isRevealing = !hintsRevealed[question.id];
    setHintsRevealed((prev) => ({
      ...prev,
      [question.id]: isRevealing,
    }));

    if (isRevealing) {
      AnalyticsService.trackInteraction({
        lessonId: id,
        questionId: question.id,
        type: InteractionType.RequestHint,
        durationSeconds: 0,
      });
    }
  };

  const handleSubmit = async () => {
    if (!id) return;

    const unansweredCount = questions.filter((q) => !selectedAnswers[q.id]).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered ${
          unansweredCount === 1 ? "question" : "questions"
        }. Do you want to submit anyway?`
      );
      if (!confirmSubmit) return;
    }

    try {
      setIsSubmitting(true);
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

      const submissionPayload = {
        lessonId: id,
        answers: Object.entries(selectedAnswers).map(([questionId, selectedOptionId]) => ({
          questionId,
          selectedOptionId,
        })),
        durationSeconds,
      };

      const res = await QuizService.submitQuiz(submissionPayload);
      setResult(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to evaluate quiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
        <h2 className="text-xl font-bold text-white">Quiz Not Available</h2>
        <p className="mt-2 text-sm">{error || "No diagnostic questions found for this lesson."}</p>
        <Link
          to={`/lessons/${id}`}
          className="mt-4 inline-block rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
        >
          Return to Lesson
        </Link>
      </div>
    );
  }

  // Results view
  if (result) {
    const isPassed = result.isPassed;
    const currentStereoName =
      STEREOTYPE_NAMES[result.currentStereotype] ?? "Beginner";
    const prevStereoName =
      STEREOTYPE_NAMES[result.previousStereotype] ?? "Beginner";

    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Results Header Card */}
        <div
          className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 backdrop-blur-xl ${
            isPassed
              ? "border-emerald-500/40 bg-emerald-950/20"
              : "border-amber-500/40 bg-amber-950/20"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span
                className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                  isPassed
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-amber-500/40 bg-amber-500/10 text-amber-300"
                }`}
              >
                {isPassed ? "Assessment Passed" : "Needs Review"}
              </span>
              <h1 className="mt-2 text-3xl font-extrabold text-white">
                {isPassed ? "Excellent Progress!" : "Keep Practicing!"}
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                You scored{" "}
                <strong className="text-white">
                  {result.score} of {result.totalQuestions}
                </strong>{" "}
                ({result.accuracyPercentage.toFixed(0)}% Accuracy). Current Streak:{" "}
                <span className="text-amber-400 font-semibold">{result.currentStreak} 🔥</span>
              </p>
            </div>

            {/* Score Ring / Pill */}
            <div className="flex items-center gap-3">
              <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-inner">
                <span className="text-2xl font-black text-amber-400">
                  {result.accuracyPercentage.toFixed(0)}%
                </span>
                <span className="text-[10px] text-slate-400 font-medium">SCORE</span>
              </div>
            </div>
          </div>

          {/* Stereotype Progression Alert */}
          {result.stereotypeChanged ? (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-500/40 bg-amber-500/15 p-4 text-amber-200">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="text-sm font-bold text-white">
                  Stereotype Level Up!
                </p>
                <p className="text-xs text-amber-300 mt-0.5">
                  Your pedagogical profile progressed from{" "}
                  <strong className="underline">{prevStereoName}</strong> to{" "}
                  <strong className="text-white underline">{currentStereoName}</strong>. The system is adapting your curriculum accordingly!
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-xs text-slate-400">
              Current Learner Model: <strong className="text-slate-200">{currentStereoName}</strong>
            </div>
          )}
        </div>

        {/* Misconception Diagnostic Feedback (ADR-002: Distractor Mapping) */}
        {result.detectedMisconceptions.length > 0 ? (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-950/25 p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⚠️</span>
              <h2 className="text-lg font-bold text-rose-300">
                Misconceptions Diagnosed ({result.detectedMisconceptions.length})
              </h2>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Based on your answers, these concepts need review:
            </p>

            <div className="space-y-4">
              {result.detectedMisconceptions.map((misc, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-rose-500/30 bg-slate-900/80 p-5 space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">{misc.title}</h3>
                    <span className="font-mono text-[10px] uppercase text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                      {misc.code}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-rose-300">Common Mistake: </span>
                    <span className="text-xs text-slate-300 leading-relaxed">{misc.explanation}</span>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <span className="text-xs font-semibold text-emerald-400">Correct Java Rule: </span>
                    <span className="text-xs text-slate-300 leading-relaxed">{misc.correctiveAdvice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 text-emerald-300">
            <span className="text-2xl">✨</span>
            <div>
              <p className="text-sm font-bold text-white">No Misconceptions Detected</p>
              <p className="text-xs text-emerald-400 mt-0.5">
                No misconceptions detected in this quiz.
              </p>
            </div>
          </div>
        )}

        {/* Detailed Question Review */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Question Breakdown</h2>
          {result.questionResults.map((evalResult, idx) => {
            const questionObj = questions.find((q) => q.id === evalResult.questionId);
            return (
              <div
                key={evalResult.questionId}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-semibold text-slate-400">
                    Question #{idx + 1}
                  </span>
                  {evalResult.isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      Correct
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Incorrect
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-white mb-3">
                  {questionObj?.prompt}
                </p>

                {questionObj?.codeSnippet && (
                  <pre className="mb-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-mono text-amber-300">
                    <code>{questionObj.codeSnippet}</code>
                  </pre>
                )}

                {/* Options Review: Your Choice vs Correct Answer */}
                <div className="space-y-2 mb-4">
                  {questionObj?.options.map((opt) => {
                    const isChosen = opt.id === evalResult.selectedOptionId;
                    const isCorrect = opt.id === evalResult.correctOptionId;
                    return (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                          isCorrect
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200 font-medium"
                            : isChosen
                            ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
                            : "border-slate-800/80 bg-slate-950/40 text-slate-400"
                        }`}
                      >
                        <span>{opt.text}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isChosen && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isCorrect
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-rose-500/20 text-rose-300"
                              }`}
                            >
                              Your Choice {isCorrect ? "✓" : "✗"}
                            </span>
                          )}
                          {isCorrect && !isChosen && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                              Correct Answer ✓
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs text-slate-300">
                  <span className="font-semibold text-amber-400">Pedagogical Explanation: </span>
                  {evalResult.explanation}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <Link
            to={`/lessons/${id}`}
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white"
          >
            Review Lesson Material
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setResult(null);
                setSelectedAnswers({});
                setHintsRevealed({});
                setCurrentIndex(0);
                startTimeRef.current = Date.now();
              }}
              className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => navigate("/")}
              className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active question view
  const currentQ = questions[currentIndex];
  const answeredTotal = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Progress Bar & Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <Link
            to={`/lessons/${id}`}
            className="hover:text-white transition flex items-center gap-1"
          >
            ← Exit Quiz
          </Link>
          <span>
            Question <strong className="text-white">{currentIndex + 1}</strong> of {questions.length}
          </span>
          <span>{answeredTotal} answered</span>
        </div>

        {/* Progress meter */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <h2 className="text-lg font-bold text-white sm:text-xl leading-relaxed">
          {currentQ.prompt}
        </h2>

        {currentQ.codeSnippet && (
          <div className="my-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
            <div className="border-b border-slate-800/60 bg-slate-900/70 px-4 py-1 text-[11px] font-mono text-slate-400">
              Java Snippet
            </div>
            <pre className="p-4 text-xs font-mono text-amber-200 leading-relaxed overflow-x-auto">
              <code>{currentQ.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Pedagogical Hint Accordion */}
        {currentQ.hintText && (
          <div className="my-4">
            <button
              type="button"
              onClick={() => handleToggleHint(currentQ)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 transition cursor-pointer"
            >
              <span>💡</span>
              <span>{hintsRevealed[currentQ.id] ? "Hide Pedagogical Hint" : "Need a Hint?"}</span>
            </button>

            {hintsRevealed[currentQ.id] && (
              <div className="mt-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
                {currentQ.hintText}
              </div>
            )}
          </div>
        )}

        {/* Options Selection */}
        <div className="mt-6 space-y-3">
          {currentQ.options.map((opt) => {
            const isPicked = selectedAnswers[currentQ.id] === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(currentQ.id, opt.id)}
                className={`flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition cursor-pointer ${
                  isPicked
                    ? "border-amber-500 bg-amber-500/10 shadow-sm"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition ${
                    isPicked
                      ? "border-amber-500 bg-amber-500"
                      : "border-slate-600 bg-slate-800"
                  }`}
                >
                  {isPicked && <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                </div>
                <span
                  className={`text-xs sm:text-sm leading-relaxed ${
                    isPicked ? "font-semibold text-white" : "text-slate-300"
                  }`}
                >
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="rounded-xl border border-slate-700/80 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-2 text-xs font-bold text-white transition cursor-pointer"
          >
            Next Question →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Evaluating Misconceptions..." : "Submit Diagnostic Assessment"}
          </button>
        )}
      </div>
    </div>
  );
}

