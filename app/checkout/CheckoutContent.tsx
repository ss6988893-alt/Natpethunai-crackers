"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import {
  getCartSnapshot,
  getServerCartSnapshot,
  subscribeToCart,
} from "../cart";
import { downloadEstimatePdf, type EstimateCustomer } from "../estimate-pdf";

const priceFormatter = new Intl.NumberFormat("en-IN");

function formatPrice(price: number) {
  return `₹${priceFormatter.format(price)}`;
}

function createEstimateNumber() {
  const now = new Date();
  const date = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("");
  const unique = String(Date.now()).slice(-5);
  return `NTC-${date}-${unique}`;
}

function estimateDate() {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
}

function customerFromForm(form: FormData): EstimateCustomer {
  return {
    name: String(form.get("name") ?? ""),
    mobile: String(form.get("mobile") ?? ""),
    email: String(form.get("email") ?? "") || undefined,
    address: String(form.get("address") ?? ""),
  };
}

const subscribeToHydration = () => () => {};
const getHydratedSnapshot = () => true;
const getServerHydratedSnapshot = () => false;

export default function CheckoutContent() {
  const cart = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const loaded = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot,
  );
  const [estimateNumber] = useState(createEstimateNumber);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const estimateDetails = (form: FormData) => ({
    estimateNumber,
    date: estimateDate(),
    customer: customerFromForm(form),
    items: cart,
  });

  const downloadPdf = async () => {
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;
    setGeneratingPdf(true);
    setPdfError("");
    try {
      await downloadEstimatePdf(estimateDetails(new FormData(form)));
    } catch {
      setPdfError("The estimate PDF could not be created. Please try again.");
    } finally {
      setGeneratingPdf(false);
    }
  };

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart.length) return;

    const form = new FormData(event.currentTarget);
    const customer = customerFromForm(form);
    const originalSubtotal = cart.reduce(
      (total, item) => total + (item.originalPrice ?? Math.round(item.price / 0.3)) * item.quantity,
      0,
    );
    const discount = originalSubtotal - cartTotal;
    const productLines = cart.map(
      (item, index) =>
        `${index + 1}. ${item.name}\n   Qty: ${item.quantity} | Rate: ${formatPrice(item.price)} | Amount: ${formatPrice(item.price * item.quantity)}`,
    );
    const message = [
      "*NATPE THUNAI CRACKERS*",
      "*ORDER ESTIMATE - NOT A TAX INVOICE*",
      "Athupalayam Stop, Sivakasi Road, Virudhunagar, Tamil Nadu",
      "Mobile: +91 85240 90862 / +91 83448 06268",
      "",
      `Estimate No: ${estimateNumber}`,
      `Date: ${estimateDate()}`,
      "",
      "*CUSTOMER DETAILS*",
      `Name: ${customer.name}`,
      `Mobile: ${customer.mobile}`,
      ...(customer.email ? [`Email: ${customer.email}`] : []),
      `Address: ${customer.address}`,
      "",
      "*SELECTED PRODUCTS*",
      ...productLines,
      "",
      `Sub Total: ${formatPrice(originalSubtotal)}`,
      `Discount (70%): -${formatPrice(discount)}`,
      `*ESTIMATED TOTAL: ${formatPrice(cartTotal)}*`,
      "",
      `Total items: ${cartCount}`,
      "GST/Tax: To be confirmed by the shop.",
      "No online payment has been made.",
      "Please confirm availability, applicable tax and the final payable amount.",
    ].join("\n");

    const whatsappWindow = window.open("", "_blank");
    setGeneratingPdf(true);
    setPdfError("");
    try {
      await downloadEstimatePdf(estimateDetails(form));
      const whatsappUrl = `https://wa.me/918524090862?text=${encodeURIComponent(message)}`;
      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }
    } catch {
      whatsappWindow?.close();
      setPdfError("The estimate PDF could not be created. Please try again.");
    } finally {
      setGeneratingPdf(false);
    }
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
        <Link className="button button-primary" href="/products">Browse all products <span aria-hidden="true">→</span></Link>
      </section>
    );
  }

  return (
    <section className="checkout-page section-shell">
      <div className="checkout-page-heading">
        <p className="catalog-breadcrumb"><Link href="/products">Products</Link><span>／</span>Customer details</p>
        <p className="eyebrow"><span /> One final step</p>
        <h1>Tell us where to<br /><em>reach you.</em></h1>
        <p>Fill in your details and submit once. WhatsApp will open with your customer information and every selected product already included.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-page-form" onSubmit={submitOrder} ref={formRef}>
          <div className="checkout-form-heading">
            <span>01</span>
            <div><h2>Customer information</h2><p>Name, mobile number and full address are required.</p></div>
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
            <span>Email address <small>(optional)</small></span>
            <input name="email" type="email" autoComplete="email" placeholder="Enter your email address" />
          </label>
          <label>
            <span>Full address</span>
            <textarea name="address" autoComplete="street-address" placeholder="House number, street, area, city and PIN code" required minLength={10} rows={5} />
          </label>

          <div className="checkout-no-payment">
            <span aria-hidden="true">✓</span>
            <p><strong>Estimate PDF - no website payment</strong>Your PDF downloads first, then WhatsApp opens with the same bill-style order details. The shop confirms tax and final price.</p>
          </div>

          <div className="estimate-actions">
            <button className="estimate-download-button" type="button" onClick={downloadPdf} disabled={generatingPdf}>
              <span aria-hidden="true">↓</span> {generatingPdf ? "Creating PDF..." : "Download estimate PDF"}
            </button>
            <button className="whatsapp-order-button" type="submit" disabled={generatingPdf}>
              <span aria-hidden="true">✆</span> {generatingPdf ? "Preparing estimate..." : "Submit estimate to WhatsApp"}
            </button>
          </div>
          {pdfError && <p className="estimate-error" role="alert">{pdfError}</p>}
          <p className="form-disclaimer">WhatsApp cannot attach a website-generated PDF automatically. The PDF downloads to the customer&apos;s device, while the full estimate details are placed directly in the WhatsApp message.</p>
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
          <Link href="/products">← Edit selected products</Link>
        </aside>
      </div>
    </section>
  );
}
