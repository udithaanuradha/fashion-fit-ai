import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
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
    <Link to={to} className={`nav-link${isActive ? " nav-link--active" : ""}`}>
      {children}
    </Link>
  );
}

function NavBar() {
  const authed = isAuthenticated();

  function handleLogout() {
    clearToken();
    window.location.assign("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark" aria-hidden="true" />
        Fashion Fit AI
      </Link>
      <div className="nav-links">
        <NavLink to="/colormatch">Color Match</NavLink>
        <NavLink to="/fittingroom">Fitting Room</NavLink>
        {authed ? (
          <button className="nav-logout-btn" onClick={handleLogout}>Log out</button>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/register">Sign up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

// Login, Register, and the onboarding wizard steps are full-viewport, self-contained
// screens (their own header/branding and navigation) — the site-wide nav bar doesn't
// belong on top of them.
const NAVLESS_ROUTES = ["/login", "/register", "/onboarding/silhouette"];

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
