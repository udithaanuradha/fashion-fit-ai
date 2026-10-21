import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";

const PRESET_SKIN_TONES = [
  { hex: "#3B2419", label: "Espresso" },
  { hex: "#5C3324", label: "Deep Chestnut" },
  { hex: "#7D4B32", label: "Bronze Umber" },
  { hex: "#A56B44", label: "Warm Caramel" },
  { hex: "#C68958", label: "Golden Honey" },
  { hex: "#E0AC7E", label: "Soft Amber" },
  { hex: "#F2D5B5", label: "Porcelain Ivory" },
];

const UNDERTONES = [
  {
    value: "WARM",
    label: "Warm",
    description: "Golden, peachy or yellow undertones. Gold jewelry glows on you.",
    metals: "Yellow Gold, Brass, Copper",
  },
  {
    value: "COOL",
    label: "Cool",
    description: "Pink, rosy or bluish undertones. Silver and platinum shine on you.",
    metals: "Silver, Platinum, White Gold",
  },
  {
    value: "NEUTRAL",
    label: "Neutral",
    description: "Balanced undertones with equal warm and cool balance.",
    metals: "Rose Gold, Mixed Metals",
  },
];

const SEASON_DETAILS = {
  SPRING: {
    title: "Warm Spring",
    tagline: "Luminous, vibrant & radiantly fresh",
    narrative:
      "Your palette thrives on sunlight and clarity. Warm, saturated hues with golden undertones accentuate your natural vitality. Avoid stark blacks and cold greys which suppress your natural radiance.",
    fabrics: "Silk chiffon, crisp poplin, textured linen, light knits",
    styleAdvice: "Pair coral or peach statement pieces with warm ivory or camel neutrals.",
    contrast: "Medium to High",
  },
  SUMMER: {
    title: "Cool Summer",
    tagline: "Ethereal, muted & refined elegance",
    narrative:
      "Your coloration has a soft, romantic cool undertone. Muted pastels, slate blues, powdery lavenders, and rose tones soften your look with understated sophistication. Steer clear of harsh neon shades and heavy earth tones.",
    fabrics: "Cashmere, soft jersey, crepe de chine, washed silk",
    styleAdvice: "Embrace soft tonal layering with dusty blues, mauve accents, and pearl accessories.",
    contrast: "Low to Medium",
  },
  AUTUMN: {
    title: "Warm Autumn",
    tagline: "Earthy, opulent & richly textured",
    narrative:
      "Deep, rich, and spiced tones mirror your natural warmth. Terracotta, moss olive, mustard ochre, and warm chocolate bring profound depth to your complexion. Avoid icy blues and stark white.",
    fabrics: "Heavy tweed, velvet, suede, brushed wool, hammered satin",
    styleAdvice: "Combine deep olive or rust tones with warm espresso basics and antique gold accents.",
    contrast: "Medium to Deep",
  },
  WINTER: {
    title: "Deep Winter",
    tagline: "Dramatic, high-contrast & striking clarity",
    narrative:
      "You command vibrant contrast and saturated jewels. Crimson red, royal cobalt, emerald, pure black, and crisp optical white celebrate your dramatic cool definition. Soft muted pastels or muddy oranges dilute your presence.",
    fabrics: "Structured wool, lustrous silk satin, leather, crisp poplin",
    styleAdvice: "Wear architectural monochrome silhouettes punctuated by electric jewel tones.",
    contrast: "High Drama",
  },
};

const COLOR_NAMES = {
  "#FF7F50": "Coral Glow",
  "#FFD700": "Tuscan Gold",
  "#40E0D0": "Turquoise Sea",
  "#98FB98": "Mint Jade",
  "#FF6F61": "Living Coral",
  "#B0C4DE": "Serenity Blue",
  "#E6E6FA": "French Lavender",
  "#F7CAC9": "Blush Rose",
  "#A9A9A9": "Dove Slate",
  "#8FBC8F": "Sea Sage",
  "#B7410E": "Terracotta Rust",
  "#808000": "Olive Moss",
  "#FFDB58": "Mustard Saffron",
  "#E2725B": "Spiced Ochre",
  "#654321": "Deep Espresso",
  "#C41E3A": "Royal Crimson",
  "#008B45": "Emerald Pine",
  "#4169E1": "Imperial Cobalt",
  "#000000": "True Black",
  "#FFFFFF": "Crisp White",
  "#C0C0C0": "Sterling Silver",
  "#B0E0E6": "Powder Cyan",
  "#FFA500": "Tangerine",
  "#ADD8E6": "Icy Sky",
  "#FF00FF": "Magenta",
  "#F5DEB3": "Wheat Khaki",
  "#D2B48C": "Desert Tan",
};

