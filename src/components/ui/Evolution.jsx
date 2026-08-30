import Reveal from './Reveal';
import Icon from './Icon';

/* ============================================================
   Tradition Meets Technology
   ============================================================ */

const EVOLUTION = [
  {
    oldLabel: "Paper Register",
    oldSub: "Handwritten records, difficult to search",
    newLabel: "Digital Records",
    newSub: "Organised, searchable and secure",
    oldIcon: (
      <path d="M6 3h9l3 3v15H6z M15 3v3h3 M9 12h6M9 16h6" />
    ),
    newIcon: (
      <path d="M4 3h16v18H4z M8 8h8M8 12h8M8 16h5" />
    ),
  },

  {
    oldLabel: "Manual Receipts",
    oldSub: "Paper slips and carbon copies",
    newLabel: "Digital Receipts",
    newSub: "Instant, verifiable and shareable",
    oldIcon: (
      <path d="M5 4h14v16l-3-2-2 2-2-2-2 2-2-2-3 2z" />
    ),
    newIcon: (
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z M14 14h3v3h-3zM20 17v3h-3" />
    ),
  },

  {
    oldLabel: "Notebook Accounts",
    oldSub: "Hours spent on manual calculations",
    newLabel: "Digital Reports",
    newSub: "Clear totals and reports in seconds",
    oldIcon: (
      <path d="M4 4h16v16H4z M4 9h16M9 4v16" />
    ),
    newIcon: (
      <path d="M4 20V10M10 20V4M16 20v-7M4 20h16" />
    ),
  },

  {
    oldLabel: "Manual Team Lists",
    oldSub: "Scattered lists and unclear ownership",
    newLabel: "Team Management",
    newSub: "Roles, responsibilities and ownership",
    oldIcon: (
      <path d="M9 8a3 3 0 100 6 3 3 0 000-6z M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    ),
    newIcon: (
      <path d="M8 8a3 3 0 100 6 3 3 0 000-6zM17 8a3 3 0 100 5 3 3 0 000-5z M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M13 15c3.5 0 6.2 2.4 6.6 5.6" />
    ),
  },
];

const Evolution = () => {
  return (
    <section
      className="u-section"
      style={{ background: "var(--ivory)" }}
    >
      <div className="container">

        <Reveal>
          <div
            className="text-center mx-auto mb-5"
            style={{ maxWidth: 620 }}
          >
            <div className="u-eyebrow justify-content-center">
              Tradition Meets Technology
            </div>

            <h2 className="u-title mx-auto">
              The same trust, carried forward.
            </h2>

            <p className="u-sub mx-auto">
              UTSAVAM doesn't replace the way you work. It simply makes
              familiar processes easier to manage, easier to find and
              easier to trust — bringing traditional record keeping into
              the digital age.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          {EVOLUTION.map((row) => (
            <div className="u-evo-row" key={row.oldLabel}>

              {/* Traditional */}
              <div className="u-evo-side u-old">
                <div>
                  <span className="u-evo-label">
                    {row.oldLabel}
                  </span>

                  <div className="u-evo-sub">
                    {row.oldSub}
                  </div>
                </div>

                <div className="u-evo-icon">
                  <Icon
                    path={row.oldIcon}
                    size={20}
                    stroke="#2A241E"
                  />
                </div>
              </div>

              {/* Arrow */}
              <div className="u-evo-arrow">
                <Icon
                  path={
                    <path d="M4 12h15M13 6l6 6-6 6" />
                  }
                  size={24}
                />
              </div>

              {/* UTSAVAM */}
              <div className="u-evo-side u-new">
                <div className="u-evo-icon">
                  <Icon
                    path={row.newIcon}
                    size={20}
                    stroke="#DD7A3E"
                  />
                </div>

                <div>
                  <span className="u-evo-label">
                    {row.newLabel}
                  </span>

                  <div className="u-evo-sub">
                    {row.newSub}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </Reveal>

      </div>
    </section>
  );
};

export default Evolution;
