"use client";

import type { FormEvent } from "react";
import Reveal from "../components/Reveal";

const mapQuery = "Athupalayam Bus Stop, Sivakasi Road, Virudhunagar, Tamil Nadu";
const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

export default function ContactContent() {
  const sendEnquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = [
      "Hello Natpe Thunai Crackers,",
      `My name is ${form.get("name") || ""}.`,
      `Phone: ${form.get("phone") || ""}`,
      `I am interested in: ${form.get("interest") || "general products"}`,
      `Budget: ${form.get("budget") || "Not decided"}`,
    ].join("\n");
    window.open(`https://wa.me/918524090862?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section className="contact-hero section-shell">
        <Reveal className="contact-hero-copy">
          <p className="eyebrow"><span /> We&apos;re nearby</p>
          <h1>Visit. Call.<br /><em>Celebrate.</em></h1>
          <p>Questions about a combo or planning a shop visit? Our team is only a call or WhatsApp message away.</p>
        </Reveal>
        <Reveal className="contact-hero-orbit" delay={120}>
          <div className="contact-orbit" aria-hidden="true">
            <span>⌖</span>
            <i />
            <i />
          </div>
          <p>Athupalayam Stop<br /><strong>Sivakasi Road · Virudhunagar</strong></p>
        </Reveal>
      </section>

      <section className="contact-options section-shell" aria-label="Contact options">
        <Reveal delay={0}>
          <a className="contact-option" href="tel:+918524090862">
            <span className="contact-icon" aria-hidden="true">☎</span>
            <span><small>Primary contact</small><strong>+91 85240 90862</strong><em>Tap to call</em></span>
            <span aria-hidden="true">↗</span>
          </a>
        </Reveal>
        <Reveal delay={80}>
          <a className="contact-option" href="tel:+918344806268">
            <span className="contact-icon" aria-hidden="true">☎</span>
            <span><small>Alternate contact</small><strong>+91 83448 06268</strong><em>Tap to call</em></span>
            <span aria-hidden="true">↗</span>
          </a>
        </Reveal>
        <Reveal delay={160}>
          <a className="contact-option" href="https://wa.me/918524090862?text=Hello%20Natpe%20Thunai%20Crackers%2C%20I%20would%20like%20to%20enquire." target="_blank" rel="noreferrer">
            <span className="contact-icon whatsapp" aria-hidden="true">✆</span>
            <span><small>Quick enquiry</small><strong>Chat on WhatsApp</strong><em>Usually the easiest way</em></span>
            <span aria-hidden="true">↗</span>
          </a>
        </Reveal>
      </section>

      <section className="location-section section-shell">
        <Reveal className="map-wrap">
          <iframe
            title="Map showing Natpe Thunai Crackers near Athupalayam Stop on Sivakasi Road"
            src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="map-pin-label"><span aria-hidden="true">⌖</span> Athupalayam Stop</div>
        </Reveal>
        <Reveal className="location-copy" delay={100}>
          <p className="eyebrow"><span /> Shop location</p>
          <h2>Easy to find on<br /><em>Sivakasi Road.</em></h2>
          <div className="address-card">
            <span aria-hidden="true">⌖</span>
            <div>
              <small>Address</small>
              <p>Athupalayam Stop<br />Sivakasi Road<br />Virudhunagar, Tamil Nadu</p>
            </div>
          </div>
          <p className="visit-note">Seasonal timings can change. Please call before visiting so we can guide you and confirm stock.</p>
          <a className="button button-primary" href={mapLink} target="_blank" rel="noreferrer">
            Open in Google Maps <span aria-hidden="true">↗</span>
          </a>
        </Reveal>
      </section>

      <section className="enquiry-section section-shell">
        <Reveal className="enquiry-copy">
          <p className="eyebrow"><span /> Tell us what you need</p>
          <h2>Plan your order<br /><em>in a minute.</em></h2>
          <p>Share a few details and we&apos;ll open WhatsApp with your enquiry ready to send.</p>
          <div className="enquiry-promise">
            <span>✓</span>
            <p><strong>No complicated checkout</strong><small>Speak directly with our shop team.</small></p>
          </div>
        </Reveal>
        <Reveal className="enquiry-form-wrap" delay={100}>
          <form className="enquiry-form" onSubmit={sendEnquiry}>
            <div className="form-row">
              <label>Name<input type="text" name="name" placeholder="Your name" autoComplete="name" required /></label>
              <label>Phone<input type="tel" name="phone" placeholder="10-digit number" autoComplete="tel" pattern="[0-9 +()-]{10,}" required /></label>
            </div>
            <label>What are you looking for?<input type="text" name="interest" placeholder="Combo box, top products, wholesale…" required /></label>
            <label>Celebration budget
              <select name="budget" defaultValue="">
                <option value="" disabled>Select a budget</option>
                <option>₹3,000 Spark Combo</option>
                <option>₹5,000 Celebration Combo</option>
                <option>₹7,000 Grand Family Combo</option>
                <option>₹10,000 Festival Max Combo</option>
                <option>Custom budget</option>
              </select>
            </label>
            <button className="button button-primary" type="submit">Continue on WhatsApp <span aria-hidden="true">↗</span></button>
            <p className="form-note">Submitting opens WhatsApp. No details are stored on this website.</p>
          </form>
        </Reveal>
      </section>

      <section className="safety-banner section-shell">
        <Reveal>
          <div className="safety-inner">
            <span aria-hidden="true">✦</span>
            <div><strong>Celebrate with care.</strong><p>Use crackers only in open spaces, keep water nearby and ensure adult supervision.</p></div>
            <a href="tel:+918524090862">Ask us for guidance <span aria-hidden="true">→</span></a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
