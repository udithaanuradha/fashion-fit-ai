import { useMemo, useState } from "react";

// Six body-type presets, expressed as shoulder/waist/hip multipliers relative
// to a baseline unit. The same multipliers drive both the small selector
// icons and the full-size avatar in the stage — they're generated from one
// path function so every silhouette in the UI stays visually consistent.
const BODY_SHAPES = [
  { value: "hourglass", label: "Hourglass", shoulder: 1.0, waist: 0.66, hip: 1.0 },
  { value: "pear", label: "Pear", shoulder: 0.84, waist: 0.8, hip: 1.16 },
  { value: "inverted_triangle", label: "Inverted Triangle", shoulder: 1.16, waist: 0.8, hip: 0.84 },
  { value: "rectangle", label: "Rectangle", shoulder: 0.94, waist: 0.9, hip: 0.94 },
  { value: "apple", label: "Apple", shoulder: 0.98, waist: 1.14, hip: 0.9 },
  { value: "athletic", label: "Athletic", shoulder: 1.1, waist: 0.84, hip: 0.88 },
];

const SKIN_TONES = [
  { id: "fair", label: "Fair", hex: "#F6E1D3" },
  { id: "light", label: "Light", hex: "#EFC7A5" },
  { id: "medium", label: "Medium", hex: "#D9A377" },
  { id: "tan", label: "Tan", hex: "#B67D4E" },
  { id: "deep", label: "Deep", hex: "#8A5333" },
  { id: "rich", label: "Rich", hex: "#5A331E" },
];

const PALETTE = [
  { name: "Ivory", hex: "#F3ECE1" },
  { name: "Terracotta", hex: "#B5562F" },
  { name: "Olive", hex: "#6B6E3A" },
  { name: "Charcoal", hex: "#2E2A26" },
  { name: "Rose", hex: "#C08074" },
  { name: "Sage", hex: "#8C9A7B" },
  { name: "Navy", hex: "#2B3A4A" },
  { name: "Camel", hex: "#B98A55" },
  { name: "Plum", hex: "#5B3A4E" },
  { name: "Cream", hex: "#EDE6D6" },
];

// Compact geometry for the ~26px selector icons.
const ICON_GEOM = { cx: 13, unit: 8, shoulderY: 5, waistY: 17, hipY: 29 };
// Full-size geometry for the stage avatar.
const CROQUIS_GEOM = { cx: 120, unit: 34, shoulderY: 90, waistY: 196, hipY: 280 };

function pt(x, y) {
  return `${x.toFixed(1)} ${y.toFixed(1)}`;
}

