import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import SiteChrome from "./components/SiteChrome";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: {
      default: "Natpe Thunai Crackers",
      template: "%s | Natpe Thunai Crackers",
    },
    description:
      "Quality crackers, family combos and festive favourites at direct shop prices on Sivakasi Road, Virudhunagar.",
    icons: {
      icon: [{ url: "/brand-logo.png", type: "image/png" }],
      shortcut: "/brand-logo.png",
      apple: "/brand-logo.png",
    },
    openGraph: {
      title: "Natpe Thunai Crackers",
      description: "Celebrate brighter. Celebrate together.",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: "/og.png",
          width: 1730,
          height: 902,
          alt: "Natpe Thunai Crackers festive product collection",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Natpe Thunai Crackers",
      description: "Celebrate brighter. Celebrate together.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
