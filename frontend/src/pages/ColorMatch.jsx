import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

// Same deep-to-light skin-tone ramp used on the Define Your Silhouette step,
// offered here as quick-pick swatches; the native color input next to them
// covers anything finer than the 7 presets.
const SKIN_TONES = [
  "#3B2419",
  "#5C3324",
  "#7D4B32",
  "#A56B44",
  "#C68958",
  "#E0AC7E",
  "#F2D5B5",
];

const UNDERTONES = [
  { value: "WARM", label: "Warm" },
  { value: "COOL", label: "Cool" },
  { value: "NEUTRAL", label: "Neutral" },
];

function titleCase(value) {
  if (!value) return "";
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function ColorMatch() {
  const [skinToneHex, setSkinToneHex] = useState("#C68958");
  const [undertone, setUndertone] = useState("WARM");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get("/colormatch/history")
      .then((response) => {
        if (!cancelled) setHistory(response.data);
      })
      .catch(() => {
        // History is a nice-to-have on this page — a failed fetch shouldn't block the form.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Selections change the live preview swatch immediately; a previously
  // computed result is stale the moment either input changes again, so we
  // clear it rather than leave a mismatched season on screen.
  function handleSkinTone(hex) {
    setSkinToneHex(hex);
    setResult(null);
  }

  function handleUndertone(value) {
    setUndertone(value);
    setResult(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await apiClient.post("/colormatch/analyze", { skinToneHex, undertone });
      setResult(response.data);
      setHistory((current) => [
        { id: `pending-${Date.now()}`, skinToneHex, undertone, season: response.data.season, createdAt: new Date().toISOString() },
        ...current,
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fitting-page">
      <div className="fitting-intro">
        <span className="wizard-section-label">Color Match</span>
        <h1 className="fitting-headline">Find your most flattering palette.</h1>
        <p className="wizard-subtext">
          Pick your skin tone and undertone — we'll match you to a season and
          the colors that actually work with it.
        </p>
      </div>

      <div className="fitting-layout">
        <form className="fitting-controls" onSubmit={handleSubmit}>
          <section className="fitting-section">
            <div className="wizard-section-header">
              <span className="wizard-section-label">Skin Tone</span>
              <span className="wizard-section-rule" />
            </div>
            <div className="skintone-row" role="radiogroup" aria-label="Skin tone">
              {SKIN_TONES.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  role="radio"
                  aria-checked={skinToneHex.toLowerCase() === hex.toLowerCase()}
                  aria-label={`Skin tone ${hex}`}
                  className={`skintone-swatch${skinToneHex.toLowerCase() === hex.toLowerCase() ? " is-selected" : ""}`}
                  style={{ background: hex }}
                  onClick={() => handleSkinTone(hex)}
                />
              ))}
              <label className="colormatch-custom-swatch" title="Pick a custom color">
                <input
                  type="color"
                  value={skinToneHex}
                  onChange={(e) => handleSkinTone(e.target.value)}
                  aria-label="Custom skin tone"
                />
              </label>
            </div>
          </section>

          <section className="fitting-section">
            <div className="wizard-section-header">
              <span className="wizard-section-label">Undertone</span>
              <span className="wizard-section-rule" />
            </div>
            <div className="modifier-row" role="radiogroup" aria-label="Undertone">
              {UNDERTONES.map((u) => (
                <button
                  key={u.value}
                  type="button"
                  role="radio"
                  aria-checked={undertone === u.value}
                  className={`modifier-pill${undertone === u.value ? " is-active" : ""}`}
                  onClick={() => handleUndertone(u.value)}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </section>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn-accent colormatch-submit" disabled={loading}>
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </form>

        <div className="fitting-stage-col">
          <div className="fitting-stage colormatch-stage">
            {result ? (
              <div className="colormatch-stage-result">
                <span className="wizard-field-label">Your Season</span>
                <h2 className="colormatch-season">{titleCase(result.season)}</h2>

                <div className="colormatch-chip-block">
                  <span className="wizard-field-label">Recommended</span>
                  <div className="colormatch-chip-row">
                    {result.recommendedColors.map((color) => (
                      <span key={color} className="colormatch-chip" style={{ background: color }} title={color} />
                    ))}
                  </div>
                </div>

                <div className="colormatch-chip-block">
                  <span className="wizard-field-label">Avoid</span>
                  <div className="colormatch-chip-row">
                    {result.colorsToAvoid.map((color) => (
                      <span
                        key={color}
                        className="colormatch-chip colormatch-chip--muted"
                        style={{ background: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="colormatch-stage-preview">
                <span className="colormatch-preview-swatch" style={{ background: skinToneHex }} aria-hidden="true" />
                <span className="wizard-field-label">{titleCase(undertone)} Undertone</span>
                <p className="colormatch-preview-hint">
                  Select your tone and undertone, then hit Analyze to see your
                  season and palette.
                </p>
              </div>
            )}
          </div>
          <div className="fitting-stage-caption">
            {result ? "Change a selection to analyze again" : "Live preview"}
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <section className="fitting-section colormatch-history">
          <div className="wizard-section-header">
            <span className="wizard-section-label">History</span>
            <span className="wizard-section-rule" />
          </div>
          <ul className="colormatch-history-list">
            {history.map((h) => (
              <li key={h.id} className="colormatch-history-row">
                <span className="colormatch-history-swatch" style={{ background: h.skinToneHex }} aria-hidden="true" />
                <span className="colormatch-history-season">{titleCase(h.season)}</span>
                <span className="colormatch-history-meta">
                  {titleCase(h.undertone)} · {formatDate(h.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
