import Reveal from './Reveal';
import Icon from './Icon';

/* ============================================================
   Join / Contact
   ============================================================ */

import { useState } from "react";

   
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

const Join = () => {
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

export default Join;