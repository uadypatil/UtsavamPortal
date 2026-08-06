import Reveal from './Reveal';


/* ============================================================
   Testimonials
   ============================================================ */
   
const TESTIMONIALS = [
  { quote: "Our treasurer used to spend the week after visarjan just tallying receipts by hand. This year that report was ready the same night.", name: "Sanjay Kulkarni", role: "Mandal President" },
  { quote: "Donors kept asking for proof their contribution was recorded. Now they get it on their phone before they've even walked away.", name: "Manisha Deshpande", role: "Treasurer" },
  { quote: "I finally know exactly which shift I'm on and who to call if I can't make it. No more chasing people on WhatsApp.", name: "Rohan Patil", role: "Volunteer" },
  { quote: "It felt good giving to a Mandal that could show me, in real numbers, exactly where the money was going.", name: "Aarti Joshi", role: "Donor" },
];

const Testimonials = () => {
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

export default Testimonials;