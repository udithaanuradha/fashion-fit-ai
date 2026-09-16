import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiClient, setToken } from "../api/client";
import ThemeToggle from "../components/ThemeToggle";

const APP_NAME = "Fit Muse";

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function EyeIcon({ visible }) {
  if (visible) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
      <path d="M9.9 5.2A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a15.5 15.5 0 0 1-4.2 4.9M6.1 6.1C3.6 7.8 2 12 2 12a15.6 15.6 0 0 0 5 5.6" />
    </svg>
  );
}

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState(location.pathname === "/register" ? "register" : "login");
  const [animating, setAnimating] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register State
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newMode = location.pathname === "/register" ? "register" : "login";
    if (newMode !== mode) {
      triggerTransition(newMode);
    }
  }, [location.pathname]);

  const triggerTransition = (newMode) => {
    setAnimating(true);
    setTimeout(() => {
      setMode(newMode);
      setError(null);
      setAnimating(false);
    }, 250);
  };

  const handleSwitchMode = (e, newMode, path) => {
    e.preventDefault();
    navigate(path);
  };

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/login", { email: loginEmail, password: loginPassword }, { auth: false });
      setToken(response.data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await apiClient.post(
        "/auth/register",
        { fullName: regFullName, email: regEmail, password: regPassword },
        { auth: false }
      );
      setToken(response.data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-viewport auth-viewport--split">
      <ThemeToggle />

      <div className="auth-banner">
        <div className="auth-banner-overlay">
          <h1 className="auth-banner-headline">Made to Fit.</h1>
          <p className="auth-banner-subhead">
            Join {APP_NAME} and get outfit and color guidance built around you.
          </p>
        </div>
      </div>

      <div className="auth-panel">
        <div className={`auth-card auth-transition-container ${animating ? "auth-fade-out" : "auth-fade-in"}`}>
          {mode === "login" ? (
            <div className="auth-form-wrapper">
              <h2 className="auth-card-title">Welcome Back</h2>
              <p className="auth-card-subtext">Log in to your personalized fitting room.</p>
              
              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <div className="field-underline">
                  <label htmlFor="login-email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Email Address"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="field-underline">
                  <label htmlFor="login-password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <div className="auth-forgot">
                  <button type="button" className="auth-link-muted">
                    Forgot Password?
                  </button>
                </div>

                {error && (
                  <p className="auth-error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="btn-accent" disabled={loading}>
                  {loading ? "Logging in…" : "Log In"}
                </button>
              </form>

              <div className="auth-divider">
                <span>Or continue with</span>
              </div>

              <div className="auth-social-row">
                <button type="button" className="auth-social-btn" disabled aria-label="Continue with Google" />
                <button type="button" className="auth-social-btn" disabled aria-label="Continue with Apple" />
                <button type="button" className="auth-social-btn" disabled aria-label="Continue with Facebook" />
              </div>

              <p className="auth-switch">
                Don&apos;t have an account?{" "}
                <a href="/register" onClick={(e) => handleSwitchMode(e, "register", "/register")} className="auth-switch-link">
                  Sign up
                </a>
              </p>
            </div>
          ) : (
            <div className="auth-form-wrapper">
              <h2 className="auth-card-title">Create Account</h2>
              <p className="auth-card-subtext">Step into your personalized fitting room.</p>

              <form className="auth-form" onSubmit={handleRegisterSubmit}>
                <label className="field-underline" htmlFor="register-name">
                  <span className="field-label">Full Name</span>
                  <span className="field-input-row">
                    <input
                      id="register-name"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Full Name"
                      autoComplete="name"
                      required
                    />
                    <span className="field-icon">
                      <PersonIcon />
                    </span>
                  </span>
                </label>

                <label className="field-underline" htmlFor="register-email">
                  <span className="field-label">Email Address</span>
                  <span className="field-input-row">
                    <input
                      id="register-email"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="Email Address"
                      autoComplete="email"
                      required
                    />
                    <span className="field-icon">
                      <EnvelopeIcon />
                    </span>
                  </span>
                </label>

                <label className="field-underline" htmlFor="register-password">
                  <span className="field-label">Password</span>
                  <span className="field-input-row">
                    <input
                      id="register-password"
                      type={showRegPassword ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="field-icon-btn"
                      onClick={() => setShowRegPassword((visible) => !visible)}
                      aria-label={showRegPassword ? "Hide password" : "Show password"}
                      aria-pressed={showRegPassword}
                    >
                      <EyeIcon visible={showRegPassword} />
                    </button>
                  </span>
                </label>

                {error && (
                  <p className="auth-error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="btn-accent" disabled={loading}>
                  {loading ? "Creating account…" : "Create Account"}
                </button>
              </form>

              <div className="auth-divider--plain" />

              <p className="auth-switch">
                Already have an account?{" "}
                <a href="/login" onClick={(e) => handleSwitchMode(e, "login", "/login")} className="auth-switch-link">
                  Log in
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
