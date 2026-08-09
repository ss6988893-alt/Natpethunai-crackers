"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

const phonePrimary = "+918524090862";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [path, setPath] = useState("/");

  useEffect(() => {
    setPath(window.location.pathname);
    const onScroll = () => setShowTop(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="ambient-sparks" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className="offer-bar">
        <p>
          <span className="offer-pulse" /> Diwali season orders are open
          <span className="offer-separator">•</span>
          Family &amp; wholesale combos from ₹3K–₹10K
        </p>
        <a href={`tel:${phonePrimary}`} aria-label="Call 85240 90862">
          Call: 85240 90862
        </a>
      </div>

      <header className="site-header">
        <a className="brand" href="/" onClick={closeMenu} aria-label="Natpe Thunai Crackers home">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span>
            <strong>Natpe Thunai</strong>
            <small>Crackers · Virudhunagar</small>
          </span>
        </a>

        <button
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="primary-navigation"
          className={`primary-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Primary navigation"
        >
          <a className={path === "/" ? "active" : ""} href="/" onClick={closeMenu}>Home</a>
          <a href="/#products" onClick={closeMenu}>Top products</a>
          <a href="/#combos" onClick={closeMenu}>Combos</a>
          <a className={path.startsWith("/contact") ? "active" : ""} href="/contact" onClick={closeMenu}>Contact</a>
          <a className="nav-cta" href="https://wa.me/918524090862?text=Hello%20Natpe%20Thunai%20Crackers%2C%20I%20would%20like%20to%20enquire." target="_blank" rel="noreferrer">
            WhatsApp us <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="brand-mark" aria-hidden="true">✦</span>
            <div>
              <strong>Natpe Thunai Crackers</strong>
              <p>Celebrations chosen with care, priced with honesty.</p>
            </div>
          </div>
          <div>
            <h2>Visit us</h2>
            <p>Athupalayam Stop, Sivakasi Road<br />Virudhunagar, Tamil Nadu</p>
          </div>
          <div>
            <h2>Call us</h2>
            <a href="tel:+918524090862">+91 85240 90862</a>
            <a href="tel:+918344806268">+91 83448 06268</a>
          </div>
          <div>
            <h2>Quick links</h2>
            <a href="/#products">Top products</a>
            <a href="/#combos">Combo boxes</a>
            <a href="/contact">Contact &amp; map</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Natpe Thunai Crackers. All rights reserved.</p>
          <p>Celebrate responsibly · Follow local safety guidelines</p>
        </div>
      </footer>

      <a
        className="whatsapp-float"
        href="https://wa.me/918524090862?text=Hello%20Natpe%20Thunai%20Crackers%2C%20I%20would%20like%20to%20enquire."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Natpe Thunai Crackers on WhatsApp"
      >
        <span aria-hidden="true">✆</span>
        <span>WhatsApp</span>
      </a>

      <button
        className={`back-to-top ${showTop ? "is-visible" : ""}`}
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        title="Back to top"
      >
        ↑
      </button>
    </>
  );
}
