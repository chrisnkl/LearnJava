import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LearningStyle,
  StudentStereotype,
  type QuizAttempt,
  type StudentProfileResponse,
} from "../../domain";
import { StudentService } from "../../services";
import Spinner from "../../components/Spinner/Spinner";

const STEREOTYPE_DATA: Record<
  StudentStereotype,
  { label: string; badge: string; desc: string; nextCriteria: string }
> = {
  [StudentStereotype.Beginner]: {
    label: "Beginner",
    badge: "border-slate-600 bg-slate-800 text-slate-300",
    desc: "Learning core Java syntax, memory basics, and object-oriented fundamentals.",
    nextCriteria: "Reach 50% accuracy across at least 4 questions to advance to Intermediate.",
  },
  [StudentStereotype.Intermediate]: {
    label: "Intermediate",
    badge: "border-sky-500/40 bg-sky-500/15 text-sky-300",
    desc: "Developing strong grasp of syntax, OOP basics, and primitive/reference memory rules.",
    nextCriteria: "Reach 75% accuracy, 10 questions answered, and 2 completed lessons to advance to Advanced.",
  },
  [StudentStereotype.Advanced]: {
    label: "Advanced",
    badge: "border-violet-500/40 bg-violet-500/15 text-violet-300",
    desc: "Comfortable with polymorphism, heap management, and common Java pitfalls.",
    nextCriteria: "Reach 90% accuracy, 15 questions answered, streak of 5+, and 3 lessons completed for Professional.",
  },
  [StudentStereotype.Professional]: {
    label: "Professional",
    badge: "border-amber-500/40 bg-amber-500/20 text-amber-300",
    desc: "Strong command of Java memory management, OOP design, and edge cases.",
    nextCriteria: "Maximum pedagogical mastery achieved!",
  },
};

const STYLE_OPTIONS: { style: LearningStyle; label: string; icon: string; desc: string }[] = [
  {
    style: LearningStyle.Visual,
    label: "Visual Learner",
    icon: "🎨",
    desc: "Stack & heap memory diagrams, ASCII layouts, and architectural flowcharts",
  },
  {
    style: LearningStyle.Practical,
    label: "Practical Learner",
    icon: "💻",
    desc: "Hands-on runnable code snippets, live debugging experiments, and recipes",
  },
  {
    style: LearningStyle.Conceptual,
    label: "Conceptual Learner",
    icon: "📖",
    desc: "Theoretical foundations, computer science analogies, and design principles",
  },
  {
    style: LearningStyle.Auditory,
    label: "Auditory Learner",
    icon: "🎧",
    desc: "Spoken explanations, audio narration, and verbal discussion of principles",
  },
];

