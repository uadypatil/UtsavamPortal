

/* ============================================================
   Marigold thread divider — the page's signature element
   ============================================================ */
const MarigoldThread = () => {
  const buds = [60, 180, 300, 420, 540, 660, 780, 900, 1020, 1140];
  return (
    <div className="container">
      <div className="u-thread" aria-hidden="true">
        <svg viewBox="0 0 1180 64" preserveAspectRatio="none">
          <path
            d="M0 32 Q 60 4, 120 32 T 240 32 T 360 32 T 480 32 T 600 32 T 720 32 T 840 32 T 960 32 T 1080 32 T 1200 32"
            stroke="var(--hairline)" strokeWidth="1.5" fill="none"
          />
          <g fill="#C79A44">
            {buds.map((x, i) => (
              <circle key={x} className="u-bud" cx={x} cy={i % 2 === 0 ? 18 : 46} r="4" />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

export default MarigoldThread;