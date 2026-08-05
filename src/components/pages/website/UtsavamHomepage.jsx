import React, { useEffect, useRef, useState } from "react";
// Bootstrap must be installed in the host project: npm install bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../app.css";

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
   Small inline icon set (kept local so there's no extra
   icon-library dependency beyond React + Bootstrap)
   ============================================================ */
const Icon = ({ path, size = 22, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    {path}
  </svg>
);

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

const EVOLUTION = [
  { oldLabel: "Paper Register", oldSub: "Handwritten, easy to misplace", newLabel: "Digital Records", newSub: "Searchable, always backed up",
    oldIcon: <path d="M6 3h9l3 3v15H6z M15 3v3h3 M9 12h6M9 16h6" />, newIcon: <path d="M4 3h16v18H4z M8 8h8M8 12h8M8 16h5" /> },
  { oldLabel: "Manual Receipts", oldSub: "Torn booklets, carbon copies", newLabel: "QR Receipts", newSub: "Instant, verifiable, shareable",
    oldIcon: <path d="M5 4h14v16l-3-2-2 2-2-2-2 2-2-2-3 2z" />, newIcon: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z M14 14h3v3h-3zM20 17v3h-3" /> },
  { oldLabel: "Notebook Accounts", oldSub: "Hours of manual tallying", newLabel: "Cloud Reports", newSub: "Live totals, one tap away",
    oldIcon: <path d="M4 4h16v16H4z M4 9h16M9 4v16" />, newIcon: <path d="M4 20V10M10 20V4M16 20v-7M4 20h16" /> },
  { oldLabel: "Manual Team Lists", oldSub: "WhatsApp threads, memory", newLabel: "Digital Team Management", newSub: "Roles, tasks, clear ownership",
    oldIcon: <path d="M9 8a3 3 0 100 6 3 3 0 000-6z M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />, newIcon: <path d="M8 8a3 3 0 100 6 3 3 0 000-6zM17 8a3 3 0 100 5 3 3 0 000-5z M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M13 15c3.5 0 6.2 2.4 6.6 5.6" /> },
];

const IMPACT_STATS = [
  { value: 1200, prefix: "", suffix: "+", label: "Connected Mandals" },
  { value: 3400, prefix: "", suffix: "+", label: "Festivals Managed" },
  { value: 86, prefix: "", suffix: "K+", label: "Donors Served" },
  { value: 210, prefix: "", suffix: "K+", label: "Receipts Generated" },
  { value: 40, prefix: "₹", suffix: "Cr+", label: "Donation Amount Managed" },
];

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

const TRUST = [
  { icon: "transparency", title: "Transparency", text: "Every donation and expense is visible to those who need to see it." },
  { icon: "security", title: "Security", text: "Encrypted end to end, with regular independent audits." },
  { icon: "storage", title: "Cloud Storage", text: "Nothing lives in a single notebook that could be lost or damaged." },
  { icon: "role", title: "Role Based Access", text: "Committee members see only what their responsibility calls for." },
  { icon: "reliable", title: "Reliable Reports", text: "Numbers your treasurer can hand over with full confidence." },
  { icon: "easy", title: "Easy Management", text: "Built simply enough that no training session is ever required." },
];

const TESTIMONIALS = [
  { quote: "Our treasurer used to spend the week after visarjan just tallying receipts by hand. This year that report was ready the same night.", name: "Sanjay Kulkarni", role: "Mandal President" },
  { quote: "Donors kept asking for proof their contribution was recorded. Now they get it on their phone before they've even walked away.", name: "Manisha Deshpande", role: "Treasurer" },
  { quote: "I finally know exactly which shift I'm on and who to call if I can't make it. No more chasing people on WhatsApp.", name: "Rohan Patil", role: "Volunteer" },
  { quote: "It felt good giving to a Mandal that could show me, in real numbers, exactly where the money was going.", name: "Aarti Joshi", role: "Donor" },
];

const FAQS = [
  { q: "Is UTSAVAM free for Mandals to join?", a: "Registering your Mandal and setting up your first festival is free. A small, transparent fee applies only on collected donations, shown to you before you ever accept it." },
  { q: "How do QR receipts actually work?", a: "Every donation generates a unique, verifiable QR code the donor can scan or save — no app required on their end, and no room for a receipt to be lost or disputed." },
  { q: "Is our donor and financial data secure?", a: "Yes. All records are encrypted in transit and at rest, backed up continuously, and access is limited to the roles your committee assigns." },
  { q: "Can multiple volunteers manage the same festival together?", a: "Absolutely. You can add as many committee members and volunteers as you need, each with access scoped to their specific responsibility." },
  { q: "Do we need technical experience to get started?", a: "Not at all. UTSAVAM is built to be understood in minutes — most Mandals are fully set up before their first committee meeting ends." },
];

const MANDAL_NAMES = [
  "Shree Ganesh Mitra Mandal", "Lokmanya Seva Mandal", "Sarvajanik Utsav Mandal",
  "Ganraj Mitra Mandal", "Ekta Sarvajanik Mandal", "Vighnaharta Mandal",
  "Navjeevan Mitra Mandal", "Om Ganesh Sarvajanik Mandal", "Sarvoday Mitra Mandal",
  "Shivneri Sarvajanik Mandal",
];

/* ============================================================
   Reveal-on-scroll wrapper (replaces AOS — no extra dependency)
   ============================================================ */
function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`u-reveal ${inView ? "u-in-view" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ============================================================
   Animated counter (used in the Festival Impact band)
   ============================================================ */
function Counter({ value, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const duration = 1400;
            const start = performance.now();
            function tick(now) {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setDisplay(Math.floor(eased * value));
              if (p < 1) requestAnimationFrame(tick);
              else setDisplay(value);
            }
            requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="u-num">
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* ============================================================
   Navbar
   ============================================================ */
function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#top", label: "Home" },
    { href: "#spirit", label: "About" },
    { href: "#features", label: "Features" },
    { href: "#journey", label: "Events" },
    { href: "#join", label: "Contact" },
  ];

  return (
    <>
      <nav className={`u-nav ${solid ? "u-nav-solid" : ""}`}>
        <div className="d-flex align-items-center justify-content-between">
          <a href="#top" className="u-brand">
            <BrandMark size={26} />
            UTSAVAM
          </a>

          <ul className="d-none d-lg-flex align-items-center gap-4 list-unstyled mb-0">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="u-nav-link">{l.label}</a>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-2">
            <a href="#" className="btn u-btn u-btn-ghost d-none d-lg-inline-flex rounded-pill">Sign In</a>
            <a href="#join" className="btn u-btn u-btn-primary rounded-pill px-4">Register Mandal</a>
            <button
              className="u-nav-toggle d-lg-none"
              aria-label="Toggle menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="u-nav-mobile d-lg-none">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="u-nav-link fs-5" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#" className="u-nav-link fs-5">Sign In</a>
        </div>
      )}
    </>
  );
}

function BrandMark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" stroke="url(#u-g1)" strokeWidth="2" />
      <path d="M16 9c-2 3-2 5 0 7 2-2 2-4 0-7z" fill="url(#u-g1)" />
      <path d="M11 20c1.6-2.4 3.2-3.6 5-3.6s3.4 1.2 5 3.6" stroke="url(#u-g1)" strokeWidth="1.6" strokeLinecap="round" />
      <defs>
        <linearGradient id="u-g1" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#DD7A3E" /><stop offset="1" stopColor="#A63E2E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ============================================================
   Marigold thread divider — the page's signature element
   ============================================================ */
function MarigoldThread() {
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

/* ============================================================
   Hero
   ============================================================ */
function Hero() {
  const fieldRef = useRef(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.innerHTML = "";
    for (let i = 0; i < 16; i++) {
      const d = document.createElement("div");
      d.className = "u-diya";
      d.style.left = Math.random() * 100 + "%";
      d.style.top = 15 + Math.random() * 70 + "%";
      d.style.animationDelay = `${Math.random() * 4}s, ${Math.random() * 6}s`;
      field.appendChild(d);
    }
  }, []);

  return (
    <header className="u-hero" id="top">
      <div className="u-diya-field" ref={fieldRef} />
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <Reveal>
              <div className="u-hero-badge">
                <span className="u-dot" /> Built exclusively for Ganesh Mandals
              </div>
              <h1 className="u-font-display">
                Where <em>Tradition</em>
                <br />
                Meets Technology
              </h1>
              <p className="u-hero-sub">
                UTSAVAM helps your Mandal manage donations, receipts, volunteers and celebrations —
                with the same trust and transparency your community has carried forward for generations.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <a href="#join" className="btn u-btn u-btn-primary rounded-pill px-4 py-3">Register Your Mandal</a>
                <a href="#features" className="btn u-btn u-btn-outline rounded-pill px-4 py-3">Explore UTSAVAM</a>
              </div>
              <div className="u-hero-trust">
                <div><span className="u-num">1,200+</span><span className="u-lbl">Connected Mandals</span></div>
                <div><span className="u-num">₹40Cr+</span><span className="u-lbl">Donations Managed</span></div>
                <div><span className="u-num">98%</span><span className="u-lbl">Would Recommend</span></div>
              </div>
            </Reveal>
          </div>

          <div className="col-lg-6">
            <Reveal delay={150}>
              <div className="u-hero-media">
                <img
                  src={HERO_IMAGE}
                  alt="A beautifully decorated Ganesh idol at a community Ganesh Chaturthi celebration"
                  loading="eager"
                />
                <div className="u-hero-frame" />
                <span className="u-hero-credit"></span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   Spirit of Ganesh Utsav
   ============================================================ */
function Spirit() {
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

/* ============================================================
   Tradition Meets Technology
   ============================================================ */
function Evolution() {
  return (
    <section className="u-section" style={{ background: "var(--ivory)" }}>
      <div className="container">
        <Reveal>
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 620 }}>
            <div className="u-eyebrow justify-content-center">Tradition Meets Technology</div>
            <h2 className="u-title mx-auto">The same trust, carried forward.</h2>
            <p className="u-sub mx-auto">
              Nothing about your process needs to feel unfamiliar. UTSAVAM simply carries what
              already works onto a foundation that's easier to trust, search and share.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          {EVOLUTION.map((row) => (
            <div className="u-evo-row" key={row.oldLabel}>
              <div className="u-evo-side u-old">
                <div>
                  <span className="u-evo-label">{row.oldLabel}</span>
                  <div className="u-evo-sub">{row.oldSub}</div>
                </div>
                <div className="u-evo-icon"><Icon path={row.oldIcon} size={20} stroke="#2A241E" /></div>
              </div>
              <div className="u-evo-arrow">
                <Icon path={<path d="M4 12h15M13 6l6 6-6 6" />} size={24} />
              </div>
              <div className="u-evo-side u-new">
                <div className="u-evo-icon"><Icon path={row.newIcon} size={20} stroke="#DD7A3E" /></div>
                <div>
                  <span className="u-evo-label">{row.newLabel}</span>
                  <div className="u-evo-sub">{row.newSub}</div>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   Everything Your Mandal Needs
   ============================================================ */
function Features() {
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

/* ============================================================
   Festival Impact
   ============================================================ */
function Impact() {
  return (
    <section className="u-section" style={{ paddingBottom: 110 }}>
      <div className="container">
        <Reveal>
          <div className="u-impact">
            <div className="u-impact-head">
              <div className="u-eyebrow u-eyebrow-light">Festival Impact</div>
              <h2>Numbers that build trust, not just look impressive.</h2>
              <p>Every figure below reflects real Mandals choosing transparency over guesswork.</p>
            </div>
            <div className="row g-4 position-relative">
              {IMPACT_STATS.map((s) => (
                <div className="col-6 col-lg" key={s.label}>
                  <div className="u-stat">
                    <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                    <div className="u-lbl">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   Journey of UTSAVAM
   ============================================================ */
function Journey() {
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

/* ============================================================
   Experience UTSAVAM (device mockups)
   ============================================================ */
function Experience() {
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

/* ============================================================
   Why Mandals Trust UTSAVAM
   ============================================================ */
function Trust() {
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

/* ============================================================
   Connected Mandals (marquee)
   ============================================================ */
function ConnectedMandals() {
  const row1 = [...MANDAL_NAMES, ...MANDAL_NAMES];
  const row2 = [...MANDAL_NAMES].reverse();
  const row2dup = [...row2, ...row2];

  const Chip = ({ name }) => (
    <div className="u-mandal-chip">
      <span className="u-mandal-badge">{name.charAt(0)}</span>
      {name}
    </div>
  );

  return (
    <section className="u-section" style={{ background: "var(--warm-white)" }}>
      <div className="container">
        <Reveal>
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 620 }}>
            <div className="u-eyebrow justify-content-center">Connected Mandals</div>
            <h2 className="u-title mx-auto">Who already trusts UTSAVAM.</h2>
          </div>
        </Reveal>
      </div>
      <Reveal delay={60}>
        <div className="u-marquee-row">
          <div className="u-marquee">{row1.map((n, i) => <Chip name={n} key={i} />)}</div>
        </div>
        <div className="u-marquee-row u-reverse">
          <div className="u-marquee">{row2dup.map((n, i) => <Chip name={n} key={i} />)}</div>
        </div>
      </Reveal>
    </section>
  );
}

/* ============================================================
   Testimonials
   ============================================================ */
function Testimonials() {
  return (
    <section className="u-section" style={{ background: "var(--ivory)" }}>
      <div className="container">
        <Reveal>
          <div className="mb-5" style={{ maxWidth: 620 }}>
            <div className="u-eyebrow">Community Voices</div>
            <h2 className="u-title">What Mandals say, in their own words.</h2>
          </div>
        </Reveal>
        <div className="row g-4">
          {TESTIMONIALS.map((t, i) => (
            <div className="col-6 col-lg-3" key={t.name}>
              <Reveal delay={(i % 4) * 60}>
                <div className="u-test-card">
                  <p className="u-test-quote">{t.quote}</p>
                  <div className="u-test-person">
                    <div className="u-test-avatar">{t.name.charAt(0)}</div>
                    <div>
                      <div className="u-pname">{t.name}</div>
                      <div className="u-prole">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FAQ (Bootstrap accordion primitives, controlled in React)
   ============================================================ */
function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="u-section" style={{ background: "var(--warm-white)" }}>
      <div className="container">
        <Reveal>
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 620 }}>
            <div className="u-eyebrow justify-content-center">Frequently Asked Questions</div>
            <h2 className="u-title mx-auto">Everything you were about to ask.</h2>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="accordion u-accordion mx-auto" style={{ maxWidth: 760 }}>
            {FAQS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div className="accordion-item" key={item.q}>
                  <h3 className="accordion-header">
                    <button
                      className={`accordion-button ${isOpen ? "" : "collapsed"}`}
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    >
                      <span className="flex-grow-1 text-start">{item.q}</span>
                      <span className="u-plus" />
                    </button>
                  </h3>
                  <div className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}>
                    <div className="accordion-body">
                      <p className="mb-0">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   Join / Contact
   ============================================================ */
function Join() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="u-section" id="join" style={{ paddingTop: 0 }}>
      <div className="container">
        <Reveal>
          <div className="u-join">
            <div className="row g-0">
              <div className="col-lg-6">
                <div className="u-join-copy">
                  <div className="u-eyebrow u-eyebrow-light">Join UTSAVAM</div>
                  <h2>Bring your Mandal into the UTSAVAM community.</h2>
                  <p>Tell us a little about your Mandal, and our team will help you get set up before your next festival.</p>
                  <div className="u-join-points">
                    <div className="u-jp"><Icon path={icons.check} size={18} /> Free to register, no obligation</div>
                    <div className="u-jp"><Icon path={icons.check} size={18} /> Guided setup with our team</div>
                    <div className="u-jp"><Icon path={icons.check} size={18} /> Live before your next event</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <form className="u-join-form" onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label className="form-label">Mandal Name</label>
                      <input type="text" className="form-control" placeholder="e.g. Shree Ganesh Mitra Mandal" required />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Contact Person</label>
                      <input type="text" className="form-control" placeholder="Full name" required />
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label className="form-label">Phone</label>
                      <input type="tel" className="form-control" placeholder="+91 00000 00000" required />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" placeholder="you@example.com" required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea className="form-control" rows="3" placeholder="Tell us a little about your Mandal" />
                  </div>
                  <button type="submit" className="btn u-btn u-btn-primary rounded-pill w-100 py-3">
                    {submitted ? "Request Received ✓" : "Join the Community"}
                  </button>
                  <p className="u-form-note">We'll get back to you within one business day.</p>
                </form>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   Footer
   ============================================================ */
function Footer() {
  return (
    <footer className="u-footer">
      <div className="container">
        <div className="row g-5 u-footer-top">
          <div className="col-6 col-lg-4">
            <div className="u-footer-brand"><BrandMark size={24} /> UTSAVAM</div>
            <p className="u-footer-tag">The digital home for Ganesh Mandals — built with respect for the tradition it serves.</p>
          </div>
          <div className="col-6 col-lg-2 u-footer-col">
            <h5>Navigate</h5>
            <ul>
              <li><a href="#top">Home</a></li>
              <li><a href="#spirit">About</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#journey">Events</a></li>
            </ul>
          </div>
          <div className="col-6 col-lg-3 u-footer-col">
            <h5>Platform</h5>
            <ul>
              <li><a href="#features">Donations</a></li>
              <li><a href="#features">QR Receipts</a></li>
              <li><a href="#">Reports</a></li>
              <li><a href="#">Security</a></li>
            </ul>
          </div>
          <div className="col-6 col-lg-3 u-footer-col">
            <h5>Contact</h5>
            <ul>
              <li><a href="#join">Register your Mandal</a></li>
              <li><a href="mailto:hello@utsavam.in">hello@utsavam.in</a></li>
              <li><a href="tel:+910000000000">+91 00000 00000</a></li>
            </ul>
          </div>
        </div>
        <div className="u-footer-bottom">
          <span className="u-footer-copy">© 2026 UTSAVAM. Built with pride for Ganesh Utsav.</span>
          <div className="u-footer-social">
            <a href="#" aria-label="Instagram"><Icon path={<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></>} size={16} /></a>
            <a href="#" aria-label="Facebook"><Icon path={<path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.5.5-1 1-1z" />} size={16} /></a>
            <a href="#" aria-label="YouTube"><Icon path={<><rect x="2" y="6" width="20" height="12" rx="3" /><path d="M10 9.5l5 2.5-5 2.5z" /></>} size={16} /></a>
          </div>
        </div>
        <p className="u-footer-closing">"Tradition inspires us. Technology empowers us. Together, we celebrate."</p>
      </div>
    </footer>
  );
}

/* ============================================================
   Root component
   ============================================================ */
export default function UtsavamHomepage() {
  useEffect(() => {
    document.body.classList.add("u-body");
    return () => document.body.classList.remove("u-body");
  }, []);

  return (
    <div className="u-page">
      <Navbar />
      <Hero />
      <MarigoldThread />
      <Spirit />
      <Evolution />
      <Features />
      <Impact />
      <Journey />
      <Experience />
      <Trust />
      <ConnectedMandals />
      <Testimonials />
      <FAQ />
      <Join />
      <Footer />
    </div>
  );
}