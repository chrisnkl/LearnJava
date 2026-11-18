import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DifficultyLevel, type LessonSummary } from "../../domain";
import { LessonService } from "../../services";
import Spinner from "../../components/Spinner/Spinner";

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

export default function QuizzesPage() {
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await LessonService.getAllLessons();
        if (!ignore) {
          setLessons(data.sort((a, b) => a.orderIndex - b.orderIndex));
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load quizzes.");
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
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-800 bg-red-950/20 p-8 text-center text-red-300">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Diagnostic Quizzes</h1>
        <p className="mt-1 text-sm text-slate-400">
          Assess your Java knowledge. Our inference engine identifies subtle misconceptions in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lessons.map((lesson) => {
          const diff =
            DIFFICULTY_CONFIG[lesson.difficulty] ?? DIFFICULTY_CONFIG[DifficultyLevel.Beginner];
          return (
            <div
              key={lesson.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm transition hover:border-slate-700"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-semibold text-slate-400">
                    Quiz #{String(lesson.orderIndex + 1).padStart(2, "0")}
                  </span>
                  <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${diff.badge}`}>
                    {diff.label}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white">{lesson.title}</h2>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">{lesson.summary}</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                <span className="text-xs text-slate-400">
                  {lesson.questionCount} {lesson.questionCount === 1 ? "question" : "questions"}
                </span>

                <Link
                  to={`/lessons/${lesson.id}/quiz`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 transition"
                >
                  <span>Start Quiz</span>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

