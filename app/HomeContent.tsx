"use client";

import { useEffect, useState } from "react";
import Reveal from "./components/Reveal";

const slides = [
  {
    src: "/banner-quality.jpg",
    alt: "Natpe Thunai quality crackers banner with fireworks and product boxes",
    label: "Trusted quality · Direct shop pricing",
  },
  {
    src: "/banner-offer.jpg",
    alt: "Natpe Thunai Crackers seasonal offer banner",
    label: "Big festive value · Family favourites",
  },
];

const products = [
  {
    icon: "🚀",
    title: "Aerial Showstoppers",
    description: "Sky shots, rockets and colourful aerial favourites for the grand finale.",
    tag: "Night highlight",
    tone: "red",
  },
  {
    icon: "✨",
    title: "Sparkler Celebration",
    description: "Classic sparklers in festive colours for bright family moments.",
    tag: "Family favourite",
    tone: "gold",
  },
  {
    icon: "🌋",
    title: "Flower Pot Glow",
    description: "Golden fountains and colourful pots that fill the evening with light.",
    tag: "Visual delight",
    tone: "teal",
  },
  {
    icon: "🎇",
    title: "Ground Classics",
    description: "Chakkars, twinkling stars and celebration staples for every gathering.",
    tag: "Best seller",
    tone: "violet",
  },
];

const combos = [
  {
    price: "₹3,000",
    name: "Spark Combo",
    note: "A bright starter set for a close family celebration.",
    features: ["Sparklers & pencils", "Flower pots", "Ground chakkars", "Kids favourites"],
  },
  {
    price: "₹5,000",
    name: "Celebration Combo",
    note: "A balanced festive mix with more colour and variety.",
    features: ["Everything in Spark", "Rockets & sky shots", "Colour fountains", "Family assortment"],
  },
  {
    price: "₹7,000",
    name: "Grand Family Combo",
    note: "Our crowd-pleasing pick for a full evening of celebration.",
    features: ["Premium aerial shots", "Large fountain mix", "Extended sparkler set", "Grand finale selection"],
    featured: true,
  },
  {
    price: "₹10,000",
    name: "Festival Max Combo",
    note: "The complete large-family collection with premium highlights.",
    features: ["Mega variety pack", "Premium sky series", "Gift-box favourites", "Longer celebration value"],
  },
];

function enquiryLink(item: string) {
  return `https://wa.me/918524090862?text=${encodeURIComponent(
    `Hello Natpe Thunai Crackers, I would like to know more about the ${item}.`,
  )}`;
}

