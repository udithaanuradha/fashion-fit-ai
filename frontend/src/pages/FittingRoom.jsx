import { useEffect, useState, useMemo } from "react";
import { apiClient } from "../api/client";

const BODY_SHAPES = [
  { value: "hourglass", label: "Hourglass", shoulder: 1.0, waist: 0.65, hip: 1.02, desc: "Balanced shoulders & hips with defined waist" },
  { value: "pear", label: "Pear", shoulder: 0.86, waist: 0.74, hip: 1.16, desc: "Slender shoulders with fuller hips and thighs" },
  { value: "inverted_triangle", label: "Inverted Triangle", shoulder: 1.15, waist: 0.78, hip: 0.85, desc: "Broad, athletic shoulders tapering to hips" },
  { value: "rectangle", label: "Rectangle", shoulder: 0.95, waist: 0.88, hip: 0.95, desc: "Even, column-like silhouette with subtle waist" },
  { value: "apple", label: "Apple", shoulder: 0.98, waist: 1.08, hip: 0.92, desc: "Fuller midsection with slender limbs" },
  { value: "athletic", label: "Athletic", shoulder: 1.1, waist: 0.8, hip: 0.88, desc: "Toned muscular proportions throughout" },
];

const COMPLEXIONS = [
  { id: "espresso", label: "Espresso", hex: "#3B2419" },
  { id: "chestnut", label: "Chestnut", hex: "#5C3324" },
  { id: "caramel", label: "Caramel", hex: "#A56B44" },
  { id: "honey", label: "Golden Honey", hex: "#C68958" },
  { id: "amber", label: "Amber", hex: "#E0AC7E" },
  { id: "porcelain", label: "Porcelain", hex: "#F2D5B5" },
];

