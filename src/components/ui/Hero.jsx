import { useEffect, useRef } from "react";
import Reveal from "./Reveal";
import { usePWAInstall } from "../../hooks/usePWAInstall";

/* ============================================================
   Hero image credit
   "Ganpati at Pune.JPG" by Yoursamrut — Wikimedia Commons
   Licensed CC BY-SA 4.0. Swap HERO_IMAGE for your own Mandal's
   photography whenever you have it — the manifesto's own
   preference is real photos over stock.
   ============================================================ */

const HERO_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Ganpati_at_Pune.JPG";

/* ============================================================
   Hero
   ============================================================ */

const Hero = () => {
  const fieldRef = useRef(null);

  const {
    canInstall,
    isInstalled,
    install,
  } = usePWAInstall();

  /* ============================================================
     Diya animation
     ============================================================ */

  useEffect(() => {
    const field = fieldRef.current;

    if (!field) return;

    field.innerHTML = "";

    for (let i = 0; i < 16; i++) {
      const d = document.createElement("div");

      d.className = "u-diya";

      d.style.left = Math.random() * 100 + "%";
      d.style.top = 15 + Math.random() * 70 + "%";

      d.style.animationDelay = `${Math.random() * 4}s, ${
        Math.random() * 6
      }s`;

      field.appendChild(d);
    }
  }, []);

  /* ============================================================
     PWA Installation
     ============================================================ */

  const handleDownload = async () => {
    if (!canInstall) {
      alert(
        "UTSAVAM is not currently available for installation. Please open this website in Chrome or Edge and try again."
      );

      return;
    }

    await install();
  };

  return (
    <header className="u-hero" id="top">
      {/* Floating diyas */}
      <div
        className="u-diya-field"
        ref={fieldRef}
      />

      <div className="container">
        <div className="row align-items-center g-5">

          {/* =====================================================
              Hero Content
          ====================================================== */}

          <div className="col-lg-6">
            <Reveal>
              <div className="u-hero-badge">
                <span className="u-dot" />
                Built exclusively for Ganesh Mandals
              </div>

              <h1 className="u-font-display">
                Where <em>Tradition</em>
                <br />
                Meets Technology
              </h1>

              <p className="u-hero-sub">
                UTSAVAM helps your Mandal manage donations, receipts,
                volunteers and celebrations — with the same trust and
                transparency your community has carried forward for
                generations.
              </p>

              {/* =================================================
                  Hero Buttons
              ================================================== */}

              <div className="d-flex flex-wrap gap-3">

                {/* Register Mandal */}
                <a
                  href="/signin"
                  className="btn u-btn u-btn-primary rounded-pill px-4 py-3"
                >
                  Portal Login
                </a>

                {/* Download / Install PWA */}
                {!isInstalled && (
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="btn u-btn u-btn-outline rounded-pill px-4 py-3"
                  >
                    <i className="bi bi-download me-2" />
                    Download UTSAVAM
                  </button>
                )}

              </div>

              {/* =================================================
                  Hero Trust Statistics
              ================================================== */}

              <div className="u-hero-trust">
                <div>
                  <span className="u-num">
                    1,200+
                  </span>

                  <span className="u-lbl">
                    Connected Mandals
                  </span>
                </div>

                <div>
                  <span className="u-num">
                    ₹40Cr+
                  </span>

                  <span className="u-lbl">
                    Donations Managed
                  </span>
                </div>

                <div>
                  <span className="u-num">
                    98%
                  </span>

                  <span className="u-lbl">
                    Would Recommend
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* =====================================================
              Hero Image
          ====================================================== */}

          <div className="col-lg-6">
            <Reveal delay={150}>
              <div className="u-hero-media">
                <img
                  src={HERO_IMAGE}
                  alt="A beautifully decorated Ganesh idol at a community Ganesh Chaturthi celebration"
                  loading="eager"
                />

                <div className="u-hero-frame" />

                <span className="u-hero-credit" />
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Hero;
