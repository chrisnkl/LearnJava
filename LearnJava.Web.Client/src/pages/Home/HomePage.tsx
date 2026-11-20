import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import {
  StudentStereotype,
  LearningStyle,
  type LessonSummary,
  type StudentProfileResponse,
  type QuizAttempt,
} from "../../domain";
import { StudentService } from "../../services";

const STEREOTYPE_CHIPS: Record<
  StudentStereotype,
  { label: string; badge: string; desc: string; nextGoal: string }
> = {
  [StudentStereotype.Beginner]: {
    label: "Beginner",
    badge: "border-green-500/40 bg-green-500/15 text-green-500",
    desc: "Learning core Java syntax, memory basics, and object-oriented fundamentals.",
    nextGoal: "Score ≥ 50% across 4 questions to advance to Intermediate.",
  },
  [StudentStereotype.Intermediate]: {
    label: "Intermediate",
    badge: "border-orange-500/40 bg-orange-500/15 text-orange-500",
    desc: "Grasping syntax, memory allocation rules, and OOP principles.",
    nextGoal: "Reach 75% accuracy, 10 questions answered, and 2 lessons completed for Advanced.",
  },
  [StudentStereotype.Advanced]: {
    label: "Advanced",
    badge: "border-red-500/40 bg-red-500/15 text-red-500",
    desc: "Comfortable with polymorphism, heap management, and common Java pitfalls.",
    nextGoal: "Reach 90% accuracy, 15 questions answered, streak of 5+, and 3 lessons for Professional.",
  },
  [StudentStereotype.Professional]: {
    label: "Professional",
    badge: "border-sky-500/40 bg-sky-500/20 text-sky-300",
    desc: "Strong command of Java memory management, OOP design, and edge cases.",
    nextGoal: "Maximum pedagogical mastery achieved!",
  },
};

const STYLE_NAMES: Record<LearningStyle, string> = {
  [LearningStyle.Visual]: "🎨 Visual Mode",
  [LearningStyle.Practical]: "💻 Practical Mode",
  [LearningStyle.Conceptual]: "📖 Conceptual Mode",
  [LearningStyle.Auditory]: "🎧 Auditory Mode",
};

