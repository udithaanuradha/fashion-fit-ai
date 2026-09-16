import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

// Step 3 doesn't exist yet — this is a placeholder destination until that
// screen is built. It intentionally isn't registered in App.jsx, so it
// currently falls through to the catch-all NotFound route.
const NEXT_STEP_PATH = "/onboarding/style-preferences";

const GENDERS = [
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
];

const MODIFIERS = ["Petite", "Tall", "Curvy", "Broad Shoulders", "Long Torso"];

// A believable deep-to-light skin-tone ramp.
const SKIN_TONES = [
  "#3B2419",
  "#5C3324",
  "#7D4B32",
  "#A56B44",
  "#C68958",
  "#E0AC7E",
  "#F2D5B5",
];

function BackArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

// Simple line-art body silhouettes — stand-ins for photo assets, one
// distinct outline per body shape. Every path is symmetric around x=40.
function BodySilhouette({ d }) {
  return (
    <svg className="shape-svg" viewBox="0 0 80 170" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <circle cx="40" cy="20" r="11" />
      <path d={d} />
    </svg>
  );
}

const SHAPES = [
  {
    value: "hourglass",
    label: "Hourglass",
    d: "M14,36 L18,55 L28,85 L14,115 L24,140 L30,158 L50,158 L56,140 L66,115 L52,85 L62,55 L66,36 Z",
  },
  {
    value: "pear",
    label: "Pear",
    d: "M22,36 L23,55 L25,85 L13,115 L23,140 L30,158 L50,158 L57,140 L67,115 L55,85 L57,55 L58,36 Z",
  },
  {
    value: "athletic",
    label: "Athletic",
    d: "M15,36 L19,55 L23,85 L20,115 L25,140 L31,158 L49,158 L55,140 L60,115 L57,85 L61,55 L65,36 Z",
  },
  {
    value: "apple",
    label: "Apple",
    d: "M20,36 L17,55 L16,85 L24,115 L27,140 L32,158 L48,158 L53,140 L56,115 L64,85 L63,55 L60,36 Z",
  },
];

export default function DefineSilhouette() {
  const navigate = useNavigate();

  const [gender, setGender] = useState(null);
  const [heightFtIn, setHeightFtIn] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [primaryShape, setPrimaryShape] = useState(null);
  const [modifiers, setModifiers] = useState([]);
  const [skinTone, setSkinTone] = useState(null);

  const canContinue = Boolean(gender && primaryShape);

  function toggleModifier(name) {
    setModifiers((current) =>
      current.includes(name) ? current.filter((m) => m !== name) : [...current, name]
    );
  }

  function handleContinue() {
    if (!canContinue) return;
    console.log("Define Your Silhouette — collected state:", {
      gender,
      heightFtIn,
      weightLbs,
      primaryShape,
      modifiers,
      skinTone,
    });
    navigate(NEXT_STEP_PATH);
  }

  return (
    <div className="wizard-viewport">
      <ThemeToggle />
      <div className="wizard-topbar">
        <div className="wizard-topbar-row">
          <button type="button" className="wizard-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <BackArrowIcon />
          </button>
          <span className="wizard-step-label">Step 2 of 4</span>
        </div>
        <div className="wizard-progress" role="progressbar" aria-valuenow={2} aria-valuemin={0} aria-valuemax={4} aria-label="Onboarding progress">
          <span className="wizard-progress-seg wizard-progress-seg--filled" />
          <span className="wizard-progress-seg wizard-progress-seg--filled" />
          <span className="wizard-progress-seg" />
          <span className="wizard-progress-seg" />
        </div>
      </div>

      <div className="wizard-intro">
        <h1 className="wizard-headline">Define Your Silhouette</h1>
        <p className="wizard-subtext">
          Help us understand your proportions so we can curate garments that
          drape flawlessly on your frame.
        </p>
      </div>

      <div className="wizard-body">
        <section className="wizard-section">
          <div className="wizard-section-header">
            <span className="wizard-section-label">00. Gender</span>
            <span className="wizard-section-rule" />
          </div>
          <div className="option-grid" role="radiogroup" aria-label="Gender">
            {GENDERS.map((g) => (
              <button
                key={g.value}
                type="button"
                role="radio"
                aria-checked={gender === g.value}
                className={`gender-card${gender === g.value ? " is-selected" : ""}`}
                onClick={() => setGender(g.value)}
              >
                <span className="wizard-radio" aria-hidden="true" />
                {g.label}
              </button>
            ))}
          </div>
        </section>

        <section className="wizard-section">
          <div className="wizard-section-header">
            <span className="wizard-section-label">01. Dimensions</span>
            <span className="wizard-section-rule" />
          </div>
          <div className="option-grid">
            <div className="dimension-box">
              <span className="wizard-field-label">Height</span>
              <div className="dimension-value-row">
                <input
                  type="text"
                  className="dimension-input"
                  value={heightFtIn}
                  onChange={(e) => setHeightFtIn(e.target.value)}
                  placeholder="5'7"
                  inputMode="text"
                  aria-label="Height"
                />
                <span className="dimension-unit">ft/in</span>
              </div>
            </div>
            <div className="dimension-box">
              <span className="wizard-field-label">Weight</span>
              <div className="dimension-value-row">
                <input
                  type="number"
                  className="dimension-input"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  placeholder="140"
                  inputMode="numeric"
                  aria-label="Weight"
                />
                <span className="dimension-unit">lbs</span>
              </div>
            </div>
          </div>
        </section>

        <section className="wizard-section">
          <div className="wizard-section-header">
            <span className="wizard-section-label">02. Primary Shape</span>
            <span className="wizard-section-rule" />
          </div>
          <div className="shape-grid" role="radiogroup" aria-label="Primary body shape">
            {SHAPES.map((s) => (
              <button
                key={s.value}
                type="button"
                role="radio"
                aria-checked={primaryShape === s.value}
                className={`shape-card${primaryShape === s.value ? " is-selected" : ""}`}
                onClick={() => setPrimaryShape(s.value)}
              >
                <span className="shape-card-image">
                  <span className="wizard-radio" aria-hidden="true" />
                  <BodySilhouette d={s.d} />
                </span>
                <span className="shape-card-label">{s.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="wizard-section">
          <div className="wizard-section-header">
            <span className="wizard-section-label">03. Structural Modifiers</span>
            <span className="wizard-section-rule" />
          </div>
          <div className="modifier-row">
            {MODIFIERS.map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={modifiers.includes(name)}
                className={`modifier-pill${modifiers.includes(name) ? " is-active" : ""}`}
                onClick={() => toggleModifier(name)}
              >
                {name}
              </button>
            ))}
          </div>
        </section>

        <section className="wizard-section">
          <div className="wizard-section-header">
            <span className="wizard-section-label">04. Skin Tone</span>
            <span className="wizard-section-rule" />
          </div>
          <div className="skintone-row" role="radiogroup" aria-label="Skin tone">
            {SKIN_TONES.map((hex) => (
              <button
                key={hex}
                type="button"
                role="radio"
                aria-checked={skinTone === hex}
                aria-label={`Skin tone ${hex}`}
                className={`skintone-swatch${skinTone === hex ? " is-selected" : ""}`}
                style={{ background: hex }}
                onClick={() => setSkinTone(hex)}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="wizard-footer">
        <div className="wizard-footer-inner">
          <Link to={NEXT_STEP_PATH} className="wizard-skip">
            Skip for now
          </Link>
          <button
            type="button"
            className="wizard-continue-btn"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
