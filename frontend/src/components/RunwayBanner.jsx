import { useState, useEffect, useRef } from "react";

const RUNWAY_LOOKS = [
  {
    id: 1,
    tag: "LOOK 01 • ATELIER NOIR",
    title: "Milanese Velvet Cape",
    image: "/runway_model_walk.jpg",
    direction: "pan-walk-right",
  },
  {
    id: 2,
    tag: "LOOK 02 • AURA BLANCHE",
    title: "Architectural Silk Gown",
    image: "/runway_model_ivory.jpg",
    direction: "pan-walk-left",
  },
];

export default function RunwayBanner({ appName = "Fit Muse" }) {
  const [currentLook, setCurrentLook] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  // Auto-cycle through runway looks
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentLook((prev) => (prev + 1) % RUNWAY_LOOKS.length);
    }, 7500);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Dynamic interactive spotlight tracking mouse
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const look = RUNWAY_LOOKS[currentLook];

  return (
    <div
      ref={containerRef}
      className="auth-banner runway-stage"
      onMouseMove={handleMouseMove}
      role="region"
      aria-label="Fashion runway presentation"
    >
      {/* Interactive Ambient Studio Spotlight */}
      <div
        className="runway-spotlight"
        style={{
          background: `radial-gradient(circle 380px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 225, 160, 0.22), rgba(0, 0, 0, 0) 80%)`,
        }}
      />

      {/* Runway Background & Moving Model Layers */}
      {RUNWAY_LOOKS.map((item, index) => {
        const isActive = index === currentLook;
        return (
          <div
            key={item.id}
            className={`runway-layer ${isActive ? "active" : "inactive"} ${item.direction} ${isPaused ? "paused" : ""}`}
            style={{
              backgroundImage: `url(${item.image})`,
            }}
          />
        );
      })}

      {/* Glossy Runway Stage Floor Reflection Gradient */}
      <div className="runway-floor-sheen" />

      {/* Top Editorial Fashion Week Badge */}
      <div className="runway-top-badge">
        <span className="runway-live-dot" />
        <span className="runway-badge-text">PARIS RUNWAY • LIVE CATWALK</span>
      </div>

      {/* Bottom Main Content Overlay */}
      <div className="auth-banner-overlay runway-content">
        <div className="runway-look-tag">{look.tag}</div>
        <h1 className="auth-banner-headline">Made to Fit.</h1>
        <p className="auth-banner-subhead">
          Join {appName} and get personalized AI fitting, color match, and couture guidance tailored to your silhouette.
        </p>

        {/* Runway Controls & Look Switcher */}
        <div className="runway-controls">
          <div className="runway-look-pills">
            {RUNWAY_LOOKS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                className={`runway-pill ${idx === currentLook ? "active" : ""}`}
                onClick={() => setCurrentLook(idx)}
                aria-label={`View ${item.tag}`}
              >
                <span className="pill-index">0{idx + 1}</span>
                <span className="pill-name">{item.title}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="runway-pause-btn"
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Resume catwalk motion" : "Pause catwalk motion"}
            aria-label={isPaused ? "Resume catwalk animation" : "Pause catwalk animation"}
          >
            {isPaused ? "▶ PLAY" : "⏸ PAUSE"}
          </button>
        </div>
      </div>
    </div>
  );
}
