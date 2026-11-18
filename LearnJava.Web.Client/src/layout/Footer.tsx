export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        {/* Brand / Tagline */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.5 7.5c1.5 0 2.5 1 2.5 2.5s-1 2.5-2.5 2.5h-1M4 7.5h13.5v6a5 5 0 01-5 5H9a5 5 0 01-5-5v-6zM7 3v2M11 3v2M15 3v2M3 21h17"
              />
            </svg>
          </div>
          <span className="text-xs text-slate-400">
            <strong className="font-semibold text-slate-300">LearnJava</strong> — Adaptive Intelligent Tutoring System
          </span>
        </div>

        {/* Badges / Meta */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-2.5 py-0.5 text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Java SE 21
          </span>
          <span>&copy; {currentYear} LearnJava. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

