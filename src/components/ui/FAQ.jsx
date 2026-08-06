import { useState } from "react";
import Reveal from './Reveal';

/* ============================================================
   FAQ (Bootstrap accordion primitives, controlled in React)
   ============================================================ */
   
   const FAQS = [
     { q: "Is UTSAVAM free for Mandals to join?", a: "Registering your Mandal and setting up your first festival is free. A small, transparent fee applies only on collected donations, shown to you before you ever accept it." },
     { q: "How do QR receipts actually work?", a: "Every donation generates a unique, verifiable QR code the donor can scan or save — no app required on their end, and no room for a receipt to be lost or disputed." },
     { q: "Is our donor and financial data secure?", a: "Yes. All records are encrypted in transit and at rest, backed up continuously, and access is limited to the roles your committee assigns." },
     { q: "Can multiple volunteers manage the same festival together?", a: "Absolutely. You can add as many committee members and volunteers as you need, each with access scoped to their specific responsibility." },
     { q: "Do we need technical experience to get started?", a: "Not at all. UTSAVAM is built to be understood in minutes — most Mandals are fully set up before their first committee meeting ends." },
   ];
const FAQ = () => {
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

export default FAQ;