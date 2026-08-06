import Reveal from './Reveal';
import Icon from './Icon';



/* ============================================================
   Why Mandals Trust UTSAVAM
   ============================================================ */
   
const icons = {
  festival: <path d="M3 5h18v16H3zM3 10h18M8 3v4M16 3v4" />,
  donation: <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 6.5 5.5 5.5 0 0121.5 12c-2.5 4.5-9.5 9-9.5 9z" />,
  qr: <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM21 17.5V21h-3.5" />,
  reports: <path d="M4 19V9M10 19V4M16 19v-6M4 19h16" />,
  volunteers: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M14 15.5c2.8.3 5 2.4 5.3 5" /></>,
  analytics: <><path d="M3 17l5-5 4 4 8-9" /><path d="M15 7h5v5" /></>,
  users: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" /><path d="M9 8h6" /></>,
  cloud: <><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  transparency: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  security: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />,
  storage: <path d="M7 18a4 4 0 010-8 5 5 0 019.6-1.5A4.5 4.5 0 0118 18H7z" />,
  role: <><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></>,
  reliable: <><path d="M4 19V9M10 19V4M16 19v-6M4 19h16" /><path d="M9 8l1.5 1.5L14 6" /></>,
  easy: <><path d="M4 5h16M4 12h16M4 19h10" /><circle cx="19" cy="19" r="2" /></>,
  check: <path d="M20 6L9 17l-5-5" />,
};


const TRUST = [
  { icon: "transparency", title: "Transparency", text: "Every donation and expense is visible to those who need to see it." },
  { icon: "security", title: "Security", text: "Encrypted end to end, with regular independent audits." },
  { icon: "storage", title: "Cloud Storage", text: "Nothing lives in a single notebook that could be lost or damaged." },
  { icon: "role", title: "Role Based Access", text: "Committee members see only what their responsibility calls for." },
  { icon: "reliable", title: "Reliable Reports", text: "Numbers your treasurer can hand over with full confidence." },
  { icon: "easy", title: "Easy Management", text: "Built simply enough that no training session is ever required." },
];


const Trust = () => {
  return (
    <section className="u-section" style={{ background: "var(--warm-white)" }}>
      <div className="container">
        <Reveal>
          <div className="mb-5" style={{ maxWidth: 620 }}>
            <div className="u-eyebrow">Why Mandals Trust UTSAVAM</div>
            <h2 className="u-title">Trust, built the slow, careful way.</h2>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="row g-0 border rounded-4 overflow-hidden" style={{ borderColor: "var(--hairline-soft)" }}>
            {TRUST.map((t, i) => (
              <div
                className="col-12 col-sm-6 col-lg-4 border-end border-bottom"
                style={{ borderColor: "var(--hairline-soft)" }}
                key={t.title}
              >
                <div className="u-trust-card">
                  <div className="u-icon"><Icon path={icons[t.icon]} /></div>
                  <h4>{t.title}</h4>
                  <p>{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Trust;