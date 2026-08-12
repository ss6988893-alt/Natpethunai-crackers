"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Reveal from "../components/Reveal";
import {
  getCartSnapshot,
  getServerCartSnapshot,
  subscribeToCart,
  updateStoredCart,
} from "../cart";

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

export default function ProductsContent() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const visibleCategories =
    activeCategory === "all"
      ? categories
      : categories.filter((category) => category.id === activeCategory);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const quantities = useMemo(
    () => Object.fromEntries(cart.map((item) => [item.name, item.quantity])),
    [cart],
  );

  useEffect(() => {
    if (!cartOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [cartOpen]);

  const addToCart = (name: string, price: number, originalPrice: number) => {
    updateStoredCart((current) => {
      const existing = current.find((item) => item.name === name);
      if (existing) {
        return current.map((item) =>
          item.name === name
            ? { ...item, originalPrice, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { name, price, originalPrice, quantity: 1 }];
    });
  };

  const changeQuantity = (name: string, quantity: number) => {
    updateStoredCart((current) =>
      quantity <= 0
        ? current.filter((item) => item.name !== name)
        : current.map((item) => (item.name === name ? { ...item, quantity } : item)),
    );
  };

  const openCart = () => {
    setCartOpen(true);
  };

  return (
    <>
      <section className="catalog-hero section-shell">
        <Reveal className="catalog-hero-copy">
          <p className="catalog-breadcrumb"><Link href="/">Home</Link><span>／</span>Products</p>
          <p className="eyebrow"><span /> Six ways to celebrate</p>
          <h1>Find your kind<br />of <em>sparkle.</em></h1>
          <p>
            Browse sale prices, add your favourites to the cart and send your complete
            order request to us on WhatsApp. No online payment is required.
          </p>
          <div className="catalog-hero-actions">
            <a className="button button-primary" href="#catalog">Explore products <span aria-hidden="true">↓</span></a>
            <Link className="button button-ghost" href="/contact">
              Need help choosing? <span aria-hidden="true">→</span>
            </Link>
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
                      <button
                        className={`product-enquire ${quantities[product.name] ? "is-added" : ""}`}
                        type="button"
                        onClick={() => addToCart(product.name, offerPrice(product.originalPrice), product.originalPrice)}
                        aria-label={`Add ${product.name} to cart for ${formatPrice(offerPrice(product.originalPrice))}`}
                      >
                        {quantities[product.name]
                          ? `Add another · ${quantities[product.name]} in cart`
                          : "Add to cart"}
                        <span aria-hidden="true">{quantities[product.name] ? "+" : "→"}</span>
                      </button>
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
            <Link className="button button-primary" href="/#combos">View combo boxes</Link>
            <Link className="button button-ghost" href="/contact">Contact the shop <span aria-hidden="true">→</span></Link>
          </div>
        </Reveal>
      </section>

      {cartCount > 0 && !cartOpen && (
        <button className="floating-cart" type="button" onClick={openCart} aria-label={`Open cart with ${cartCount} items`}>
          <span className="floating-cart-icon" aria-hidden="true">▱</span>
          <span><strong>View cart</strong><small>{cartCount} {cartCount === 1 ? "item" : "items"} · {formatPrice(cartTotal)}</small></span>
          <b aria-hidden="true">→</b>
        </button>
      )}

      {cartOpen && (
        <div className="cart-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setCartOpen(false);
        }}>
          <section className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <header className="cart-header">
              <div>
                <p>Your selection</p>
                <h2 id="cart-title">Shopping cart</h2>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart">×</button>
            </header>

            <div className="cart-items">
              {cart.length ? cart.map((item) => (
                <article className="cart-item" key={item.name}>
                  <div className="cart-item-art" aria-hidden="true">✦</div>
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>{formatPrice(item.price)} each</p>
                    <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                      <button type="button" onClick={() => changeQuantity(item.name, item.quantity - 1)} aria-label={`Remove one ${item.name}`}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => changeQuantity(item.name, item.quantity + 1)} aria-label={`Add one ${item.name}`}>+</button>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                    <button type="button" onClick={() => changeQuantity(item.name, 0)}>Remove</button>
                  </div>
                </article>
              )) : (
                <div className="empty-cart"><span>▱</span><h3>Your cart is empty</h3><p>Add products from the catalogue to continue.</p></div>
              )}
            </div>

            {cart.length > 0 && (
              <footer className="cart-footer">
                <div className="cart-total"><span>Estimated total</span><strong>{formatPrice(cartTotal)}</strong></div>
                <p><span>✓</span> No online payment. You will enter your details on the next page.</p>
                <Link className="cart-checkout-button" href="/checkout">
                  Go to customer details form <span aria-hidden="true">→</span>
                </Link>
                <button className="continue-shopping" type="button" onClick={() => setCartOpen(false)}>Continue shopping</button>
              </footer>
            )}
          </section>
        </div>
      )}
    </>
  );
}