export default function HomeContent() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(
      () => setSlide((current) => (current + 1) % slides.length),
      5200,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  const changeSlide = (next: number) => {
    setSlide((next + slides.length) % slides.length);
  };

  return (
    <>
      <section
        className="hero-slider"
        aria-roledescription="carousel"
        aria-label="Featured Natpe Thunai offers"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="hero-stage">
          {slides.map((item, index) => (
            <figure
              className={`hero-slide ${index === slide ? "is-active" : ""}`}
              aria-hidden={index !== slide}
              key={item.src}
            >
              <img
                src={item.src}
                alt={index === slide ? item.alt : ""}
                loading={index === 0 ? "eager" : "lazy"}
                draggable="false"
              />
            </figure>
          ))}
          <div className="hero-vignette" aria-hidden="true" />
          <div className="hero-caption">
            <span>{slides[slide].label}</span>
            <div className="hero-actions">
              <a className="button button-primary" href="#combos">
                Explore combos <span aria-hidden="true">↓</span>
              </a>
              <a className="button button-ghost" href="tel:+918524090862">
                Call to order
              </a>
            </div>
          </div>
          <button className="slider-arrow prev" type="button" onClick={() => changeSlide(slide - 1)} aria-label="Previous banner">‹</button>
          <button className="slider-arrow next" type="button" onClick={() => changeSlide(slide + 1)} aria-label="Next banner">›</button>
        </div>
        <div className="slider-controls" role="tablist" aria-label="Choose banner">
          {slides.map((item, index) => (
            <button
              key={item.src}
              className={index === slide ? "active" : ""}
              type="button"
              role="tab"
              aria-selected={index === slide}
              aria-label={`Show banner ${index + 1}`}
              onClick={() => changeSlide(index)}
            >
              <span />
            </button>
          ))}
        </div>
        {!paused && <span className="slider-progress" key={slide} aria-hidden="true" />}
      </section>

      <section className="trust-strip" aria-label="Shop highlights">
        {[
          ["✓", "Licensed sourcing", "Quality-first selection"],
          ["₹", "Direct shop value", "Retail & wholesale"],
          ["✦", "Curated variety", "Family combo boxes"],
          ["⌖", "Easy to visit", "Sivakasi Road"],
        ].map(([icon, title, text]) => (
          <div key={title}>
            <span aria-hidden="true">{icon}</span>
            <p><strong>{title}</strong><small>{text}</small></p>
          </div>
        ))}
      </section>

      <section className="intro-section section-shell">
        <Reveal className="intro-copy">
          <p className="eyebrow"><span /> Sivakasi spirit. Virudhunagar warmth.</p>
          <h1>Your celebration,<br /><em>brighter together.</em></h1>
          <p className="lead">
            From the first sparkler to the final sky shot, we bring together trusted
            crackers, honest direct-shop value and joyful combo boxes for every family.
          </p>
          <div className="intro-actions">
            <a className="button button-primary" href="#products">View top products</a>
            <a className="text-link" href="/contact">Find our shop <span aria-hidden="true">→</span></a>
          </div>
        </Reveal>
        <Reveal className="intro-feature" delay={130}>
          <div className="orbit-art" aria-hidden="true">
            <span className="orbit orbit-one" />
            <span className="orbit orbit-two" />
            <span className="orbit-core">70<small>%</small></span>
          </div>
          <div>
            <span className="mini-label">Seasonal highlight</span>
            <h2>Up to 70% off</h2>
            <p>On selected seasonal cracker ranges. Call us for today&apos;s available collection.</p>
          </div>
        </Reveal>
      </section>

      <section className="products-section section-shell" id="products">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow"><span /> Celebration essentials</p>
            <h2>Top products, picked to <em>shine.</em></h2>
          </div>
          <p>Explore customer favourites across aerial, sparkle, fountain and ground collections.</p>
        </Reveal>
        <div className="product-grid">
          {products.map((product, index) => (
            <Reveal key={product.title} delay={index * 75}>
              <article className={`product-card tone-${product.tone}`}>
                <div className="product-glow" aria-hidden="true" />
                <span className="product-tag">{product.tag}</span>
                <div className="product-art" aria-hidden="true">{product.icon}</div>
                <div className="product-body">
                  <p>0{index + 1}</p>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <a href={enquiryLink(product.title)} target="_blank" rel="noreferrer">
                    Ask availability <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="combos-section" id="combos">
        <div className="section-shell">
          <Reveal className="section-heading centered">
            <div>
              <p className="eyebrow"><span /> More joy in every box</p>
              <h2>Choose your <em>celebration combo.</em></h2>
            </div>
            <p>Four simple budgets. Carefully balanced variety. Easy ordering by phone or WhatsApp.</p>
          </Reveal>
          <div className="combo-grid">
            {combos.map((combo, index) => (
              <Reveal key={combo.price} delay={index * 80}>
                <article className={`combo-card ${combo.featured ? "featured" : ""}`}>
                  {combo.featured && <span className="popular-badge">Most popular</span>}
                  <p className="combo-index">Combo 0{index + 1}</p>
                  <p className="combo-price"><span>₹</span>{combo.price.replace("₹", "")}</p>
                  <h3>{combo.name}</h3>
                  <p className="combo-note">{combo.note}</p>
                  <ul>
                    {combo.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}
                  </ul>
                  <a className={`button ${combo.featured ? "button-primary" : "button-outline"}`} href={enquiryLink(combo.name)} target="_blank" rel="noreferrer">
                    Enquire now <span aria-hidden="true">↗</span>
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="combo-disclaimer">Product mix is subject to seasonal stock. Contact us for the current item list.</p>
        </div>
      </section>

      <section className="why-section section-shell">
        <Reveal className="why-copy">
          <p className="eyebrow"><span /> Why families choose us</p>
          <h2>Big-festival energy.<br /><em>Neighbourhood care.</em></h2>
          <p>We help you choose the right mix for your space, family size and celebration budget.</p>
          <a className="text-link" href="/contact">Plan your visit <span aria-hidden="true">→</span></a>
        </Reveal>
        <div className="why-list">
          {[
            ["01", "Thoughtful selection", "A useful mix of classics, colour and show-stopping favourites."],
            ["02", "Straightforward value", "Easy-to-understand combo budgets and direct-shop pricing."],
            ["03", "Safety-conscious guidance", "Friendly help choosing age-appropriate products and safe-use essentials."],
          ].map(([number, title, text], index) => (
            <Reveal key={title} delay={index * 90}>
              <article>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
                <span aria-hidden="true">✦</span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="cta-section section-shell">
        <Reveal className="cta-card">
          <div className="cta-burst" aria-hidden="true" />
          <div>
            <p className="eyebrow"><span /> Ready when you are</p>
            <h2>Let&apos;s make this celebration <em>unforgettable.</em></h2>
            <p>Call, WhatsApp or visit us at Athupalayam Stop on Sivakasi Road.</p>
          </div>
          <div className="cta-actions">
            <a className="button button-primary" href="tel:+918524090862">Call 85240 90862</a>
            <a className="button button-ghost" href="/contact">View map <span aria-hidden="true">→</span></a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
