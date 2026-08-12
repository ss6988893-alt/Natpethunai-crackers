import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished Natpe Thunai storefront", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Natpe Thunai Crackers/i);
  assert.match(html, /Your celebration,/i);
  assert.match(html, /banner-quality\.jpg/);
  assert.match(html, /banner-combo-festival\.png/);
  assert.match(html, /banner-offer-brock-speed\.png/);
  assert.match(html, /banner-premium-collection\.png/);
  assert.match(html, /href="\/products"/);
  assert.match(html, /href="\/contact"/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("server-renders the product catalogue with prices and cart controls", async () => {
  const response = await render("/products");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Find your kind/i);
  assert.match(html, /All products/);
  assert.match(html, /Golden Flower Pots/);
  assert.match(html, /60-Shot Grand Finale/);
  assert.match(html, /70% offer/i);
  assert.match(html, /Add to cart/i);
  assert.doesNotMatch(html, /react-loading-skeleton|Starter Project/i);
});

test("keeps one WhatsApp submission point and the bill-style PDF estimate", async () => {
  const [products, checkout, estimatePdf, cart, layout, packageJson, publicFiles] =
    await Promise.all([
      readFile(new URL("../app/products/ProductsContent.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/checkout/CheckoutContent.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/estimate-pdf.ts", import.meta.url), "utf8"),
      readFile(new URL("../app/cart.ts", import.meta.url), "utf8"),
      readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
      readFile(new URL("../package.json", import.meta.url), "utf8"),
      readdir(new URL("../public/", import.meta.url)),
    ]);

  assert.match(products, /addToCart/);
  assert.match(products, /href="\/checkout"/);
  assert.doesNotMatch(products, /wa\.me/);

  assert.equal((checkout.match(/wa\.me\/918524090862/g) ?? []).length, 1);
  assert.match(checkout, /downloadEstimatePdf/);
  assert.match(checkout, /name="name"/);
  assert.match(checkout, /name="mobile"/);
  assert.match(checkout, /name="address"/);

  assert.match(estimatePdf, /NATPE THUNAI CRACKERS/);
  assert.match(estimatePdf, /ORDER ESTIMATE/);
  assert.match(estimatePdf, /NOT A TAX INVOICE/);
  assert.match(estimatePdf, /Discount \(70%\)/);
  assert.match(cart, /natpe-thunai-cart/);

  assert.match(packageJson, /"jspdf"/);
  assert.doesNotMatch(packageJson, /drizzle|"motion"/);
  assert.match(layout, /\/brand-logo\.png/);
  assert.doesNotMatch(layout, /favicon\.png/);

  const removedAssets = [
    "banner-offer.jpg",
    "brand-logo-source.png",
    "favicon.png",
    "vanakkam-strongman-v1.png",
    "vanakkam-younger-v1.png",
  ];
  for (const asset of removedAssets) assert.ok(!publicFiles.includes(asset));

  for (const asset of [
    "brand-logo.png",
    "og.png",
    "banner-quality.jpg",
    "banner-combo-festival.png",
    "banner-offer-brock-speed.png",
    "banner-premium-collection.png",
  ]) {
    await access(new URL(`../public/${asset}`, import.meta.url));
  }
});
