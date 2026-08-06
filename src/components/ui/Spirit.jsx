
import Reveal from './Reveal';
/* ============================================================
   Spirit of Ganesh Utsav
   ============================================================ */
const Spirit = () => {
  const values = [
    { n: "01", h: "Community", p: "Ganesh Utsav belongs to everyone who shows up — not to any one committee or office." },
    { n: "02", h: "Unity & Volunteers", p: "Every pandal runs on people who give their evenings freely, year after year." },
    { n: "03", h: "Devotion & Tradition", p: "Rituals passed down through generations deserve to be carried forward, not digitised away." },
    { n: "04", h: "Social Service", p: "Behind the festivities, most Mandals quietly fund scholarships, blood drives and relief work." },
  ];
  return (
    <section className="u-section" id="spirit" style={{ background: "var(--warm-white)" }}>
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-6">
            <Reveal>
              <div className="u-eyebrow">The Spirit of Ganesh Utsav</div>
              <h2 className="u-title">Why this platform exists at all.</h2>
              <p className="u-sub" style={{ maxWidth: 460 }}>
                Long before receipts and reports, Ganesh Utsav has been about people showing up for
                each other — carrying idols on their shoulders, organising rounds of collection on
                foot, and staying up late counting donations by lamplight. UTSAVAM exists to hold
                that spirit, not replace it — quietly taking the paperwork off your Mandal's
                shoulders so more energy goes into the celebration itself.
              </p>
            </Reveal>
          </div>
          <div className="col-lg-6">
            <Reveal delay={100}>
              {values.map((v) => (
                <div className="u-value-row" key={v.n}>
                  <span className="u-vnum">{v.n}</span>
                  <div><h4>{v.h}</h4><p>{v.p}</p></div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Spirit;