export default function HomePage() {
  const lessons = useLoaderData() as LessonSummary[];
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      StudentService.getProfile(),
      StudentService.getQuizHistory(3).catch(() => []),
    ])
      .then(([profData, histData]) => {
        if (!ignore) {
          setProfile(profData);
          setRecentAttempts(histData);
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  const sortedLessons = [...(lessons || [])].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  const completedCount = sortedLessons.filter((l) => l.isCompleted).length;
  const progressPct =
    sortedLessons.length === 0
      ? 0
      : Math.round((completedCount / sortedLessons.length) * 100);

  // Next lesson to continue
  const nextLesson =
    sortedLessons.find((l) => !l.isCompleted) ?? sortedLessons[0];

  const stereoChip = profile
    ? STEREOTYPE_CHIPS[profile.currentStereotype] ?? STEREOTYPE_CHIPS[StudentStereotype.Beginner]
    : null;

  const displayName = profile?.firstName?.trim()
    ? profile.firstName
    : profile?.email
    ? profile.email.split("@")[0]
    : "Learner";

  return (
    <div className="space-y-8">
      {/* 1. Dashboard Welcome & Identity Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 mb-1">
              <span>Personal Learning Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {displayName}!
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Your personalized Java tutoring hub powered by stereotype user modeling and misconception diagnosis.
            </p>
          </div>

          {profile && stereoChip && (
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <span className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-bold uppercase tracking-wider ${stereoChip.badge}`}>
                {stereoChip.label} Tier
              </span>
              <Link
                to="/analytics"
                className="inline-flex items-center rounded-lg border border-slate-700/60 bg-slate-800/60 px-3 py-1 text-xs font-semibold text-slate-200 hover:text-white transition"
              >
                {STYLE_NAMES[profile.preferredLearningStyle] || "Visual Mode"}
              </Link>
              <span className="inline-flex items-center rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-400">
                {profile.currentStreak} 🔥 Streak
              </span>
            </div>
          )}
        </div>

        {/* Milestone Goal */}
        {stereoChip && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-300">
            <span className="text-sky-400">🎯</span>
            <span>
              <strong>Tier Milestone:</strong> {stereoChip.nextGoal}
            </span>
          </div>
        )}
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completed Lessons */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Curriculum Progress</span>
            <span className="text-emerald-400 font-bold">{progressPct}%</span>
          </div>
          <div className="text-2xl font-black text-white mb-2">
            {completedCount} <span className="text-sm font-normal text-slate-500">/ {sortedLessons.length}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Accuracy */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="text-xs text-slate-400 mb-2">Lifetime Accuracy</div>
          <div className="text-2xl font-black text-white">
            {profile ? profile.accuracyPercentage.toFixed(0) : "0"}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {profile ? profile.totalQuestionsCorrect : 0} of {profile ? profile.totalQuestionsAnswered : 0} questions correct
          </p>
        </div>

        {/* Streak */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="text-xs text-slate-400 mb-2">Study Streak</div>
          <div className="text-2xl font-black text-sky-400 flex items-center gap-1">
            {profile ? profile.currentStreak : 0} <span className="text-lg">🔥</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Highest: {profile ? profile.highestStreak : 0} continuous assessments
          </p>
        </div>

        {/* Active Misconceptions */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="text-xs text-slate-400 mb-2">Misconceptions</div>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            {profile && profile.activeMisconceptions.length > 0 ? (
              <span className="text-rose-400">{profile.activeMisconceptions.length} Buggy Rules</span>
            ) : (
              <span className="text-emerald-400">All clear ✓</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {profile && profile.activeMisconceptions.length > 0
              ? "Remediation recommended"
              : "No active misconceptions"}
          </p>
        </div>
      </div>

      {/* 3. Continue Learning Spotlight + Targeted Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Lesson Spotlight */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="font-mono text-xs font-semibold text-sky-400">
                Continue Your Learning Path
              </span>
              {nextLesson && (
                <span className="font-mono text-xs text-slate-500">
                  Lesson #{String(nextLesson.orderIndex).padStart(2, "0")}
                </span>
              )}
            </div>

            {nextLesson ? (
              <>
                <h2 className="text-xl font-bold text-white mb-2">{nextLesson.title}</h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {nextLesson.summary}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-400 mb-6">You have completed all authored curriculum lessons!</p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            {nextLesson && (
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{nextLesson.questionCount} diagnostic questions</span>
              </div>
            )}

            {nextLesson && (
              <Link
                to={`/lessons/${nextLesson.id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-500/20 hover:from-sky-500 hover:to-sky-400 transition"
              >
                <span>{nextLesson.isCompleted ? "Review Lesson" : "Start Next Lesson"}</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Targeted Recommendation Callout (ADR-002) */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-sky-400">
              <span className="text-lg">💡</span>
              <h3 className="text-sm font-bold text-white">Targeted Remediation</h3>
            </div>

            {profile && profile.activeRecommendations.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  The inference engine detected mistakes linked to:
                </p>
                <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3.5">
                  <p className="text-xs font-bold text-white">
                    {profile.activeRecommendations[0].lessonTitle}
                  </p>
                  <p className="text-[11px] text-sky-200 mt-1 leading-relaxed">
                    {profile.activeRecommendations[0].reason}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 text-xs text-slate-400 leading-relaxed">
                No active misconceptions detected. Keep practicing quizzes to identify any subtle conceptual blind spots!
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4">
            {profile && profile.activeRecommendations.length > 0 ? (
              <Link
                to={`/lessons/${profile.activeRecommendations[0].targetLessonId}`}
                className="text-xs font-bold text-sky-400 hover:text-white transition flex items-center gap-1"
              >
                Resolve Misconceptions Now →
              </Link>
            ) : (
              <Link
                to="/quizzes"
                className="text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1"
              >
                Browse All Quizzes →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 4. Recent Diagnostic Assessments + Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Attempts */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Recent Assessment Activity</h3>
            <Link to="/analytics" className="text-xs text-sky-400 hover:underline">
              View Full History →
            </Link>
          </div>

          {recentAttempts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No recent quiz activity. Take your first quiz to see performance metrics here.
            </p>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {recentAttempts.map((att, i) => (
                <div key={i} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-white">{att.lessonTitle}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(att.attemptedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-300">
                      {att.score} / {att.total} ({att.accuracyPercentage.toFixed(0)}%)
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        att.isPassed
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                      }`}
                    >
                      {att.isPassed ? "Passed" : "Review"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links Card */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-3">Quick Navigation</h3>
            <div className="space-y-2">
              <Link
                to="/lessons"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900 transition text-xs font-semibold text-white"
              >
                <span>📚 Explore All Lessons</span>
                <span className="text-slate-500">→</span>
              </Link>
              <Link
                to="/quizzes"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900 transition text-xs font-semibold text-white"
              >
                <span>🎯 Diagnostic Quizzes</span>
                <span className="text-slate-500">→</span>
              </Link>
              <Link
                to="/analytics"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900 transition text-xs font-semibold text-white"
              >
                <span>📊 Progress & Learning Style</span>
                <span className="text-slate-500">→</span>
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 mt-4">
            Curriculum auto-adapts dynamically based on continuous formative evaluation.
          </div>
        </div>
      </div>
    </div>
  );
}