function titleCase(value) {
  if (!value) return "";
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, "0");
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export default function ColorMatch() {
  const [skinToneHex, setSkinToneHex] = useState("#C68958");
  const [undertone, setUndertone] = useState("WARM");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [copiedColor, setCopiedColor] = useState(null);

  // Image Upload & Canvas Extraction State
  const [imageUrl, setImageUrl] = useState(null);
  const [detectedRawColor, setDetectedRawColor] = useState(null);
  const fileInputRef = useRef(null);
  const imageElementRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get("/colormatch/history")
      .then((response) => {
        if (!cancelled && response?.data) setHistory(response.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  function handleCopyColor(hex) {
    navigator.clipboard?.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setResult(null);

      // Perform automatic skin tone sample once the image loads
      const img = new Image();
      img.src = url;
      img.onload = () => {
        extractCenterColor(img);
      };
    }
  }

  function extractCenterColor(img) {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 100;
      canvas.height = 100;

      // Draw center 40% of the image to sample facial / skin pixels
      const sx = img.naturalWidth * 0.3;
      const sy = img.naturalHeight * 0.25;
      const sw = img.naturalWidth * 0.4;
      const sh = img.naturalHeight * 0.4;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 100, 100);

      const frame = ctx.getImageData(0, 0, 100, 100);
      const data = frame.data;
      let totalR = 0, totalG = 0, totalB = 0, count = 0;

      for (let i = 0; i < data.length; i += 16) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Basic filter to ignore extreme dark (hair/shadows) or pure white
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        if (brightness > 40 && brightness < 240) {
          totalR += r;
          totalG += g;
          totalB += b;
          count++;
        }
      }

      if (count > 0) {
        const avgHex = rgbToHex(totalR / count, totalG / count, totalB / count);
        setDetectedRawColor(avgHex);
        setSkinToneHex(avgHex);

        // Deduce recommended undertone hint based on red vs blue ratio
        const avgR = totalR / count;
        const avgB = totalB / count;
        if (avgR - avgB > 35) {
          setUndertone("WARM");
        } else if (avgB - avgR > 10) {
          setUndertone("COOL");
        }
      }
    } catch {
      // Fallback in case of CORS or canvas security block
    }
  }

  function handleCanvasClick(e) {
    if (!imageElementRef.current || !imageUrl) return;
    try {
      const img = imageElementRef.current;
      const rect = img.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const scaleX = img.naturalWidth / rect.width;
      const scaleY = img.naturalHeight / rect.height;

      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        img,
        clickX * scaleX,
        clickY * scaleY,
        1,
        1,
        0,
        0,
        1,
        1
      );
      const pixel = ctx.getImageData(0, 0, 1, 1).data;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
      setDetectedRawColor(hex);
      setSkinToneHex(hex);
      setResult(null);
    } catch {
      // Ignore click sampling errors
    }
  }

  function handleRemoveImage() {
    setImageUrl(null);
    setDetectedRawColor(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await apiClient.post("/colormatch/analyze", {
        skinToneHex,
        undertone,
      });
      setResult(response.data);
      setHistory((current) => [
        {
          id: `recent-${Date.now()}`,
          skinToneHex,
          undertone,
          season: response.data.season,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
    } catch (err) {
      setError(err.message || "Failed to analyze palette");
    } finally {
      setLoading(false);
    }
  }

  const activeSeason = result?.season ? SEASON_DETAILS[result.season] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Atelier Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--card-bg)] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--accent)]">
            Haute Couture Color Science
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[var(--text)] tracking-tight">
          Personal Seasonal Palette
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-muted)] font-normal leading-relaxed">
          Harmonize your wardrobe with precision optical analysis. Upload a portrait or select your
          complexion tone and undertone to reveal your custom seasonal spectrum.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Diagnostics Panel (5 cols) */}
        <div className="lg:col-span-5 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 01. Portrait Sampling */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                  01. Portrait Sampling
                </span>
                <span className="text-xs text-[var(--text-muted)]">Optional Auto-Detection</span>
              </div>

              {!imageUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] rounded-2xl p-8 text-center transition-all cursor-pointer bg-[color-mix(in_srgb,var(--card-bg)_94%,var(--text)_6%)] hover:bg-[color-mix(in_srgb,var(--card-bg)_90%,var(--text)_10%)]"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-[var(--text)]">Upload Portrait Photo</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Click to browse or drag & drop (JPG, PNG up to 10MB)
                  </p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card-bg)] shadow-inner">
                  <div className="relative aspect-4/3 overflow-hidden bg-black/5">
                    <img
                      ref={imageElementRef}
                      src={imageUrl}
                      alt="Sampled face portrait"
                      onClick={handleCanvasClick}
                      className="w-full h-full object-cover cursor-crosshair hover:opacity-95 transition-opacity"
                      title="Click anywhere on your skin to sample color directly"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-white uppercase font-mono tracking-wider">
                      Click image to sample tone
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between bg-[var(--card-bg)] border-t border-[var(--border)]">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-full border border-black/20 shadow-sm"
                        style={{ backgroundColor: detectedRawColor || skinToneHex }}
                      />
                      <span className="text-xs font-mono font-medium text-[var(--text)]">
                        {detectedRawColor || skinToneHex}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* 02. Complexion Swatches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                  02. Skin Complexion Tone
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">{skinToneHex}</span>
              </div>
              <div className="flex flex-wrap gap-2.5 items-center" role="radiogroup" aria-label="Complexion Tone">
                {PRESET_SKIN_TONES.map((tone) => {
                  const isSelected = skinToneHex.toLowerCase() === tone.hex.toLowerCase();
                  return (
                    <button
                      key={tone.hex}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      title={tone.label}
                      onClick={() => setSkinToneHex(tone.hex)}
                      className={`relative w-10 h-10 rounded-full cursor-pointer transition-all ${
                        isSelected
                          ? "ring-2 ring-offset-2 ring-[var(--accent)] scale-110 shadow-md"
                          : "hover:scale-105 border border-black/10 opacity-90 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: tone.hex }}
                    />
                  );
                })}
                {/* Custom Fine-Tune Color Picker */}
                <label
                  className="relative w-10 h-10 rounded-full border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] flex items-center justify-center cursor-pointer transition-all shadow-sm"
                  title="Pick bespoke color"
                >
                  <input
                    type="color"
                    value={skinToneHex}
                    onChange={(e) => setSkinToneHex(e.target.value.toUpperCase())}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div
                    className="w-6 h-6 rounded-full shadow-inner"
                    style={{ backgroundColor: skinToneHex }}
                  />
                </label>
              </div>
            </div>

            {/* 03. Undertone Selection */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] block">
                03. Undertone Classification
              </span>
              <div className="space-y-2.5">
                {UNDERTONES.map((u) => {
                  const active = undertone === u.value;
                  return (
                    <button
                      key={u.value}
                      type="button"
                      onClick={() => setUndertone(u.value)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        active
                          ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--card-bg))] shadow-sm"
                          : "border-[var(--border)] hover:border-[var(--accent-border)] bg-[var(--card-bg)]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-bold ${active ? "text-[var(--text)]" : "text-[var(--text)]"}`}>
                          {u.label} Undertone
                        </span>
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            active
                              ? "border-[var(--accent)] bg-[var(--accent)]"
                              : "border-[var(--border)]"
                          }`}
                        >
                          {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                        {u.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-accent"
            >
              {loading ? "Analyzing Color Spectrum…" : "Analyze My Seasonal Palette"}
            </button>
          </form>
        </div>

        {/* Right Column: Haute-Couture Consultation Display (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-8 animate-in fade-in duration-300">
              {/* Header Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] font-mono">
                    Official Diagnosis
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text)] mt-1">
                    {activeSeason?.title || titleCase(result.season)}
                  </h2>
                  <p className="text-sm text-[var(--text-muted)] italic mt-0.5">
                    {activeSeason?.tagline}
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-[color-mix(in_srgb,var(--card-bg)_92%,var(--text)_8%)] p-2 rounded-xl border border-[var(--border)]">
                  <div
                    className="w-10 h-10 rounded-lg shadow-sm border border-black/15"
                    style={{ backgroundColor: skinToneHex }}
                    title="Analyzed Complexion"
                  />
                  <div className="text-left pr-2">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Complexion</p>
                    <p className="text-xs font-semibold text-[var(--text)]">{undertone} Undertone</p>
                  </div>
                </div>
              </div>

              {/* Narrative & Editorial Curation */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Architectural Color Profile
                </h3>
                <p className="text-sm text-[var(--text)] leading-relaxed font-normal">
                  {activeSeason?.narrative}
                </p>
              </div>

              {/* Curated Palette Swatches */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Signature Recommended Palette (Click to Copy HEX)
                  </h3>
                  {copiedColor && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse">
                      Copied {copiedColor}!
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {result.recommendedColors?.map((color) => {
                    const colorName = COLOR_NAMES[color.toUpperCase()] || color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleCopyColor(color)}
                        className="group flex flex-col items-center p-2.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)] hover:shadow-md transition-all cursor-pointer text-center"
                      >
                        <div
                          className="w-full h-16 rounded-lg shadow-inner border border-black/10 group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                        <span className="mt-2 text-xs font-semibold text-[var(--text)] truncate w-full">
                          {colorName}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {color}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors to Avoid */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                  Tones to Minimize / Avoid
                </h3>
                <div className="flex flex-wrap gap-3">
                  {result.colorsToAvoid?.map((color) => {
                    const colorName = COLOR_NAMES[color.toUpperCase()] || color;
                    return (
                      <div
                        key={color}
                        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20"
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/10"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs font-medium text-[var(--text)]">{colorName}</span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">({color})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Editorial Lookbook Guide */}
              <div className="p-5 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--card-bg)_96%,var(--accent)_4%)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                    Atelier Styling Directives
                  </span>
                  <span className="text-xs font-medium text-[var(--text-muted)]">
                    Contrast: {activeSeason?.contrast}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-[var(--text)] block mb-1">Recommended Textiles:</span>
                    <span className="text-[var(--text-muted)]">{activeSeason?.fabrics}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[var(--text)] block mb-1">Pairing Formula:</span>
                    <span className="text-[var(--text-muted)]">{activeSeason?.styleAdvice}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex justify-end">
                  <Link
                    to="/fittingroom"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)] hover:underline"
                  >
                    Test Outfits in Virtual Fitting Room →
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Standby Atelier Showcase */
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-8 sm:p-12 shadow-[var(--shadow-card)] text-center space-y-6 flex flex-col items-center justify-center min-h-[460px]">
              <div className="w-20 h-20 rounded-full border-2 border-[var(--border)] bg-[color-mix(in_srgb,var(--card-bg)_94%,var(--accent)_6%)] flex items-center justify-center shadow-sm">
                <svg className="w-9 h-9 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-2xl font-serif font-bold text-[var(--text)]">
                  Atelier Palette Awaiting Input
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Choose your complexion tone on the left, select your undertone, and click{" "}
                  <strong className="text-[var(--text)] font-semibold">&ldquo;Analyze My Seasonal Palette&rdquo;</strong> to generate your tailored palette report.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] border border-[var(--border)] px-4 py-2 rounded-full bg-[var(--card-bg)]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>4-Season Chromatic Engine Ready</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Historical Consultation Archive */}
      {history.length > 0 && (
        <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                Atelier Archive
              </span>
              <h2 className="text-xl font-serif font-bold text-[var(--text)]">
                Consultation History
              </h2>
            </div>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              {history.length} {history.length === 1 ? "Record" : "Records"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--card-bg)_97%,var(--text)_3%)] hover:border-[var(--accent)] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg shadow-sm border border-black/10 shrink-0"
                    style={{ backgroundColor: h.skinToneHex }}
                  />
                  <div>
                    <p className="text-sm font-bold text-[var(--text)]">
                      {SEASON_DETAILS[h.season]?.title || titleCase(h.season)}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {titleCase(h.undertone)} Undertone
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                    {formatDate(h.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
