import type { Metadata } from "next";
import ProductsContent from "./ProductsContent";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore Natpe Thunai Crackers products by category: flower pots, ground chakkars, sparklers, multi-shot cakes, gift boxes and giant crackers.",
};

export default function ProductsPage() {
  return <ProductsContent />;
}