function smoothSide(points) {
  let d = "";
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const c1y = p0.y + (p1.y - p0.y) / 2.2;
    const c2y = p1.y - (p1.y - p0.y) / 2.2;
    d += ` C ${p0.x.toFixed(1)} ${c1y.toFixed(1)}, ${p1.x.toFixed(1)} ${c2y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return d;
}

function torsoPath(shape, g) {
  const sH = shape.shoulder * g.unit;
  const wH = shape.waist * g.unit;
  const hH = shape.hip * g.unit;
  const shoulderR = { x: g.cx + sH, y: g.shoulderY };
  const waistR = { x: g.cx + wH, y: g.waistY };
  const hipR = { x: g.cx + hH, y: g.hipY };
  const shoulderL = { x: g.cx - sH, y: g.shoulderY };
  const waistL = { x: g.cx - wH, y: g.waistY };
  const hipL = { x: g.cx - hH, y: g.hipY };

  let d = `M ${pt(shoulderL.x, shoulderL.y)} L ${pt(shoulderR.x, shoulderR.y)}`;
  d += smoothSide([shoulderR, waistR, hipR]);
  d += ` L ${pt(hipL.x, hipL.y)}`;
  d += smoothSide([hipL, waistL, shoulderL]);
  d += " Z";
  return d;
}

function buildAvatar(shape, g) {
  const sH = shape.shoulder * g.unit;
  const hH = shape.hip * g.unit;

  function armSide(sign) {
    const shoulderPt = { x: g.cx + sign * sH * 0.92, y: 96 };
    const elbowPt = { x: g.cx + sign * sH * 1.02, y: 186 };
    const wristPt = { x: g.cx + sign * sH * 0.88, y: 266 };
    const c1 = { x: g.cx + sign * sH * 1.18, y: 140 };
    const c2 = { x: g.cx + sign * sH * 0.95, y: 226 };
    return {
      sleeve: `M ${pt(shoulderPt.x, shoulderPt.y)} Q ${pt(c1.x, c1.y)}, ${pt(elbowPt.x, elbowPt.y)}`,
      forearm: `M ${pt(elbowPt.x, elbowPt.y)} Q ${pt(c2.x, c2.y)}, ${pt(wristPt.x, wristPt.y)}`,
      handX: wristPt.x,
      handY: wristPt.y,
    };
  }

  function legSide(sign) {
    const hip = { x: g.cx + sign * hH * 0.42, y: g.hipY + 2 };
    const knee = { x: g.cx + sign * hH * 0.3, y: 378 };
    const ankle = { x: g.cx + sign * hH * 0.26, y: 456 };
    const c1 = { x: g.cx + sign * hH * 0.36, y: 330 };
    const c2 = { x: g.cx + sign * hH * 0.27, y: 417 };
    return {
      leg: `M ${pt(hip.x, hip.y)} Q ${pt(c1.x, c1.y)}, ${pt(knee.x, knee.y)} Q ${pt(c2.x, c2.y)}, ${pt(ankle.x, ankle.y)}`,
      ankleX: ankle.x,
    };
  }

  const armL = armSide(-1);
  const armR = armSide(1);
  const legL = legSide(-1);
  const legR = legSide(1);

  return {
    torsoPath: torsoPath(shape, g),
    neckPath: "M 110 68 L 130 68 L 136 92 L 104 92 Z",
    armLSleeve: armL.sleeve,
    armRSleeve: armR.sleeve,
    armLForearm: armL.forearm,
    armRForearm: armR.forearm,
    handLX: armL.handX,
    handRX: armR.handX,
    handY: 266,
    legLPath: legL.leg,
    legRPath: legR.leg,
    shoeLX: (legL.ankleX - 18).toFixed(1),
    shoeRX: (legR.ankleX - 18).toFixed(1),
    shoeY: 464,
    shoeW: 36,
    shoeH: 16,
  };
}

function GarmentRow({ label, value, onChange }) {
  return (
    <section className="fitting-section">
      <div className="wizard-section-header">
        <span className="wizard-section-label">{label}</span>
        <span className="wizard-section-rule" />
      </div>
      <div className="garment-row">
        {PALETTE.map((c) => (
          <button
            key={c.hex}
            type="button"
            role="radio"
            aria-checked={value.toLowerCase() === c.hex.toLowerCase()}
            aria-label={c.name}
            title={c.name}
            className={`garment-swatch${value.toLowerCase() === c.hex.toLowerCase() ? " is-selected" : ""}`}
            style={{ background: c.hex }}
            onClick={() => onChange(c.hex)}
          />
        ))}
        <input
          type="color"
          className="garment-custom"
          aria-label={`Custom ${label.toLowerCase()} color`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </section>
  );
}

export default function FittingRoom() {
  const [bodyType, setBodyType] = useState("hourglass");
  const [skinToneId, setSkinToneId] = useState("medium");
  const [top, setTop] = useState("#2E2A26");
  const [bottom, setBottom] = useState("#B98A55");
  const [shoes, setShoes] = useState("#2E2A26");

  const shape = BODY_SHAPES.find((s) => s.value === bodyType);
  const skinHex = SKIN_TONES.find((t) => t.id === skinToneId).hex;
  const avatar = useMemo(() => buildAvatar(shape, CROQUIS_GEOM), [shape]);

  return (
    <div className="fitting-page">
      <div className="fitting-intro">
        <span className="wizard-section-label">Fitting Room</span>
        <h1 className="fitting-headline">See it on you before you buy.</h1>
        <p className="wizard-subtext">Shape, skin tone and outfit — recolor and reshape instantly.</p>
      </div>

      <div className="fitting-layout">
        <div className="fitting-controls">
          <section className="fitting-section">
            <div className="wizard-section-header">
              <span className="wizard-section-label">Body Type</span>
              <span className="wizard-section-rule" />
            </div>
            <div className="fitting-body-grid" role="radiogroup" aria-label="Body type">
              {BODY_SHAPES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  role="radio"
                  aria-checked={bodyType === s.value}
                  className={`shape-card${bodyType === s.value ? " is-selected" : ""}`}
                  onClick={() => setBodyType(s.value)}
                >
                  <span className="shape-card-image">
                    <span className="wizard-radio" aria-hidden="true" />
                    <svg className="shape-svg" viewBox="0 0 26 34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                      <path d={torsoPath(s, ICON_GEOM)} />
                    </svg>
                  </span>
                  <span className="shape-card-label">{s.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="fitting-section">
            <div className="wizard-section-header">
              <span className="wizard-section-label">Skin Tone</span>
              <span className="wizard-section-rule" />
            </div>
            <div className="skintone-row" role="radiogroup" aria-label="Skin tone">
              {SKIN_TONES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={skinToneId === t.id}
                  aria-label={t.label}
                  title={t.label}
                  className={`skintone-swatch${skinToneId === t.id ? " is-selected" : ""}`}
                  style={{ background: t.hex }}
                  onClick={() => setSkinToneId(t.id)}
                />
              ))}
            </div>
          </section>

          <GarmentRow label="Top" value={top} onChange={setTop} />
          <GarmentRow label="Bottom" value={bottom} onChange={setBottom} />
          <GarmentRow label="Shoes" value={shoes} onChange={setShoes} />
        </div>

        <div className="fitting-stage-col">
          <div className="fitting-stage">
            <svg width="340" height="720" viewBox="0 0 240 520" role="img" aria-label="Outfit preview on selected body type and skin tone">
              <ellipse cx="120" cy="491" rx="62" ry="9" fill="rgba(0,0,0,0.08)" />
              <path d={avatar.neckPath} fill={skinHex} />
              <path d={avatar.legLPath} fill="none" stroke={bottom} strokeWidth="27" strokeLinecap="round" />
              <path d={avatar.legRPath} fill="none" stroke={bottom} strokeWidth="27" strokeLinecap="round" />
              <rect x={avatar.shoeLX} y={avatar.shoeY} width={avatar.shoeW} height={avatar.shoeH} rx="7" fill={shoes} />
              <rect x={avatar.shoeRX} y={avatar.shoeY} width={avatar.shoeW} height={avatar.shoeH} rx="7" fill={shoes} />
              <path d={avatar.armLSleeve} fill="none" stroke={top} strokeWidth="23" strokeLinecap="round" />
              <path d={avatar.armRSleeve} fill="none" stroke={top} strokeWidth="23" strokeLinecap="round" />
              <path d={avatar.armLForearm} fill="none" stroke={skinHex} strokeWidth="17" strokeLinecap="round" />
              <path d={avatar.armRForearm} fill="none" stroke={skinHex} strokeWidth="17" strokeLinecap="round" />
              <circle cx={avatar.handLX} cy={avatar.handY} r="9" fill={skinHex} />
              <circle cx={avatar.handRX} cy={avatar.handY} r="9" fill={skinHex} />
              <path d={avatar.torsoPath} fill={top} />
              <circle cx="120" cy="46" r="25" fill={skinHex} />
            </svg>
          </div>
          <div className="fitting-stage-caption">Live preview — recolors instantly</div>
        </div>
      </div>
    </div>
  );
}
