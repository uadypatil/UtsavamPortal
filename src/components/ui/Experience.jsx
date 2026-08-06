import { useState } from "react";
import Reveal from './Reveal';


/* ============================================================
   Experience UTSAVAM (device mockups)
   ============================================================ */
const Experience = () => {
  const [device, setDevice] = useState("desktop");
  return (
    <section className="u-section" style={{ background: "var(--ivory)" }}>
      <div className="container">
        <Reveal>
          <div className="text-center mx-auto mb-4" style={{ maxWidth: 620 }}>
            <div className="u-eyebrow justify-content-center">Experience UTSAVAM</div>
            <h2 className="u-title mx-auto">A dashboard as calm as the platform's promise.</h2>
            <p className="u-sub mx-auto">
              Everything your committee needs, presented without the clutter — on whichever screen
              you reach for first.
            </p>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="d-flex justify-content-center gap-2 mb-4">
            {["desktop", "tablet", "mobile"].map((d) => (
              <button
                key={d}
                className={`u-device-tab ${device === d ? "active" : ""}`}
                onClick={() => setDevice(d)}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className={`u-device-frame ${device !== "desktop" ? `u-${device}` : ""}`}>
            <div className="u-mock-topbar">
              <div className="u-mock-dots"><span /><span /><span /></div>
              <div style={{ fontFamily: "var(--font-data)", fontSize: 11, color: "var(--charcoal-40)" }}>
                UTSAVAM Dashboard
              </div>
            </div>
            <div className="u-mock-body">
              <div className="u-mock-side">
                <div className="u-mock-pill active" style={{ width: "70%" }} />
                <div className="u-mock-pill" style={{ width: "55%" }} />
                <div className="u-mock-pill" style={{ width: "60%" }} />
                <div className="u-mock-pill" style={{ width: "45%" }} />
                <div className="u-mock-pill" style={{ width: "65%" }} />
              </div>
              <div className="u-mock-main">
                <div className="u-mock-card">
                  <div className="u-mock-num">₹4.2L</div>
                  <div className="u-mock-line" style={{ width: "80%" }} />
                  <div className="u-mock-line" />
                </div>
                <div className="u-mock-card">
                  <div className="u-mock-num">312</div>
                  <div className="u-mock-line" style={{ width: "80%" }} />
                  <div className="u-mock-line" />
                </div>
                <div className="u-mock-chart">
                  {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
                    <i key={i} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Experience;