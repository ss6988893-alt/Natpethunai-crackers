"use client";

import { useState } from "react";
import Reveal from "../components/Reveal";

const categories = [
  {
    id: "flower-pots",
    number: "01",
    name: "Flower Pots",
    icon: "🌋",
    colour: "ember",
    description: "Golden fountains and colourful ground displays that rise into a bright plume.",
    products: [
      { name: "Golden Flower Pots", note: "A warm golden fountain with a classic festive look.", tag: "Classic glow", originalPrice: 900 },
      { name: "Colour Flower Pots", note: "Colourful fountain effects for a vibrant celebration.", tag: "Colour favourite", originalPrice: 1200 },
      { name: "Deluxe Fountains", note: "A larger fountain-style display for the evening highlight.", tag: "Grand display", originalPrice: 1800 },
    ],
  },
  {
    id: "ground-chakkars",
    number: "02",
    name: "Ground Chakkars",
    icon: "🌀",
    colour: "teal",
    description: "Fast-spinning ground wheels with circles of colour, light and festive energy.",
    products: [
      { name: "Ground Chakkar Big", note: "A bright spinning wheel with a lively circular display.", tag: "Customer pick", originalPrice: 700 },
      { name: "Deluxe Chakkars", note: "A richer wheel effect with a fuller stream of sparks.", tag: "Deluxe range", originalPrice: 1000 },
      { name: "Special Ground Wheels", note: "A colourful ground-spinning selection for family evenings.", tag: "Colour wheel", originalPrice: 1500 },
    ],
  },
  {
    id: "sparklers",
    number: "03",
    name: "Sparklers",
    icon: "✨",
    colour: "gold",
    description: "Hand-held festive favourites in classic electric, colourful and longer-lasting styles.",
    products: [
      { name: "Electric Sparklers", note: "The familiar bright sparkle for traditional celebrations.", tag: "Best seller", originalPrice: 300 },
      { name: "Colour Sparklers", note: "Colour-tinted sparkle effects for brighter festive photos.", tag: "Colour range", originalPrice: 500 },
      { name: "Long Sparklers", note: "A longer sparkler option for extended celebration moments.", tag: "Longer glow", originalPrice: 800 },
    ],
  },
  {
    id: "multi-shot-cakes",
    number: "04",
    name: "Multi-shot Cakes",
    icon: "🎆",
    colour: "violet",
    description: "Coordinated aerial sequences designed to create an exciting sky-show finale.",
    products: [
      { name: "12-Shot Celebration", note: "A compact multi-shot sequence for a crisp aerial highlight.", tag: "Compact show", originalPrice: 1500 },
      { name: "30-Shot Sky Show", note: "A balanced sequence with more colour, rhythm and sky coverage.", tag: "Popular show", originalPrice: 3000 },
      { name: "60-Shot Grand Finale", note: "A larger coordinated aerial sequence for the final celebration.", tag: "Big finale", originalPrice: 6000 },
    ],
  },
  {
    id: "gift-boxes",
    number: "05",
    name: "Gift Boxes",
    icon: "🎁",
    colour: "rose",
    description: "Curated assortments that bring popular festive varieties together in one easy box.",
    products: [
      { name: "Family Starter Box", note: "An approachable mix of sparklers, fountains and ground favourites.", tag: "Family starter", originalPrice: 2500 },
      { name: "Celebration Selection", note: "A balanced assortment with more colour and product variety.", tag: "Mixed variety", originalPrice: 4000 },
      { name: "Premium Festival Box", note: "A fuller gift selection with premium festive highlights.", tag: "Premium pick", originalPrice: 7500 },
    ],
  },
  {
    id: "giant-crackers",
    number: "06",
    name: "Atom Bombs / Giant Crackers",
    icon: "💥",
    colour: "red",
    description: "High-impact sound crackers for suitable open spaces, subject to local rules and availability.",
    products: [
      { name: "Classic Atom Bombs", note: "A traditional high-impact sound cracker for adult-supervised use.", tag: "High impact", originalPrice: 600 },
      { name: "Hydro Bomb Range", note: "A strong sound-cracker selection; ask our team for safe-use guidance.", tag: "Sound range", originalPrice: 1100 },
      { name: "Giant Crackers", note: "Larger sound crackers for approved open areas and responsible handling.", tag: "Adult guidance", originalPrice: 2000 },
    ],
  },
] as const;

type CategoryId = "all" | (typeof categories)[number]["id"];

const priceFormatter = new Intl.NumberFormat("en-IN");

function offerPrice(originalPrice: number) {
  return Math.round(originalPrice * 0.3);
}

function formatPrice(price: number) {
  return `₹${priceFormatter.format(price)}`;
}

function whatsappLink(product: string, price: number) {
  return `https://wa.me/918524090862?text=${encodeURIComponent(
    `Hello Natpe Thunai Crackers, I would like to order ${product} at the 70% offer price of ${formatPrice(price)}. Please confirm availability.`,
  )}`;
}

