import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DifficultyLevel, LearningStyle, type LessonDetail, InteractionType } from "../../domain";
import { LessonService, AnalyticsService, StudentService } from "../../services";
import MarkdownViewer from "../../components/Markdown/MarkdownViewer";
import Spinner from "../../components/Spinner/Spinner";

const STYLE_METADATA: Record<LearningStyle, { label: string; icon: string; desc: string }> = {
  [LearningStyle.Visual]: {
    label: "Visual",
    icon: "🎨",
    desc: "Diagrams, memory models, and flowcharts",
  },
  [LearningStyle.Practical]: {
    label: "Practical",
    icon: "💻",
    desc: "Interactive code snippets and hands-on examples",
  },
  [LearningStyle.Conceptual]: {
    label: "Conceptual",
    icon: "📖",
    desc: "Theory, analogies, and deep principles",
  },
  [LearningStyle.Auditory]: {
    label: "Auditory",
    icon: "🎧",
    desc: "Spoken narration, acoustic focus, and voice pacing",
  },
};

const DIFFICULTY_CONFIG: Record<DifficultyLevel, { label: string; badge: string }> = {
  [DifficultyLevel.Beginner]: {
    label: "Beginner",
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  [DifficultyLevel.Intermediate]: {
    label: "Intermediate",
    badge: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  },
  [DifficultyLevel.Advanced]: {
    label: "Advanced",
    badge: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  },
  [DifficultyLevel.Professional]: {
    label: "Professional",
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
  [DifficultyLevel.Expert]: {
    label: "Expert",
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  },
};

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auditory TTS Narration state
  const [isNarrating, setIsNarrating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Self-rated difficulty state
  const [difficultyRated, setDifficultyRated] = useState<number | null>(null);

  // Feedback widget state
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Telemetry time tracking
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!id) return;

    let ignore = false;
    startTimeRef.current = Date.now();

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await LessonService.getLessonById(id!);
        if (!ignore) {
          setLesson(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load lesson.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
      // Stop speech if running
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      // Log dwell time non-intrusively on cleanup via ReadLesson (NOT CompleteLesson)
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (durationSeconds > 3 && id) {
        AnalyticsService.trackInteraction(
          {
            lessonId: id,
            type: InteractionType.ReadLesson,
            durationSeconds,
          },
          { keepalive: true }
        );
      }
    };
  }, [id]);

  const handleSwitchStyle = async (newStyle: LearningStyle) => {
    if (!id || !lesson) return;
    try {
      setIsLoading(true);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setIsNarrating(false);
        setIsPaused(false);
      }
      // Persist preference and reload lesson with new adaptive variant
      await StudentService.updatePreferences({ preferredLearningStyle: newStyle });
      const updated = await LessonService.getLessonById(id);
      setLesson(updated);
    } catch (err) {
      console.error("Failed to switch adaptive learning style", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNarration = () => {
    if (!lesson || typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    // Strip basic markdown syntax for speech
    const cleanText = lesson.activeVariant.markdownBody
      .replace(/```[\s\S]*?```/g, "Code example omitted from audio.")
      .replace(/[#*`_]/g, "")
      .replace(/\n+/g, " ");

    const utterance = new SpeechSynthesisUtterance(
      `${lesson.title}. Summary: ${lesson.summary}. ${cleanText}`
    );
    utterance.rate = speechRate;
    utterance.lang = "en-US";

    utterance.onstart = () => {
      setIsNarrating(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsNarrating(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsNarrating(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePauseNarration = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStopNarration = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsNarrating(false);
    setIsPaused(false);
  };

  const handleRateDifficulty = async (perceived: number) => {
    if (!id) return;
    setDifficultyRated(perceived);
    await AnalyticsService.trackInteraction({
      lessonId: id,
      type: InteractionType.RateDifficulty,
      durationSeconds: 0,
      additionalData: `PerceivedDifficulty:${perceived}`,
    });
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || rating === 0) return;

    try {
      setIsSubmittingFeedback(true);
      await AnalyticsService.submitFeedback({
        lessonId: id,
        rating,
        comment: comment.trim() || undefined,
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error("Failed to submit lesson feedback", err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="rounded-2xl border border-red-800/80 bg-red-950/30 p-8 text-center text-red-300">
        <h2 className="text-xl font-bold">Error</h2>
        <p className="mt-2 text-sm text-red-400">{error || "Lesson not found."}</p>
        <Link
          to="/"
          className="mt-4 inline-block rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const difficulty =
    DIFFICULTY_CONFIG[lesson.difficulty] ?? DIFFICULTY_CONFIG[DifficultyLevel.Beginner];
  const activeStyleInfo =
    STYLE_METADATA[lesson.activeVariant.style] ?? STYLE_METADATA[LearningStyle.Visual];

  // All 4 styles available to the learner
  const allModalities = [
    LearningStyle.Visual,
    LearningStyle.Practical,
    LearningStyle.Conceptual,
    LearningStyle.Auditory,
  ];

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Lessons
        </Link>

        <button
          onClick={() => navigate(`/lessons/${lesson.id}/quiz`)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition hover:from-amber-500 hover:to-amber-400 cursor-pointer"
        >
          <span>Take Diagnostic Quiz</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>

      {/* Lesson Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-md sm:p-8">
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <span className="font-mono text-xs font-semibold text-amber-400">
            Lesson #{String(lesson.orderIndex).padStart(2, "0")}
          </span>
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${difficulty.badge}`}>
            {difficulty.label}
          </span>
          {lesson.isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Completed
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {lesson.title}
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
          {lesson.summary}
        </p>
      </div>

      {/* Adaptive Learning Style Switcher */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Learning Style:</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-xs font-medium text-amber-300">
                {activeStyleInfo.icon} {activeStyleInfo.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{activeStyleInfo.desc}</p>
          </div>

          {/* Switch tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {allModalities.map((style) => {
              const meta = STYLE_METADATA[style];
              const isActive = lesson.activeVariant.style === style;
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => handleSwitchStyle(style)}
                  disabled={isActive}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? "bg-amber-500 text-slate-950 font-semibold shadow-xs"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Auditory Narration Player Bar (Web Speech API) */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">🎧 Audio Narration:</span>
            {!isNarrating ? (
              <button
                type="button"
                onClick={handleStartNarration}
                className="inline-flex items-center gap-1 rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition cursor-pointer"
              >
                <span>▶ Play Audio</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePauseNarration}
                  className="rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-700 cursor-pointer"
                >
                  {isPaused ? "▶ Resume" : "⏸ Pause"}
                </button>
                <button
                  type="button"
                  onClick={handleStopNarration}
                  className="rounded-lg bg-rose-500/20 border border-rose-500/40 px-2.5 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/30 cursor-pointer"
                >
                  ⏹ Stop
                </button>
                <span className="text-xs text-amber-400 animate-pulse font-mono">
                  {isPaused ? "Paused" : "Speaking..."}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Speed:</span>
            {[0.8, 1.0, 1.25].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setSpeechRate(rate)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                  speechRate === rate
                    ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Instructional Content Body */}
      <article className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 sm:p-10 shadow-xl backdrop-blur-xl">
        {lesson.activeVariant.imageUrl && (
          <div className="mb-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60 p-2">
            <img
              src={lesson.activeVariant.imageUrl}
              alt={lesson.title}
              className="w-full max-h-96 object-contain rounded-lg"
            />
          </div>
        )}

        <MarkdownViewer content={lesson.activeVariant.markdownBody} />
      </article>

      {/* Self-Rated Difficulty Telemetry */}
      <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">How challenging was this content?</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Non-intrusive self-assessment helps adjust pedagogical stereotypes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[
            { label: "Too Easy", val: 1 },
            { label: "Just Right", val: 3 },
            { label: "Challenging", val: 5 },
          ].map((item) => (
            <button
              key={item.val}
              type="button"
              onClick={() => handleRateDifficulty(item.val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                difficultyRated === item.val
                  ? "bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500/50"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {item.label} {difficultyRated === item.val && "✓"}
            </button>
          ))}
        </div>
      </section>

      {/* Lesson Feedback & Rating Widget */}
      <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 sm:p-8">
        <h3 className="text-base font-bold text-white">Lesson Feedback Questionnaire</h3>
        <p className="text-xs text-slate-400 mt-1">
          Provide feedback on clarity and effectiveness to refine instructional content.
        </p>

        {feedbackSubmitted ? (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300">
            Thank you for your feedback! Your learning profile has been updated.
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Clarity Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl transition hover:scale-125 focus:outline-none cursor-pointer"
                    title={`${star} star`}
                  >
                    {star <= rating ? "★" : "☆"}
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-xs text-amber-400 font-medium">
                    {rating} of 5 stars
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Comments (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What concept was clearest? What needs further visual or code examples?"
                rows={2}
                className="w-full rounded-xl border border-slate-700/60 bg-slate-800/50 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={rating === 0 || isSubmittingFeedback}
              className="rounded-xl border border-slate-700/80 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmittingFeedback ? "Submitting..." : "Send Feedback"}
            </button>
          </form>
        )}
      </section>

      {/* Bottom CTA to Diagnostic Quiz */}
      <div className="flex justify-end pt-4">
        <button
          onClick={() => navigate(`/lessons/${lesson.id}/quiz`)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition hover:from-amber-500 hover:to-amber-400 cursor-pointer"
        >
          <span>Ready for Assessment? Take Diagnostic Quiz</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