const DEFAULT_GARMENTS = [
  {
    id: 1,
    name: "Milanese Wool Blazer",
    brand: "Atelier V",
    category: "OUTERWEAR",
    color: "#2C2B29",
    sizes: [
      { sizeLabel: "S", chestMinCm: 86, chestMaxCm: 92, waistMinCm: 70, waistMaxCm: 76, hipsMinCm: 90, hipsMaxCm: 96 },
      { sizeLabel: "M", chestMinCm: 93, chestMaxCm: 99, waistMinCm: 77, waistMaxCm: 83, hipsMinCm: 97, hipsMaxCm: 103 },
      { sizeLabel: "L", chestMinCm: 100, chestMaxCm: 106, waistMinCm: 84, waistMaxCm: 90, hipsMinCm: 104, hipsMaxCm: 110 },
      { sizeLabel: "XL", chestMinCm: 107, chestMaxCm: 114, waistMinCm: 91, waistMaxCm: 98, hipsMinCm: 111, hipsMaxCm: 118 },
    ],
  },
  {
    id: 2,
    name: "Silk Charmeuse Blouse",
    brand: "Maison Claire",
    category: "TOP",
    color: "#EDE6D6",
    sizes: [
      { sizeLabel: "S", chestMinCm: 84, chestMaxCm: 89, waistMinCm: 66, waistMaxCm: 71, hipsMinCm: 89, hipsMaxCm: 94 },
      { sizeLabel: "M", chestMinCm: 90, chestMaxCm: 95, waistMinCm: 72, waistMaxCm: 77, hipsMinCm: 95, hipsMaxCm: 100 },
      { sizeLabel: "L", chestMinCm: 96, chestMaxCm: 102, waistMinCm: 78, waistMaxCm: 84, hipsMinCm: 101, hipsMaxCm: 107 },
      { sizeLabel: "XL", chestMinCm: 103, chestMaxCm: 110, waistMinCm: 85, waistMaxCm: 92, hipsMinCm: 108, hipsMaxCm: 115 },
    ],
  },
  {
    id: 3,
    name: "High-Rise Tailored Trousers",
    brand: "Sartoriale",
    category: "BOTTOM",
    color: "#3F3A35",
    sizes: [
      { sizeLabel: "S", chestMinCm: 80, chestMaxCm: 95, waistMinCm: 65, waistMaxCm: 70, hipsMinCm: 90, hipsMaxCm: 95 },
      { sizeLabel: "M", chestMinCm: 80, chestMaxCm: 100, waistMinCm: 71, waistMaxCm: 76, hipsMinCm: 96, hipsMaxCm: 101 },
      { sizeLabel: "L", chestMinCm: 85, chestMaxCm: 105, waistMinCm: 77, waistMaxCm: 83, hipsMinCm: 102, hipsMaxCm: 108 },
      { sizeLabel: "XL", chestMinCm: 90, chestMaxCm: 112, waistMinCm: 84, waistMaxCm: 91, hipsMinCm: 109, hipsMaxCm: 116 },
    ],
  },
  {
    id: 4,
    name: "Bias-Cut Velvet Midi Dress",
    brand: "Aura Noir",
    category: "DRESS",
    color: "#5B2C3B",
    sizes: [
      { sizeLabel: "S", chestMinCm: 84, chestMaxCm: 90, waistMinCm: 66, waistMaxCm: 72, hipsMinCm: 90, hipsMaxCm: 96 },
      { sizeLabel: "M", chestMinCm: 91, chestMaxCm: 97, waistMinCm: 73, waistMaxCm: 79, hipsMinCm: 97, hipsMaxCm: 103 },
      { sizeLabel: "L", chestMinCm: 98, chestMaxCm: 105, waistMinCm: 80, waistMaxCm: 87, hipsMinCm: 104, hipsMaxCm: 111 },
      { sizeLabel: "XL", chestMinCm: 106, chestMaxCm: 114, waistMinCm: 88, waistMaxCm: 96, hipsMinCm: 112, hipsMaxCm: 120 },
    ],
  },
  {
    id: 5,
    name: "Cashmere Knit Crewneck",
    brand: "Nordic Loom",
    category: "TOP",
    color: "#C2A88F",
    sizes: [
      { sizeLabel: "S", chestMinCm: 86, chestMaxCm: 92, waistMinCm: 68, waistMaxCm: 74, hipsMinCm: 88, hipsMaxCm: 94 },
      { sizeLabel: "M", chestMinCm: 93, chestMaxCm: 100, waistMinCm: 75, waistMaxCm: 82, hipsMinCm: 95, hipsMaxCm: 102 },
      { sizeLabel: "L", chestMinCm: 101, chestMaxCm: 108, waistMinCm: 83, waistMaxCm: 90, hipsMinCm: 103, hipsMaxCm: 110 },
      { sizeLabel: "XL", chestMinCm: 109, chestMaxCm: 118, waistMinCm: 91, waistMaxCm: 100, hipsMinCm: 111, hipsMaxCm: 120 },
    ],
  },
];

const PALETTE = [
  "#2C2B29", "#EDE6D6", "#B5562F", "#6B6E3A", "#C08074",
  "#2B3A4A", "#B98A55", "#5B3A4E", "#4A5B53", "#8C9A7B"
];

