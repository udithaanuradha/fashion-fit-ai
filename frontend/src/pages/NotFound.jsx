import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-8 sm:p-12 shadow-[var(--shadow-card)]">
        <div className="w-16 h-16 mx-auto rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,var(--card-bg))] border border-[var(--border)] flex items-center justify-center">
          <span className="font-serif font-bold text-2xl text-[var(--accent)]">404</span>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] font-mono">
            Atelier Archive Notice
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text)]">
            Look Not Found
          </h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            The styling suite, runway silhouette, or seasonal palette you requested does not exist or has been retired.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/colormatch"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--accent-gradient)] text-[var(--accent-text)] shadow-sm hover:opacity-90 transition-opacity"
          >
            Color Match
          </Link>
          <Link
            to="/fittingroom"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] hover:border-[var(--accent)] transition-all"
          >
            Fitting Room
          </Link>
        </div>
      </div>
    </div>
  );
}
