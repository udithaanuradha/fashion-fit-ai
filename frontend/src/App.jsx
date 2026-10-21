import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated, clearToken } from "./api/client";
import Auth from "./pages/Auth";
import ColorMatch from "./pages/ColorMatch";
import FittingRoom from "./pages/FittingRoom";
import DefineSilhouette from "./pages/DefineSilhouette";
import NotFound from "./pages/NotFound";
import "./App.css";

function ProtectedRoute({ children }) {
  const authed = isAuthenticated();
  if (!authed && import.meta.env.DEV) {
    // Dev-only breadcrumb: makes it obvious in the console *why* a protected
    // route bounced to /login (missing/cleared token) instead of it looking
    // like the destination page itself is broken.
    console.warn(
      `[ProtectedRoute] No auth token in localStorage ("ffa_token") — redirecting ${window.location.pathname} to /login.`
    );
  }
  return authed ? children : <Navigate to="/login" replace />;
}

// There's no standalone landing page — "/" just routes straight into the app:
// signed-in users land on Color Match, signed-out users are sent to log in.
function RootRedirect() {
  return <Navigate to={isAuthenticated() ? "/colormatch" : "/login"} replace />;
}

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`nav-link ${isActive ? "nav-link--active" : ""}`}
    >
      {children}
    </Link>
  );
}

function NavBar() {
  const authed = isAuthenticated();
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return (
      document.documentElement.getAttribute("data-theme") === "dark" ||
      document.documentElement.classList.contains("dark")
    );
  });

  useEffect(() => {
    function handleThemeChange(e) {
      setIsDark(e.detail === "dark");
    }
    window.addEventListener("themechange", handleThemeChange);
    return () => window.removeEventListener("themechange", handleThemeChange);
  }, []);

  function handleLogout() {
    clearToken();
    window.location.assign("/login");
  }

  function toggleTheme() {
    const nextDark = !isDark;
    setIsDark(nextDark);
    const themeName = nextDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", themeName);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", themeName);
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent("themechange", { detail: themeName }));
  }

  return (
    <header className="navbar">
      <div className="flex items-center gap-3">
        <Link to="/" className="brand" aria-label="Fashion Fit AI Home">
          <span className="brand-mark" aria-hidden="true" />
          <span className="tracking-tight text-lg font-serif font-bold">Fashion Fit AI</span>
          <span className="hidden sm:inline-block text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 rounded border border-[var(--border)] text-[var(--text-muted)]">
            Atelier
          </span>
        </Link>
      </div>

      <nav className="nav-links" aria-label="Main Navigation">
        <NavLink to="/colormatch">Color Match</NavLink>
        <NavLink to="/fittingroom">Virtual Fitting Room</NavLink>
        <NavLink to="/onboarding/silhouette">Silhouette Studio</NavLink>
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="theme-toggle-inline p-2 rounded-full border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] hover:border-[var(--accent)] transition-all cursor-pointer shadow-sm"
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        >
          {isDark ? (
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-[var(--text)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          )}
        </button>

        {authed ? (
          <button className="nav-logout-btn" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-xs uppercase tracking-wider font-semibold px-3 py-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs uppercase tracking-wider font-bold px-4 py-2 rounded-full bg-[var(--accent-gradient)] text-[var(--accent-text)] shadow-sm hover:opacity-90 transition-opacity"
            >
              Join Atelier
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

// Login, Register, and the onboarding wizard steps are full-viewport, self-contained
// screens (their own header/branding and navigation) — the site-wide nav bar doesn't
// belong on top of them.
const NAVLESS_ROUTES = ["/login", "/register"];

function Shell() {
  const location = useLocation();
  const showNavBar = !NAVLESS_ROUTES.includes(location.pathname);

  return (
    <>
      {showNavBar && <NavBar />}
      <main className={showNavBar ? "app-content" : undefined}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route
            path="/colormatch"
            element={
              <ProtectedRoute>
                <ColorMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fittingroom"
            element={
              <ProtectedRoute>
                <FittingRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/silhouette"
            element={
              <ProtectedRoute>
                <DefineSilhouette />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
