import type { Metadata } from "next";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Shop quality crackers, top products and family combo boxes from ₹3,000 to ₹10,000 at Natpe Thunai Crackers, Virudhunagar.",
};

export default function Home() {
  return <HomeContent />;
}
