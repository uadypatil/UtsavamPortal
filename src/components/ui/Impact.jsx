import Reveal from './Reveal';
import Counter from './Counter';

/* ============================================================
   Festival Impact
   ============================================================ */
   

const IMPACT_STATS = [
  { value: 1200, prefix: "", suffix: "+", label: "Connected Mandals" },
  { value: 3400, prefix: "", suffix: "+", label: "Festivals Managed" },
  { value: 86, prefix: "", suffix: "K+", label: "Donors Served" },
  { value: 210, prefix: "", suffix: "K+", label: "Receipts Generated" },
  { value: 40, prefix: "₹", suffix: "Cr+", label: "Donation Amount Managed" },
];

const Impact = () => {
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

export default Impact;