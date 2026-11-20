import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { DifficultyLevel, type LessonSummary } from "../../domain";
import LessonCard from "../../components/Card/LessonCard";

const DIFFICULTY_TABS = [
  { label: "All Difficulties", value: "all" },
  { label: "Beginner", value: DifficultyLevel.Beginner },
  { label: "Intermediate", value: DifficultyLevel.Intermediate },
  { label: "Advanced", value: DifficultyLevel.Advanced },
];

export default function LessonsPage() {
  const lessons = useLoaderData() as LessonSummary[];
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | number>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const sortedLessons = [...(lessons || [])].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  const filteredLessons = sortedLessons.filter((lesson) => {
    const matchesDifficulty =
      selectedDifficulty === "all" || lesson.difficulty === selectedDifficulty;
    const matchesSearch =
      searchQuery.trim() === "" ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.summary.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDifficulty && matchesSearch;
  });

  const completedCount = sortedLessons.filter((l) => l.isCompleted).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Java Curriculum
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Java lessons adapted to your selected learning style.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 text-xs text-slate-300 font-medium">
            <strong className="text-emerald-400 font-bold">{completedCount}</strong> of{" "}
            <strong className="text-white">{sortedLessons.length}</strong> Completed
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Difficulty Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {DIFFICULTY_TABS.map((tab) => {
            const isActive = selectedDifficulty === tab.value;
            return (
              <button
                key={String(tab.value)}
                type="button"
                onClick={() => setSelectedDifficulty(tab.value)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search topics, syntax, concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2 text-xs text-slate-500 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid of Lessons */}
      {filteredLessons.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          <p className="text-base font-semibold text-slate-300">No lessons match your filter.</p>
          <p className="text-xs text-slate-500 mt-1">Try selecting a different difficulty or clearing your search term.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedDifficulty("all");
              setSearchQuery("");
            }}
            className="mt-4 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
}

