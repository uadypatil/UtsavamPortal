import Reveal from './Reveal';
import Icon from './Icon';


/* ============================================================
   Everything Your Mandal Needs
   ============================================================ */
   
/* ============================================================
   Content — the site's copy and data, kept separate from markup
   ============================================================ */
const FEATURES = [
  { icon: "festival", title: "Festival Management", text: "Plan rituals, schedules and logistics for every day of the utsav in one calendar." },
  { icon: "donation", title: "Donations", text: "Collect contributions online or in person, with every rupee tracked to a name." },
  { icon: "qr", title: "QR Receipts", text: "Every donor gets an instant, verifiable receipt they can trust and keep." },
  { icon: "reports", title: "Reports", text: "Real-time, printable summaries — ready whenever your committee needs them." },
  { icon: "volunteers", title: "Volunteers", text: "Assign roles and shifts so every helper knows exactly where to be." },
  { icon: "analytics", title: "Analytics", text: "See collection trends and turnout patterns to plan next year with clarity." },
  { icon: "users", title: "User Management", text: "Give committee members exactly the access their role needs — no more, no less." },
  { icon: "cloud", title: "Cloud Security", text: "Bank-grade encryption keeps every record and receipt safe, always." },
];



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



const Features = () => {
  return (
    <section className="u-section" id="features" style={{ background: "var(--warm-white)" }}>
      <div className="container">
        <Reveal>
          <div className="mb-5" style={{ maxWidth: 620 }}>
            <div className="u-eyebrow">Everything Your Mandal Needs</div>
            <h2 className="u-title">One ecosystem, not a stack of tools.</h2>
            <p className="u-sub">
              Every part of running a festival, held together in one place — so your team spends
              less time coordinating and more time celebrating.
            </p>
          </div>
        </Reveal>
        <div className="row g-4">
          {FEATURES.map((f, i) => (
            <div className="col-6 col-lg-3" key={f.title}>
              <Reveal delay={(i % 4) * 60}>
                <div className="u-card">
                  <div className="u-icon"><Icon path={icons[f.icon]} /></div>
                  <h4>{f.title}</h4>
                  <p>{f.text}</p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export default Features;