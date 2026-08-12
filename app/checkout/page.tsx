import type { Metadata } from "next";
import CheckoutContent from "./CheckoutContent";

export const metadata: Metadata = {
  title: "Customer Details",
  description: "Review your selected crackers and send your order details to Natpe Thunai Crackers on WhatsApp.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}
