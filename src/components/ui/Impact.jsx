import Reveal from './Reveal';
import Icon from './Icon';

/* ============================================================
   Built for What's Next
   ============================================================ */

const FUTURE_FEATURES = [
  {
    icon: (
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
    ),
    value: "100%",
    label: "Digital-first",
    sub: "From records to receipts",
  },
  {
    icon: (
      <path d="M4 6h16M4 12h16M4 18h16M8 6v12M16 6v12" />
    ),
    value: "01",
    label: "Unified platform",
    sub: "Everything in one place",
  },
  {
    icon: (
      <path d="M12 3l7 4v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V7l7-4zM9 12l2 2 4-4" />
    ),
    value: "Secure",
    label: "Role-based access",
    sub: "The right access, for every role",
  },
  {
    icon: (
      <path d="M4 12a8 8 0 1016 0 8 8 0 00-16 0zM12 8v4l3 2" />
    ),
    value: "Instant",
    label: "Digital receipts",
    sub: "Generate, verify and share",
  },
];

const Impact = () => {
  return (
    <section
      className="u-section"
      style={{ paddingBottom: 110 }}
    >
      <div className="container">

        <Reveal>
          <div className="u-impact">

            {/* Header */}
            <div className="u-impact-head">

              <div className="u-eyebrow u-eyebrow-light">
                Built for What's Next
              </div>

              <h2>
                A new standard for
                <br />
                <span>festival management.</span>
              </h2>

              <p>
                UTSAVAM is built to help Mandals move from scattered
                records and manual processes to a smarter, more
                transparent digital experience.
              </p>

            </div>

            {/* Futuristic Feature Grid */}
            <div className="row g-4 position-relative">

              {FUTURE_FEATURES.map((item, index) => (
                <div
                  className="col-6 col-lg-3"
                  key={item.label}
                >
                  <div className="u-stat h-100">

                    {/* Icon */}
                    <div
                      className="mb-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.04)",
                      }}
                    >
                      <Icon
                        path={item.icon}
                        size={21}
                        stroke="#DD7A3E"
                      />
                    </div>

                    {/* Main value */}
                    <div className="u-stat-value">
                      {item.value}
                    </div>

                    {/* Label */}
                    <div className="u-lbl">
                      {item.label}
                    </div>

                    {/* Description */}
                    <div
                      className="mt-2"
                      style={{
                        fontSize: 13,
                        opacity: 0.6,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.sub}
                    </div>

                  </div>
                </div>
              ))}

            </div>

            {/* Launch indicator */}
            <div
              className="mt-5 pt-4 text-center"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="d-inline-flex align-items-center gap-2"
                style={{
                  fontSize: 13,
                  opacity: 0.7,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#DD7A3E",
                    boxShadow: "0 0 10px rgba(221,122,62,0.7)",
                  }}
                />

                UTSAVAM is now live
              </div>
            </div>

          </div>
        </Reveal>

      </div>
    </section>
  );
};

export default Impact;