export default function FittingRoom() {
  // State: Avatar Customization
  const [bodyType, setBodyType] = useState("hourglass");
  const [skinToneHex, setSkinToneHex] = useState("#C68958");
  const [topColor, setTopColor] = useState("#2C2B29");
  const [bottomColor, setBottomColor] = useState("#B98A55");
  const [shoeColor, setShoeColor] = useState("#1C1917");

  // State: Backend Data
  const [garments, setGarments] = useState(DEFAULT_GARMENTS);
  const [selectedGarment, setSelectedGarment] = useState(DEFAULT_GARMENTS[0]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [measurements, setMeasurements] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // State: Measurement Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formHeight, setFormHeight] = useState("170");
  const [formWeight, setFormWeight] = useState("65");
  const [formChest, setFormChest] = useState("92");
  const [formWaist, setFormWaist] = useState("74");
  const [formHips, setFormHips] = useState("98");
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Load garments, measurements and history on mount
  useEffect(() => {
    let cancelled = false;

    // Garments catalog
    apiClient
      .get("/fittingroom/garments")
      .then((res) => {
        if (!cancelled && res.data && res.data.length > 0) {
          setGarments(res.data);
          setSelectedGarment(res.data[0]);
        }
      })
      .catch(() => {});

    // Latest user measurements
    apiClient
      .get("/fittingroom/measurements/latest")
      .then((res) => {
        if (!cancelled && res.data) {
          setMeasurements(res.data);
          setFormHeight(String(res.data.heightCm));
          setFormWeight(String(res.data.weightKg));
          setFormChest(String(res.data.chestCm));
          setFormWaist(String(res.data.waistCm));
          setFormHips(String(res.data.hipsCm));
        }
      })
      .catch(() => {});

    // Fitting history
    apiClient
      .get("/fittingroom/history")
      .then((res) => {
        if (!cancelled && res.data) setHistory(res.data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  // Request recommendation when garment changes (if measurements exist)
  useEffect(() => {
    if (!selectedGarment || !measurements) return;
    let cancelled = false;

    apiClient
      .get(`/fittingroom/recommend/${selectedGarment.id}`)
      .then((res) => {
        if (!cancelled) setRecommendation(res.data);
      })
      .catch(() => {
        if (!cancelled) {
          calculateLocalRecommendation(selectedGarment, measurements);
        }
      })
      .finally(() => {
        if (!cancelled) setRecommendLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedGarment, measurements]);

  function calculateLocalRecommendation(garment, m) {
    if (!garment.sizes || garment.sizes.length === 0) return;
    let bestSize = garment.sizes[0];
    let bestPenalty = 9999;

    for (const size of garment.sizes) {
      const pChest = m.chestCm < size.chestMinCm ? size.chestMinCm - m.chestCm : m.chestCm > size.chestMaxCm ? m.chestCm - size.chestMaxCm : 0;
      const pWaist = m.waistCm < size.waistMinCm ? size.waistMinCm - m.waistCm : m.waistCm > size.waistMaxCm ? m.waistCm - size.waistMaxCm : 0;
      const pHips = m.hipsCm < size.hipsMinCm ? size.hipsMinCm - m.hipsCm : m.hipsCm > size.hipsMaxCm ? m.hipsCm - size.hipsMaxCm : 0;
      const penalty = pChest + pWaist + pHips;
      if (penalty < bestPenalty) {
        bestPenalty = penalty;
        bestSize = size;
      }
    }

    const fitScore = Math.max(0, Math.round(100 - bestPenalty * 2));
    const notes = fitScore >= 90
      ? "Great fit across chest, waist and hips."
      : fitScore >= 70
      ? "Reasonable fit; check size chart for tightest measurement."
      : "Loose match — consider a different size or silhouette.";

    setRecommendation({
      garmentId: garment.id,
      garmentName: garment.name,
      recommendedSize: bestSize.sizeLabel,
      fitScore,
      notes,
    });
  }

  async function handleSaveMeasurements(e) {
    e.preventDefault();
    setModalError(null);
    setModalSaving(true);
    try {
      const payload = {
        heightCm: parseFloat(formHeight),
        weightKg: parseFloat(formWeight),
        chestCm: parseFloat(formChest),
        waistCm: parseFloat(formWaist),
        hipsCm: parseFloat(formHips),
      };
      const res = await apiClient.post("/fittingroom/measurements", payload);
      setMeasurements(res.data);
      setIsModalOpen(false);
      // Re-trigger fit analysis
      if (selectedGarment) {
        calculateLocalRecommendation(selectedGarment, res.data);
      }
    } catch (err) {
      setModalError(err.message || "Failed to save measurements");
    } finally {
      setModalSaving(false);
    }
  }

  const filteredGarments = useMemo(() => {
    if (activeCategory === "ALL") return garments;
    return garments.filter((g) => g.category === activeCategory);
  }, [garments, activeCategory]);

  const activeShape = useMemo(
    () => BODY_SHAPES.find((s) => s.value === bodyType) || BODY_SHAPES[0],
    [bodyType]
  );

  // High-Fashion Croquis Vector Geometry
  const croquis = useMemo(() => {
    const s = activeShape.shoulder;
    const w = activeShape.waist;
    const h = activeShape.hip;

    // Torso bezier contour
    const cx = 130;
    const sW = s * 42;
    const wW = w * 32;
    const hW = h * 44;

    const topPath = `
      M ${cx - sW} 118 
      C ${cx - sW * 0.9} 145, ${cx - wW * 1.1} 185, ${cx - wW} 220 
      L ${cx + wW} 220 
      C ${cx + wW * 1.1} 185, ${cx + sW * 0.9} 145, ${cx + sW} 118 
      Z
    `;

    const bottomPath = `
      M ${cx - wW} 220
      C ${cx - hW * 1.1} 255, ${cx - hW} 295, ${cx - 24} 370
      L ${cx - 18} 475
      L ${cx - 6} 475
      L ${cx - 4} 340
      L ${cx + 4} 340
      L ${cx + 6} 475
      L ${cx + 18} 475
      L ${cx + 24} 370
      C ${cx + hW} 295, ${cx + hW * 1.1} 255, ${cx + wW} 220
      Z
    `;

    const dressPath = `
      M ${cx - sW} 118
      C ${cx - sW * 0.9} 145, ${cx - wW * 1.1} 185, ${cx - wW} 220
      C ${cx - hW * 1.15} 265, ${cx - hW * 1.25} 330, ${cx - hW * 1.35} 410
      L ${cx + hW * 1.35} 410
      C ${cx + hW * 1.25} 330, ${cx + hW * 1.15} 265, ${cx + wW} 220
      C ${cx + wW * 1.1} 185, ${cx + sW * 0.9} 145, ${cx + sW} 118
      Z
    `;

    const armL = `M ${cx - sW + 4} 122 Q ${cx - sW - 14} 190, ${cx - sW - 4} 260`;
    const armR = `M ${cx + sW - 4} 122 Q ${cx + sW + 14} 190, ${cx + sW + 4} 260`;

    return { cx, sW, wW, hW, topPath, bottomPath, dressPath, armL, armR };
  }, [activeShape]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Atelier Fitting Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border)] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--card-bg)] shadow-sm mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--accent)]">
              Digital Couture Fitting Room
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--text)] tracking-tight">
            Virtual Atelier Studio
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2 max-w-xl">
            Simulate silhouettes, drape designer garments on your custom croquis, and receive
            parametric AI fit scoring tailored to your exact measurements.
          </p>
        </div>

        {/* User Measurement Quick Metric Bar */}
        <div className="flex items-center gap-4 bg-[var(--card-bg)] p-3 sm:p-4 rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)]">
          {measurements ? (
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--accent)] block">
                Your Measurements On File
              </span>
              <div className="flex items-center gap-4 text-xs font-semibold text-[var(--text)]">
                <span>Chest: <strong className="font-mono text-[var(--accent)]">{measurements.chestCm}cm</strong></span>
                <span>Waist: <strong className="font-mono text-[var(--accent)]">{measurements.waistCm}cm</strong></span>
                <span>Hips: <strong className="font-mono text-[var(--accent)]">{measurements.hipsCm}cm</strong></span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-[var(--text-muted)]">
              <p className="font-semibold text-[var(--text)]">No Measurements Recorded</p>
              <p>Add metrics for real sizing tolerance.</p>
            </div>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text)] transition-all cursor-pointer hover:shadow-sm"
          >
            {measurements ? "Update" : "Add Metrics"}
          </button>
        </div>
      </div>

      {/* Main Studio Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Mannequin & Croquis Runway (5 cols) */}
        <div className="lg:col-span-5 bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-[var(--shadow-card)] flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4 border-b border-[var(--border)] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
              Live Fashion Croquis
            </span>
            <span className="text-xs font-semibold text-[var(--text)] font-serif italic">
              {activeShape.label} Silhouette
            </span>
          </div>

          {/* SVG Vector Runway Mannequin */}
          <div className="relative w-full max-w-[340px] aspect-[1/2] rounded-2xl bg-[radial-gradient(circle_at_50%_40%,color-mix(in_srgb,var(--card-bg)_80%,var(--accent)_20%),transparent_70%)] flex items-center justify-center overflow-hidden border border-[var(--border)]/40 p-4">
            <svg
              viewBox="0 0 260 520"
              className="w-full h-full drop-shadow-md select-none transition-all duration-500 ease-out"
              role="img"
              aria-label="Stylized vector croquis"
            >
              <defs>
                <radialGradient id="croquisShadow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.18)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
              </defs>

              {/* Floor Shadow */}
              <ellipse cx="130" cy="500" rx="65" ry="10" fill="url(#croquisShadow)" />

              {/* Legs (Skin under garments) */}
              <rect x="110" y="470" width="16" height="26" rx="4" fill={skinToneHex} />
              <rect x="134" y="470" width="16" height="26" rx="4" fill={skinToneHex} />

              {/* Shoes */}
              <rect x="106" y="490" width="22" height="12" rx="4" fill={shoeColor} />
              <rect x="132" y="490" width="22" height="12" rx="4" fill={shoeColor} />

              {/* Arms (Vector lines with skin tone) */}
              <path d={croquis.armL} fill="none" stroke={skinToneHex} strokeWidth="11" strokeLinecap="round" />
              <path d={croquis.armR} fill="none" stroke={skinToneHex} strokeWidth="11" strokeLinecap="round" />

              {/* Torso & Apparel Rendering */}
              {selectedGarment.category === "DRESS" ? (
                <path d={croquis.dressPath} fill={topColor} className="transition-all duration-300" />
              ) : (
                <>
                  {/* Bottoms */}
                  <path d={croquis.bottomPath} fill={bottomColor} className="transition-all duration-300" />
                  {/* Tops */}
                  <path d={croquis.topPath} fill={topColor} className="transition-all duration-300" />
                </>
              )}

              {/* Neck & Head */}
              <path d="M 122 84 L 138 84 L 140 120 L 120 120 Z" fill={skinToneHex} />
              <ellipse cx="130" cy="62" rx="20" ry="26" fill={skinToneHex} />

              {/* Subtle Haute-Couture Mannequin Guidelines */}
              <line x1="85" y1="150" x2="175" y2="150" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
              <line x1="95" y1="220" x2="165" y2="220" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
              <line x1="80" y1="280" x2="180" y2="280" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
            </svg>

            {/* Dimensional Badges */}
            <div className="absolute right-3 top-28 bg-[var(--card-bg)]/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-[var(--text-muted)] border border-[var(--border)] shadow-xs">
              Chest
            </div>
            <div className="absolute right-3 top-44 bg-[var(--card-bg)]/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-[var(--text-muted)] border border-[var(--border)] shadow-xs">
              Waist
            </div>
            <div className="absolute right-3 top-58 bg-[var(--card-bg)]/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-[var(--text-muted)] border border-[var(--border)] shadow-xs">
              Hips
            </div>
          </div>

          {/* Quick Swatch Palette Selector */}
          <div className="w-full mt-6 space-y-4 border-t border-[var(--border)] pt-4">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] uppercase">
              <span>Textile Palette</span>
              <span className="font-mono text-[10px]">Instant Live Dye</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-[var(--text)]">Top / Main Color</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={topColor}
                    onChange={(e) => setTopColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border border-[var(--border)] cursor-pointer"
                  />
                  <div className="flex gap-1 overflow-x-auto py-1">
                    {PALETTE.slice(0, 4).map((c) => (
                      <button
                        key={c}
                        onClick={() => setTopColor(c)}
                        className="w-5 h-5 rounded-md border border-black/10 shrink-0"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-[var(--text)]">Bottom / Pant Color</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={bottomColor}
                    onChange={(e) => setBottomColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border border-[var(--border)] cursor-pointer"
                  />
                  <div className="flex gap-1 overflow-x-auto py-1">
                    {PALETTE.slice(4, 8).map((c) => (
                      <button
                        key={c}
                        onClick={() => setBottomColor(c)}
                        className="w-5 h-5 rounded-md border border-black/10 shrink-0"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-[var(--text)]">Croquis Complexion</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={skinToneHex}
                    onChange={(e) => setSkinToneHex(e.target.value)}
                    className="w-7 h-7 rounded-lg border border-[var(--border)] cursor-pointer"
                  />
                  <div className="flex gap-1 overflow-x-auto py-1">
                    {COMPLEXIONS.slice(0, 4).map((c) => (
                      <button
                        key={c.id}
                        title={c.label}
                        onClick={() => setSkinToneHex(c.hex)}
                        className="w-5 h-5 rounded-md border border-black/10 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-[var(--text)]">Footwear Color</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={shoeColor}
                    onChange={(e) => setShoeColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border border-[var(--border)] cursor-pointer"
                  />
                  <div className="flex gap-1 overflow-x-auto py-1">
                    {["#1C1917", "#B98A55", "#EDE6D6", "#5B2C3B"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setShoeColor(c)}
                        className="w-5 h-5 rounded-md border border-black/10 shrink-0"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Garment Catalog & AI Recommendation (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 01. Silhouette Morph Controls */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                01. Silhouette Proportions
              </span>
              <span className="text-xs text-[var(--text-muted)]">{activeShape.desc}</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {BODY_SHAPES.map((s) => {
                const isSelected = bodyType === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => setBodyType(s.value)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,var(--card-bg))] shadow-sm"
                        : "border-[var(--border)] hover:border-[var(--accent-border)] bg-[var(--card-bg)]"
                    }`}
                  >
                    <span className="text-xs font-bold text-[var(--text)] block truncate">
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 02. Garment Collection & Filter */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                  02. Atelier Apparel Selection
                </span>
                <h3 className="text-xl font-serif font-bold text-[var(--text)] mt-1">
                  Choose Garment to Try On
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-[color-mix(in_srgb,var(--card-bg)_92%,var(--text)_8%)] p-1 rounded-xl border border-[var(--border)]">
                {["ALL", "TOP", "BOTTOM", "DRESS", "OUTERWEAR"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-[var(--accent)] text-[var(--accent-text)] shadow-sm"
                        : "text-[var(--text-muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Garment Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredGarments.map((g) => {
                const isSelected = selectedGarment.id === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => {
                      setSelectedGarment(g);
                      if (g.color) setTopColor(g.color);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? "border-[var(--accent)] ring-1 ring-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_6%,var(--card-bg))] shadow-md"
                        : "border-[var(--border)] hover:border-[var(--accent-border)] bg-[var(--card-bg)]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--accent)] font-mono">
                          {g.brand}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--text-muted)]">
                          {g.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[var(--text)]">
                        {g.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                      <div className="flex gap-1.5">
                        {g.sizes?.map((sz) => (
                          <span
                            key={sz.sizeLabel}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-muted)]"
                          >
                            {sz.sizeLabel}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-[var(--accent)]">
                        {isSelected ? "Selected ✓" : "Try On →"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 03. AI Precision Fit Diagnostic Card */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                  03. Neural Fit Analysis
                </span>
                <h3 className="text-xl font-serif font-bold text-[var(--text)] mt-0.5">
                  Fit Verdict for &ldquo;{selectedGarment.name}&rdquo;
                </h3>
              </div>
              {recommendLoading && (
                <span className="text-xs font-mono text-[var(--accent)] animate-pulse">
                  Computing Tolerances…
                </span>
              )}
            </div>

            {recommendation ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 rounded-2xl bg-[color-mix(in_srgb,var(--card-bg)_94%,var(--accent)_6%)] border border-[var(--border)]">
                  {/* Gauge */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full border-4 border-[var(--accent)] flex items-center justify-center font-mono font-bold text-xl text-[var(--text)] shadow-sm">
                      {recommendation.fitScore}%
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--accent)] block">
                        Recommended Size
                      </span>
                      <span className="text-2xl font-serif font-bold text-[var(--text)]">
                        Size {recommendation.recommendedSize}
                      </span>
                    </div>
                  </div>

                  <div className="max-w-xs text-xs text-[var(--text)] leading-relaxed bg-[var(--card-bg)] p-3 rounded-xl border border-[var(--border)]">
                    <strong className="block text-[var(--accent)] mb-0.5">Atelier Verdict:</strong>
                    {recommendation.notes}
                  </div>
                </div>

                {/* Dimension Tolerances Table */}
                {measurements && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                      Measurement Match Breakdown
                    </span>
                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase block">Chest</span>
                        <strong className="text-sm font-mono text-[var(--text)]">{measurements.chestCm} cm</strong>
                      </div>
                      <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase block">Waist</span>
                        <strong className="text-sm font-mono text-[var(--text)]">{measurements.waistCm} cm</strong>
                      </div>
                      <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase block">Hips</span>
                        <strong className="text-sm font-mono text-[var(--text)]">{measurements.hipsCm} cm</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <p className="text-sm text-[var(--text-muted)]">
                  Enter your body metrics to activate real-time size optimization.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[var(--accent-gradient)] text-[var(--accent-text)] shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Enter Body Measurements
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 04. Saved Fittings Archive */}
      {history.length > 0 && (
        <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                Fitting Archive
              </span>
              <h2 className="text-xl font-serif font-bold text-[var(--text)]">
                Saved Fits & Recommendations
              </h2>
            </div>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              {history.length} {history.length === 1 ? "Record" : "Records"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--card-bg)_97%,var(--text)_3%)] flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-[var(--text)]">{item.garmentName}</h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Recommended: <strong className="text-[var(--accent)] font-mono">Size {item.recommendedSize}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,var(--card-bg))] text-[var(--accent)] border border-[var(--accent)]/30">
                    {item.fitScore}% Fit
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] block mt-1">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] font-mono">
                  Parametric Tailoring
                </span>
                <h3 className="text-2xl font-serif font-bold text-[var(--text)] mt-1">
                  Your Body Measurements
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text)] text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMeasurements} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--text)] block mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="50"
                    required
                    value={formHeight}
                    onChange={(e) => setFormHeight(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-transparent text-[var(--text)] text-sm font-mono outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text)] block mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="20"
                    required
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-transparent text-[var(--text)] text-sm font-mono outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text)] block mb-1">
                    Chest (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="30"
                    required
                    value={formChest}
                    onChange={(e) => setFormChest(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-transparent text-[var(--text)] text-sm font-mono outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text)] block mb-1">
                    Waist (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="30"
                    required
                    value={formWaist}
                    onChange={(e) => setFormWaist(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-transparent text-[var(--text)] text-sm font-mono outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text)] block mb-1">
                    Hips (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="30"
                    required
                    value={formHips}
                    onChange={(e) => setFormHips(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-transparent text-[var(--text)] text-sm font-mono outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              {modalError && (
                <p className="text-xs text-rose-500 font-medium">{modalError}</p>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSaving}
                  className="btn-accent py-2.5 px-6 w-auto text-xs"
                >
                  {modalSaving ? "Saving…" : "Save Metrics & Calibrate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
