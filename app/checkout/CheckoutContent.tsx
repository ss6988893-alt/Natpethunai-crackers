"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CART_STORAGE_KEY, parseStoredCart, type CartItem } from "../cart";

const priceFormatter = new Intl.NumberFormat("en-IN");

function formatPrice(price: number) {
  return `₹${priceFormatter.format(price)}`;
}

export default function CheckoutContent() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCart(parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY)));
    setLoaded(true);
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart.length) return;

    const form = new FormData(event.currentTarget);
    const productLines = cart.map(
      (item, index) =>
        `${index + 1}. ${item.name} x ${item.quantity} | ${formatPrice(item.price)} each | ${formatPrice(item.price * item.quantity)}`,
    );
    const message = [
      "ORDER ENQUIRY - NATPE THUNAI CRACKERS",
      "",
      "CUSTOMER DETAILS",
      `Name: ${form.get("name")}`,
      `Mobile: ${form.get("mobile")}`,
      `Address: ${form.get("address")}`,
      "",
      "SELECTED PRODUCTS",
      ...productLines,
      "",
      `Estimated total: ${formatPrice(cartTotal)}`,
      "",
      "No online payment has been made. Please confirm availability and the final order price.",
    ].join("\n");

    window.open(
      `https://wa.me/918524090862?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  if (!loaded) {
    return <div className="checkout-loading" aria-label="Loading your selected products"><span /></div>;
  }

  if (!cart.length) {
    return (
      <section className="checkout-empty section-shell">
        <div aria-hidden="true">▱</div>
        <p className="eyebrow"><span /> Your cart</p>
        <h1>No products selected yet.</h1>
        <p>Choose the crackers you want first, then return here to send one complete order enquiry.</p>
        <a className="button button-primary" href="/products">Browse all products <span aria-hidden="true">→</span></a>
      </section>
    );
  }

  return (
    <section className="checkout-page section-shell">
      <div className="checkout-page-heading">
        <p className="catalog-breadcrumb"><a href="/products">Products</a><span>／</span>Customer details</p>
        <p className="eyebrow"><span /> One final step</p>
        <h1>Tell us where to<br /><em>reach you.</em></h1>
        <p>Fill in your details and submit once. WhatsApp will open with your customer information and every selected product already included.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-page-form" onSubmit={submitOrder}>
          <div className="checkout-form-heading">
            <span>01</span>
            <div><h2>Customer information</h2><p>All fields are required to prepare your order request.</p></div>
          </div>

          <label>
            <span>Full name</span>
            <input name="name" type="text" autoComplete="name" placeholder="Enter your full name" required minLength={2} />
          </label>
          <label>
            <span>Mobile number</span>
            <input name="mobile" type="tel" autoComplete="tel" inputMode="tel" placeholder="Enter your 10-digit mobile number" required pattern="[0-9+ ()-]{10,18}" />
          </label>
          <label>
            <span>Full address</span>
            <textarea name="address" autoComplete="street-address" placeholder="House number, street, area, city and PIN code" required minLength={10} rows={5} />
          </label>

          <div className="checkout-no-payment">
            <span aria-hidden="true">✓</span>
            <p><strong>No website payment</strong>You only send an order enquiry. Our shop confirms availability and final price on WhatsApp.</p>
          </div>

          <button className="whatsapp-order-button" type="submit">
            <span aria-hidden="true">✆</span> Submit order form to WhatsApp
          </button>
          <p className="form-disclaimer">This is the only button that opens WhatsApp. No product button opens WhatsApp individually.</p>
        </form>

        <aside className="checkout-order-card" aria-label="Selected product summary">
          <div className="checkout-form-heading">
            <span>02</span>
            <div><h2>Your selected products</h2><p>{cartCount} {cartCount === 1 ? "item" : "items"} ready to send</p></div>
          </div>

          <div className="checkout-order-items">
            {cart.map((item) => (
              <article key={item.name}>
                <div aria-hidden="true">✦</div>
                <span><strong>{item.name}</strong><small>{formatPrice(item.price)} × {item.quantity}</small></span>
                <b>{formatPrice(item.price * item.quantity)}</b>
              </article>
            ))}
          </div>

          <div className="checkout-order-total"><span>Estimated total</span><strong>{formatPrice(cartTotal)}</strong></div>
          <p>Final total may change based on seasonal availability. The shop will confirm before accepting your order.</p>
          <a href="/products">← Edit selected products</a>
        </aside>
      </div>
    </section>
  );
}
