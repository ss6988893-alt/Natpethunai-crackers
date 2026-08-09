import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact & Map",
  description:
    "Call Natpe Thunai Crackers or find our shop at Athupalayam Stop on Sivakasi Road, Virudhunagar.",
};

export default function ContactPage() {
  return <ContactContent />;
}
