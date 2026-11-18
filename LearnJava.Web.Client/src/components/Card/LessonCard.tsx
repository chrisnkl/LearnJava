import { Link } from "react-router-dom";
import { DifficultyLevel, type LessonSummary } from "../../domain";

interface LessonCardProps {
    lesson: LessonSummary;
}

// Maps DifficultyLevel enum (0-4) to readable label and badge color styles
const DIFFICULTY_CONFIG: Record<
    DifficultyLevel,
    { label: string; badge: string }
> = {
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

export default function LessonCard({ lesson }: LessonCardProps) {
    const difficulty =
        DIFFICULTY_CONFIG[lesson.difficulty] ?? DIFFICULTY_CONFIG[DifficultyLevel.Beginner];

    const formattedOrder = String(lesson.orderIndex + 1).padStart(2, "0");

    return (
        <Link
            to={`/lessons/${lesson.id}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-amber-500/5"
        >
            <div className="pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full bg-amber-500/0 blur-2xl transition-all duration-300 group-hover:bg-amber-500/10" />

            <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-500 group-hover:text-amber-400 transition-colors">
                            #{formattedOrder}
                        </span>
                        <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${difficulty.badge}`}
                        >
                            {difficulty.label}
                        </span>
                    </div>

                    {lesson.isCompleted ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                            <svg
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Completed
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full border border-slate-700/60 bg-slate-800/40 px-2 py-0.5 text-[11px] font-medium text-slate-400">
                            Available
                        </span>
                    )}
                </div>

                <h2 className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-amber-400">
                    {lesson.title}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-400 line-clamp-3">
                    {lesson.summary}
                </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <svg
                        className="h-4 w-4 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <span>{lesson.questionCount} {lesson.questionCount === 1 ? "question" : "questions"}</span>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 transition-transform group-hover:translate-x-1">
                    {lesson.isCompleted ? "Review" : "Start"}
                    <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </span>
            </div>
        </Link>
    );
}