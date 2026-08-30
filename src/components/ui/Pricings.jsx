import Reveal from "./Reveal";
import Icon from "./Icon";

/* ============================================================
   Pricing
   ============================================================ */

const PRICING_PLANS = [
  {
    name: "Base",
    description: "For a single Mandal running one collection point.",

    price: "67",
    currency: "₹",
    period: "/month",

    billing: "Billed as ₹799 once a year — no recurring auto-debit.",

    features: [
      "1 Organizer admin account",
      "Up to 2 Donation Collector seats",
      "Unlimited digital receipts during season",
      "QR-based receipt retrieval",
      "12 months of reports & data access",
      "Email support",
    ],

    note: (
      <>
        <strong>3 months</strong> active season for new receipts,{" "}
        <strong>12 months</strong> of data & reports access.
      </>
    ),
  },
];

const CheckIcon = () => (
  <Icon path={<path d="M5 12l4 4L19 6" />} size={17} stroke="#DD7A3E" />
);

const Pricings = () => {
  return (
    <section className="u-section" id="pricing" style={{ paddingBottom: 110 }}>
      <div className="container">
        {/* =====================================================
            Header
        ====================================================== */}

        <Reveal>
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 700 }}>
            <div className="u-eyebrow justify-content-center">Pricing</div>

            <h2 className="u-title mx-auto">Simple, seasonal pricing</h2>

            <p className="u-sub mx-auto">
              One upfront payment for the full festival season — no auto-debit
              to manage.
            </p>
          </div>
        </Reveal>

        {/* =====================================================
            Pricing Card
        ====================================================== */}

        <Reveal delay={100}>
          <div
            className="mx-auto"
            style={{
              maxWidth: 855,
              border: "1px solid rgba(42, 36, 30, 0.12)",
              borderRadius: 26,
              padding: "34px 32px 30px",
              background: "#fff",
            }}
          >
            {PRICING_PLANS.map((plan) => (
              <div key={plan.name}>
                {/* =================================================
                    Plan Header
                ================================================== */}

                <div className="mb-4">
                  <h3
                    className="mb-1"
                    style={{
                      fontSize: 21,
                      fontWeight: 700,
                      color: "#15110E",
                    }}
                  >
                    {plan.name}
                  </h3>

                  <p
                    className="mb-0"
                    style={{
                      color: "#716860",
                      fontSize: 15,
                    }}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* =================================================
                    Price
                ================================================== */}

                <div className="mb-4">
                  <div className="d-flex align-items-baseline">
                    <span
                      style={{
                        fontSize: 32,
                        fontWeight: 700,
                        color: "#15110E",
                        lineHeight: 1,
                      }}
                    >
                      {plan.currency}
                      {plan.price}
                    </span>

                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: "#716860",
                        marginLeft: 3,
                      }}
                    >
                      {plan.period}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#716860",
                      marginTop: 5,
                    }}
                  >
                    {plan.billing}
                  </div>
                </div>

                {/* =================================================
                    Features
                ================================================== */}

                <div className="mb-4">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="d-flex align-items-center gap-2 mb-3"
                    >
                      <CheckIcon />

                      <span
                        style={{
                          fontSize: 15,
                          color: "#2A241E",
                        }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* =================================================
                    Pricing Note
                ================================================== */}

                <div
                  className="mb-4"
                  style={{
                    background: "#F8F7F3",
                    borderRadius: 14,
                    padding: "13px 17px",
                    fontSize: 13,
                    color: "#716860",
                  }}
                >
                  {plan.note}
                </div>

                {/* =================================================
                    CTA
                ================================================== */}

                <a
                  href="/signin"
                  className="btn w-100 rounded-pill"
                  style={{
                    height: 50,
                    border: "1px solid rgba(42, 36, 30, 0.15)",
                    background: "#fff",
                    color: "#15110E",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  Choose Base
                </a>
              </div>
            ))}
          </div>
        </Reveal>

        {/* =====================================================
            Small reassurance
        ====================================================== */}

        <Reveal delay={180}>
          <div
            className="text-center mt-4"
            style={{
              fontSize: 13,
              color: "#81776F",
            }}
          >
            Built for Mandals that want simple, transparent festival management.
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Pricings;
