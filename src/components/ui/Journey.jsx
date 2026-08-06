import Reveal from './Reveal';

/* ============================================================
   Journey of UTSAVAM
   ============================================================ */

const JOURNEY = [
  { title: "Register", text: "Create your Mandal's profile in a few minutes." },
  { title: "Approval", text: "Verified quickly to keep the platform trustworthy." },
  { title: "Setup Festival", text: "Add dates, rituals and this year's theme." },
  { title: "Create Team", text: "Bring in volunteers and assign their roles." },
  { title: "Collect Donations", text: "Accept contributions online and on the ground." },
  { title: "Generate QR Receipts", text: "Every donor gets an instant, verifiable receipt." },
  { title: "View Reports", text: "Track totals live, no manual tallying needed." },
  { title: "Celebrate Successfully", text: "Focus on the festival — UTSAVAM handles the rest." },
];

const Journey = () => {
  return (
    <section className="u-section" id="journey" style={{ background: "var(--warm-white)" }}>
      <div className="container">
        <Reveal>
          <div className="mb-5" style={{ maxWidth: 620 }}>
            <div className="u-eyebrow">The Journey of UTSAVAM</div>
            <h2 className="u-title">From registration to celebration.</h2>
            <p className="u-sub">
              A clear, guided path — the same eight steps every Mandal follows, from the first
              sign-up to the final report.
            </p>
          </div>
        </Reveal>
        <div className="row g-4 row-cols-2 row-cols-md-4">
          {JOURNEY.map((step, i) => (
            <div className="col" key={step.title}>
              <Reveal delay={(i % 4) * 60}>
                <div className="u-tl-step">
                  <div className="u-tl-num">{String(i + 1).padStart(2, "0")}</div>
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Journey;