export default function AnalyticsPage() {
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Profile Edit State
  const [isEditingName, setIsEditingName] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Questionnaire Modal State
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [qAnswers, setQAnswers] = useState<Record<number, LearningStyle>>({});

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const [profData, histData] = await Promise.all([
          StudentService.getProfile(),
          StudentService.getQuizHistory(15).catch(() => []),
        ]);

        if (!ignore) {
          setProfile(profData);
          setHistory(histData);
          setFirstName(profData.firstName || "");
          setLastName(profData.lastName || "");
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load profile.");
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

  const handleUpdateStyle = async (newStyle: LearningStyle) => {
    if (!profile || profile.preferredLearningStyle === newStyle) return;

    try {
      setIsUpdating(true);
      await StudentService.updatePreferences({
        preferredLearningStyle: newStyle,
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
      setProfile((prev) => (prev ? { ...prev, preferredLearningStyle: newStyle } : null));
      setSuccessMsg("Learning style preference saved! Future lessons will adapt automatically.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch {
      alert("Failed to update learning preferences.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setIsUpdating(true);
      await StudentService.updatePreferences({
        preferredLearningStyle: profile.preferredLearningStyle,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      setProfile((prev) =>
        prev
          ? {
            ...prev,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          }
          : null
      );
      setIsEditingName(false);
      setSuccessMsg("Profile name updated successfully.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      alert("Failed to update profile name.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCompleteQuestionnaire = async () => {
    // Count style frequencies
    const counts: Record<number, number> = {
      [LearningStyle.Visual]: 0,
      [LearningStyle.Practical]: 0,
      [LearningStyle.Conceptual]: 0,
      [LearningStyle.Auditory]: 0,
    };

    Object.values(qAnswers).forEach((style) => {
      counts[style] = (counts[style] || 0) + 1;
    });

    let bestStyle: LearningStyle = LearningStyle.Visual;
    let maxVotes = -1;
    for (const [s, cnt] of Object.entries(counts)) {
      if (cnt > maxVotes) {
        maxVotes = cnt;
        bestStyle = Number(s) as LearningStyle;
      }
    }

    await handleUpdateStyle(bestStyle);
    setShowQuestionnaire(false);
    setQAnswers({});
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-2xl border border-red-800 bg-red-950/20 p-8 text-center text-red-300">
        <h2 className="text-xl font-bold">Error</h2>
        <p className="mt-2 text-sm text-red-400">{error || "Could not retrieve profile."}</p>
      </div>
    );
  }

  const stereoInfo =
    STEREOTYPE_DATA[profile.currentStereotype] ?? STEREOTYPE_DATA[StudentStereotype.Beginner];

  const displayName = profile.firstName?.trim()
    ? `${profile.firstName} ${profile.lastName}`
    : profile.email.split("@")[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner: Student Identity & Stereotype */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {displayName}
              </h1>
              <span className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-bold uppercase tracking-wider ${stereoInfo.badge}`}>
                {stereoInfo.label}
              </span>
              <button
                type="button"
                onClick={() => setIsEditingName(!isEditingName)}
                className="text-xs text-slate-400 hover:text-amber-400 underline transition cursor-pointer"
              >
                {isEditingName ? "Cancel" : "Edit Name"}
              </button>
            </div>
            <p className="text-xs text-slate-400 font-mono">{profile.email}</p>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">{stereoInfo.desc}</p>

            {isEditingName && (
              <form onSubmit={handleSaveName} className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition cursor-pointer"
                >
                  Save
                </button>
              </form>
            )}
          </div>

          <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
            <div className="flex items-center justify-center gap-5">
              <div className="text-center">
                <span className="block text-xl font-black text-amber-400">
                  {profile.currentStreak} 🔥
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase">
                  Streak
                </span>
              </div>

              <div className="h-8 w-px bg-slate-700" />

              <div className="text-center">
                <span className="block text-xl font-black text-orange-400">
                  {profile.highestStreak} 🏆
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase">
                  Best Streak
                </span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <span className="block text-xl font-black text-white">{profile.accuracyPercentage.toFixed(0)}%</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Accuracy</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <span className="block text-xl font-black text-emerald-400">{profile.totalLessonsCompleted}</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Mastered</span>
            </div>
          </div>
        </div>

        {/* Next Tier Progression Criteria */}
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 text-xs text-slate-300 flex items-center gap-2">
          <span className="text-amber-400">🎯</span>
          <span>
            <strong>Progression Goal: </strong>
            {stereoInfo.nextCriteria}
          </span>
        </div>
      </div>

      {/* Adaptive Learning Style Preferences */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Learning Style Preference</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose your preferred learning style or take the short questionnaire to set it automatically.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowQuestionnaire(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition cursor-pointer"
          >
            <span>📝</span>
            <span>Take Learning Style Questionnaire</span>
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STYLE_OPTIONS.map((opt) => {
            const isSelected = profile.preferredLearningStyle === opt.style;
            return (
              <button
                key={opt.style}
                type="button"
                onClick={() => handleUpdateStyle(opt.style)}
                disabled={isUpdating}
                className={`relative flex flex-col justify-between rounded-xl border p-5 text-left transition cursor-pointer ${isSelected
                  ? "border-amber-500/80 bg-amber-500/10 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/40"
                  : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900"
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{opt.icon}</span>
                    {isSelected && (
                      <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        Active
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white">{opt.label}</h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">{opt.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 text-right">
                  <span
                    className={`text-xs font-semibold ${isSelected ? "text-amber-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                  >
                    {isSelected ? "Selected ✓" : "Activate"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Performance History (Ιστορικό Απόδοσης) */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Assessment Performance History</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical progression and accuracy across diagnostic quizzes.
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {history.length} Attempts
          </span>
        </div>

        {history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-xs text-slate-400">
            No quiz attempts recorded yet. Complete diagnostic quizzes to build your historical performance timeline.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Lesson</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((att, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {new Date(att.attemptedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">{att.lessonTitle}</td>
                    <td className="py-3 px-4 font-mono">
                      {att.score} / {att.total}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${att.isPassed ? "bg-emerald-400" : "bg-amber-400"
                              }`}
                            style={{ width: `${att.accuracyPercentage}%` }}
                          />
                        </div>
                        <span className="font-mono">{att.accuracyPercentage.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{att.durationSeconds}s</td>
                    <td className="py-3 px-4 text-right">
                      {att.isPassed ? (
                        <span className="inline-flex rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          Passed
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                          Needs Review
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Misconception Diagnosis Tracker (ADR-002: Buggy Rules) */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Diagnosed Misconceptions (Buggy Rules)</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cumulative log of misconceptions detected by distractor mapping across your quiz assessments.
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {profile.activeMisconceptions.length} Recorded
          </span>
        </div>

        {profile.activeMisconceptions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-xs text-slate-400">
            No misconceptions recorded yet. Complete a quiz to see any topics that need review.
          </div>
        ) : (
          <div className="space-y-3">
            {profile.activeMisconceptions.map((misc) => (
              <div
                key={misc.misconceptionId}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-slate-700"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700/60">
                      {misc.code}
                    </span>
                    <h3 className="text-sm font-bold text-white">{misc.title}</h3>
                  </div>

                  {misc.isResolved ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      ✓ Resolved (Mastered)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-300">
                      ⚠️ Active Bug ({misc.occurrenceCount} {misc.occurrenceCount === 1 ? "trigger" : "triggers"})
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                  <strong className="text-rose-300">Misconception: </strong>
                  {misc.explanation}
                </p>

                <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5 text-xs text-slate-300">
                  <strong className="text-emerald-400">Pedagogical Advice: </strong>
                  {misc.correctiveAdvice}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Personalized Recommendations */}
      {profile.activeRecommendations.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💡</span>
            <h2 className="text-lg font-bold text-amber-300">Pedagogical Recommendations</h2>
          </div>
          <p className="text-xs text-slate-300 mb-4">
            Generated automatically by the inference engine to remediate identified knowledge gaps:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.activeRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="flex flex-col justify-between rounded-xl border border-amber-500/20 bg-slate-900/80 p-4"
              >
                <div>
                  <h3 className="text-sm font-bold text-white">{rec.lessonTitle}</h3>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">{rec.reason}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <Link
                    to={`/lessons/${rec.targetLessonId}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
                  >
                    Start Remediation Lesson →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questionnaire Modal (Ερωτηματολόγιο) */}
      {showQuestionnaire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Learning Style Questionnaire</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Answer 3 quick questions to diagnose your ideal learning mode.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowQuestionnaire(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Question 1 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <p className="text-xs font-semibold text-white">
                  1. When learning a new programming concept (like stack vs heap memory), what helps you understand best?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "Memory diagrams and flowcharts", s: LearningStyle.Visual },
                    { label: "Writing and modifying runnable code", s: LearningStyle.Practical },
                    { label: "Theoretical principles and analogies", s: LearningStyle.Conceptual },
                    { label: "Listening to a spoken walkthrough", s: LearningStyle.Auditory },
                  ].map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setQAnswers((prev) => ({ ...prev, 1: opt.s }))}
                      className={`p-2 rounded-lg border text-left transition cursor-pointer ${qAnswers[1] === opt.s
                        ? "border-amber-500 bg-amber-500/15 text-white font-medium"
                        : "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <p className="text-xs font-semibold text-white">
                  2. When debugging an unexpected result in Java:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "I draw out the variable references", s: LearningStyle.Visual },
                    { label: "I test breakpoints and println statements", s: LearningStyle.Practical },
                    { label: "I re-read the language specification", s: LearningStyle.Conceptual },
                    { label: "I talk through the problem out loud (rubber duck)", s: LearningStyle.Auditory },
                  ].map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setQAnswers((prev) => ({ ...prev, 2: opt.s }))}
                      className={`p-2 rounded-lg border text-left transition cursor-pointer ${qAnswers[2] === opt.s
                        ? "border-amber-500 bg-amber-500/15 text-white font-medium"
                        : "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <p className="text-xs font-semibold text-white">
                  3. What educational resource do you naturally gravitate to?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "Visual cheat-sheets and diagrams", s: LearningStyle.Visual },
                    { label: "Hands-on coding katas and labs", s: LearningStyle.Practical },
                    { label: "Structured textbooks and articles", s: LearningStyle.Conceptual },
                    { label: "Audio lectures and technical podcasts", s: LearningStyle.Auditory },
                  ].map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setQAnswers((prev) => ({ ...prev, 3: opt.s }))}
                      className={`p-2 rounded-lg border text-left transition cursor-pointer ${qAnswers[3] === opt.s
                        ? "border-amber-500 bg-amber-500/15 text-white font-medium"
                        : "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowQuestionnaire(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteQuestionnaire}
                disabled={Object.keys(qAnswers).length < 3}
                className="px-5 py-2 rounded-xl bg-amber-500 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Apply Recommended Style
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
