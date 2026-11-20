import { useRouteError, Link } from "react-router-dom";

export default function RouteErrorBoundary() {
  const error = useRouteError();
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "An unexpected error occurred while loading this page.";

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-red-950/20 p-8 backdrop-blur-xl shadow-xl">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-2xl text-red-400">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-white">Something Went Wrong</h2>
        <p className="mt-2 text-xs text-red-300 leading-relaxed">{errorMessage}</p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition cursor-pointer"
          >
            Retry Page
          </button>
          <Link
            to="/"
            className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400 transition"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

