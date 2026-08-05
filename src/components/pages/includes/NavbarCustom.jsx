import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import logo from "../../../assets/utsavamLogoCircle.png";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Events", to: "/events" },
  { label: "Guidelines", to: "/guidelines" },
];

function NavbarCustom() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="navbar-wrapper">

      <nav
        className={`navbar navbar-expand-lg navbar-custom ${
          scrolled ? "navbar-scrolled" : ""
        }`}
      >
        <div className="container-fluid">

          {/* Logo */}

          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="logo" />

            <span>UTSAVAM</span>
          </Link>

          {/* Mobile Button */}

          <button
            className="mobile-btn d-lg-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Desktop */}

          <div className="collapse navbar-collapse d-none d-lg-flex">

            <ul className="navbar-nav mx-auto">

              {NAV_LINKS.map((item) => (
                <li className="nav-item" key={item.to}>
                  <Link className="nav-link nav-link-custom" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}

            </ul>

            <div className="d-flex align-items-center gap-2">

              <Link className="nav-link nav-link-custom" to="/contact">
                Contact
              </Link>

              <Link className="nav-link nav-link-custom" to="/signin">
                Sign in
              </Link>

              <Link className="btn btn-started" to="/signup">
                Get Started
                <ArrowRight size={15} />
              </Link>

            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}

      {menuOpen && (
        <div className="mobile-drawer d-lg-none">

          {[...NAV_LINKS,
            { label: "Contact", to: "/contact" },
            { label: "Sign in", to: "/signin" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/signup"
            className="btn btn-started mobile-start-btn"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
            <ArrowRight size={16} />
          </Link>

        </div>
      )}
    </header>
  );
}

export default NavbarCustom;