export default function ProductsContent() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const visibleCategories =
    activeCategory === "all"
      ? categories
      : categories.filter((category) => category.id === activeCategory);

  return (
    <>
      <section className="catalog-hero section-shell">
        <Reveal className="catalog-hero-copy">
          <p className="catalog-breadcrumb"><a href="/">Home</a><span>／</span>Products</p>
          <p className="eyebrow"><span /> Six ways to celebrate</p>
          <h1>Find your kind<br />of <em>sparkle.</em></h1>
          <p>
            Browse our cracker collection category by category. Choose a product and
            send a direct WhatsApp enquiry for current pricing and availability.
          </p>
          <div className="catalog-hero-actions">
            <a className="button button-primary" href="#catalog">Explore products <span aria-hidden="true">↓</span></a>
            <a className="button button-ghost" href="https://wa.me/918524090862?text=Hello%20Natpe%20Thunai%20Crackers%2C%20please%20help%20me%20choose%20products." target="_blank" rel="noreferrer">
              Help me choose <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Reveal>
        <Reveal className="catalog-hero-visual" delay={120}>
          <div className="catalog-orbits" aria-hidden="true">
            {categories.map((category, index) => (
              <span key={category.id} style={{ "--orbit-index": index } as React.CSSProperties}>{category.icon}</span>
            ))}
            <img src="/brand-logo.png" alt="" />
          </div>
          <p><strong>6</strong><span>celebration<br />categories</span></p>
        </Reveal>
      </section>

      <section className="category-filter-wrap" id="catalog">
        <div className="section-shell">
          <Reveal className="category-filter-heading">
            <div>
              <p className="eyebrow"><span /> Browse by category</p>
              <h2>Choose a <em>collection.</em></h2>
            </div>
            <p>Tap a category to focus the catalogue, or view everything together.</p>
          </Reveal>
          <div className="category-filter" role="group" aria-label="Filter products by category">
            <button className={activeCategory === "all" ? "active" : ""} type="button" onClick={() => setActiveCategory("all")}>
              <span>✦</span><strong>All products</strong><small>18 items</small>
            </button>
            {categories.map((category) => (
              <button
                className={activeCategory === category.id ? "active" : ""}
                type="button"
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                aria-pressed={activeCategory === category.id}
              >
                <span>{category.icon}</span><strong>{category.name}</strong><small>3 items</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="catalog-content section-shell" aria-live="polite">
        {visibleCategories.map((category, categoryIndex) => (
          <section className={`catalog-category tone-${category.colour}`} key={category.id} id={category.id}>
            <Reveal className="catalog-category-heading">
              <div className="catalog-category-icon" aria-hidden="true">{category.icon}</div>
              <div>
                <p>Category {category.number}</p>
                <h2>{category.name}</h2>
                <span>{category.description}</span>
              </div>
            </Reveal>
            <div className="catalog-product-grid">
              {category.products.map((product, productIndex) => (
                <Reveal key={product.name} delay={(categoryIndex === 0 ? productIndex : 0) * 70}>
                  <article className="catalog-product-card">
                    <div className="catalog-product-art" aria-hidden="true">
                      <strong className="catalog-discount-badge">70% OFF</strong>
                      <span>{category.icon}</span>
                      <i />
                    </div>
                    <div className="catalog-product-body">
                      <span className="catalog-product-tag">{product.tag}</span>
                      <h3>{product.name}</h3>
                      <div className="catalog-product-price" aria-label={`70% offer price ${formatPrice(offerPrice(product.originalPrice))}, originally ${formatPrice(product.originalPrice)}`}>
                        <span>{formatPrice(product.originalPrice)}</span>
                        <strong>{formatPrice(offerPrice(product.originalPrice))}</strong>
                        <small>70% offer</small>
                      </div>
                      <p>{product.note}</p>
                      <a className="product-enquire" href={whatsappLink(product.name, offerPrice(product.originalPrice))} target="_blank" rel="noreferrer">
                        Order on WhatsApp <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </section>

      <section className="catalog-safety section-shell">
        <Reveal className="catalog-safety-card">
          <span aria-hidden="true">!</span>
          <div>
            <p className="eyebrow"><span /> Celebrate responsibly</p>
            <h2>Choose the right product for the right space.</h2>
            <p>
              Multi-shot cakes, atom bombs and giant crackers require extra care, adult
              supervision and a suitable open area. Always follow the product label and local rules.
            </p>
          </div>
          <a className="button button-outline" href="tel:+918524090862">Call for guidance</a>
        </Reveal>
      </section>

      <section className="catalog-cta section-shell">
        <Reveal className="cta-card">
          <div className="cta-burst" aria-hidden="true" />
          <div>
            <p className="eyebrow"><span /> Need a complete mix?</p>
            <h2>Build a celebration around <em>your budget.</em></h2>
            <p>Explore our ready-made ₹3K–₹10K combos or ask us for a custom recommendation.</p>
          </div>
          <div className="cta-actions">
            <a className="button button-primary" href="/#combos">View combo boxes</a>
            <a className="button button-ghost" href="/contact">Contact the shop <span aria-hidden="true">→</span></a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
