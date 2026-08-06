
import Icon from './Icon';
import BrandMark from './BrandMark';
/* ============================================================
   Footer
   ============================================================ */
const Footer = () => {
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

export default Footer;