import { jsPDF } from "jspdf";
import type { CartItem } from "./cart";

export type EstimateCustomer = {
  name: string;
  mobile: string;
  email?: string;
  address: string;
};

export type EstimateDetails = {
  estimateNumber: string;
  date: string;
  customer: EstimateCustomer;
  items: CartItem[];
};

function inr(value: number) {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function safeFilePart(value: string) {
  return value.replace(/[^a-zA-Z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}

async function loadLogo() {
  try {
    const response = await fetch("/brand-logo.png");
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise<{ data: string; format: "JPEG" } | null>((resolve) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(blob);
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 220;
        canvas.height = 220;
        const context = canvas.getContext("2d");
        if (!context) {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
          return;
        }
        context.fillStyle = "#050505";
        context.fillRect(0, 0, 220, 220);
        context.drawImage(image, 0, 0, 220, 220);
        URL.revokeObjectURL(objectUrl);
        resolve({ data: canvas.toDataURL("image/jpeg", 0.84), format: "JPEG" });
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      };
      image.src = objectUrl;
    });
  } catch {
    return null;
  }
}

export async function createEstimatePdf(details: EstimateDetails) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = 210;
  const margin = 10;
  const right = pageWidth - margin;
  const contentWidth = pageWidth - margin * 2;
  const line = (x1: number, y1: number, x2: number, y2: number, width = 0.25) => {
    doc.setDrawColor(32, 32, 32);
    doc.setLineWidth(width);
    doc.line(x1, y1, x2, y2);
  };

  const cellText = (
    value: string,
    x: number,
    y: number,
    width: number,
    align: "left" | "center" | "right" = "left",
    bold = false,
    size = 7,
  ) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(32, 32, 32);
    const padding = 1.4;
    const textX = align === "left" ? x + padding : align === "right" ? x + width - padding : x + width / 2;
    doc.text(value, textX, y, { align });
  };

  doc.setDrawColor(32, 32, 32);
  doc.setTextColor(32, 32, 32);
  doc.setLineWidth(0.3);
  doc.rect(margin, 10, contentWidth, 277);

  // Top estimate band.
  doc.setFillColor(238, 238, 238);
  doc.rect(margin, 10, contentWidth, 7, "FD");
  cellText(`Estimate No: ${details.estimateNumber}`, margin, 14.7, 64, "left", false, 7);
  cellText("ORDER ESTIMATE", margin + 64, 14.7, 62, "center", true, 9);
  cellText(`Date: ${details.date}`, margin + 126, 14.7, 64, "right", false, 7);

  // Shop identity.
  line(margin, 24, right, 24);
  cellText("Mobile: +91 85240 90862 / +91 83448 06268", margin, 21.5, 110, "left", true, 7);
  cellText("WhatsApp orders only - No online payment", margin + 110, 21.5, 80, "right", true, 7);

  const logo = await loadLogo();
  if (logo) {
    try {
      doc.addImage(logo.data, logo.format, 94, 26, 22, 22);
    } catch {
      // The estimate remains usable if a browser cannot decode the logo.
    }
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(20, 20, 20);
  doc.text("NATPE THUNAI CRACKERS", pageWidth / 2, 52, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.text("Athupalayam Stop, Sivakasi Road, Virudhunagar, Tamil Nadu, India", pageWidth / 2, 56.2, { align: "center" });
  doc.setFontSize(6.4);
  doc.setTextColor(100, 100, 100);
  doc.text("Quality crackers, family combos and festive favourites", pageWidth / 2, 60, { align: "center" });

  // Customer details.
  const customerTop = 64;
  const customerBottom = 91;
  line(margin, customerTop, right, customerTop);
  line(margin, customerBottom, right, customerBottom);
  doc.setFillColor(247, 247, 247);
  doc.rect(margin, customerTop, contentWidth, 6, "F");
  cellText("CUSTOMER DETAILS", margin, customerTop + 4.2, contentWidth, "left", true, 7.4);
  cellText(`Name: ${details.customer.name}`, margin, 74.3, 93, "left", true, 7);
  cellText(`Mobile: ${details.customer.mobile}`, margin + 95, 74.3, 95, "left", false, 7);
  if (details.customer.email) {
    cellText(`Email: ${details.customer.email}`, margin, 79.2, 190, "left", false, 7);
  }
  const addressLines = doc.splitTextToSize(`Address: ${details.customer.address}`, 182) as string[];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(32, 32, 32);
  doc.text(addressLines.slice(0, 2), margin + 1.4, details.customer.email ? 84 : 80, { lineHeightFactor: 1.25 });

  // Product table.
  const columns = [10, 22, 39, 119, 139, 153, 174, 200];
  const tableTop = 91;
  const headerHeight = 7;
  doc.setFillColor(238, 238, 238);
  doc.rect(margin, tableTop, contentWidth, headerHeight, "F");
  line(margin, tableTop, right, tableTop);
  line(margin, tableTop + headerHeight, right, tableTop + headerHeight);
  columns.forEach((x) => line(x, tableTop, x, tableTop + headerHeight));
  cellText("S.No", 10, 95.8, 12, "center", true, 6.5);
  cellText("Code", 22, 95.8, 17, "center", true, 6.5);
  cellText("Product Name", 39, 95.8, 80, "center", true, 6.5);
  cellText("Content", 119, 95.8, 20, "center", true, 6.5);
  cellText("Qty", 139, 95.8, 14, "center", true, 6.5);
  cellText("Rate", 153, 95.8, 21, "center", true, 6.5);
  cellText("Amount", 174, 95.8, 26, "center", true, 6.5);

  const rowHeight = 7.1;
  let y = tableTop + headerHeight;
  let originalSubtotal = 0;
  let offerTotal = 0;

  details.items.forEach((item, index) => {
    const originalPrice = item.originalPrice ?? Math.round(item.price / 0.3);
    const amount = originalPrice * item.quantity;
    originalSubtotal += amount;
    offerTotal += item.price * item.quantity;
    if (index % 2 === 1) {
      doc.setFillColor(249, 249, 249);
      doc.rect(margin, y, contentWidth, rowHeight, "F");
    }
    line(margin, y + rowHeight, right, y + rowHeight);
    columns.forEach((x) => line(x, y, x, y + rowHeight));
    cellText(String(index + 1), 10, y + 4.8, 12, "center", false, 6.5);
    cellText(`NTC-${String(index + 1).padStart(3, "0")}`, 22, y + 4.8, 17, "center", false, 5.7);
    const productName = doc.splitTextToSize(item.name, 75)[0] as string;
    cellText(productName, 39, y + 4.8, 80, "left", false, 6.4);
    cellText("1 Pkt", 119, y + 4.8, 20, "center", false, 6.3);
    cellText(String(item.quantity), 139, y + 4.8, 14, "center", false, 6.5);
    cellText(inr(originalPrice), 153, y + 4.8, 21, "right", false, 6.4);
    cellText(inr(amount), 174, y + 4.8, 26, "right", false, 6.4);
    y += rowHeight;
  });

  // Totals mirror the supplied estimate style.
  const discount = originalSubtotal - offerTotal;
  const summaryRows = [
    ["Sub Total", originalSubtotal],
    ["Discount (70%)", discount],
    ["Estimated Total", offerTotal],
  ] as const;
  summaryRows.forEach(([label, value], index) => {
    const rowY = y + index * 6.5;
    if (index !== 1) {
      doc.setFillColor(index === 2 ? 224 : 238, index === 2 ? 224 : 238, index === 2 ? 224 : 238);
      doc.rect(margin, rowY, contentWidth, 6.5, "F");
    }
    line(margin, rowY, right, rowY);
    line(margin, rowY + 6.5, right, rowY + 6.5);
    line(174, rowY, 174, rowY + 6.5);
    cellText(label, margin, rowY + 4.6, 164, "right", true, 6.8);
    cellText(inr(value), 174, rowY + 4.6, 26, "right", true, 6.8);
  });
  y += summaryRows.length * 6.5;

  // Estimate notes and footer.
  const noteTop = Math.max(y + 5, 242);
  doc.setFillColor(255, 247, 241);
  doc.setDrawColor(217, 80, 35);
  doc.roundedRect(margin + 3, noteTop, contentWidth - 6, 22, 2, 2, "FD");
  doc.setTextColor(217, 80, 35);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.text("ORDER ESTIMATE - NOT A TAX INVOICE", margin + 7, noteTop + 6);
  doc.setTextColor(65, 65, 65);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.4);
  doc.text(
    [
      "GST/tax is not included because tax details have not been supplied. The shop will confirm applicable tax,",
      "product availability and the final payable amount before accepting this order. No online payment was collected.",
    ],
    margin + 7,
    noteTop + 11,
    { lineHeightFactor: 1.35 },
  );

  doc.setDrawColor(32, 32, 32);
  line(margin, 276, right, 276);
  cellText(`Total Items: ${details.items.reduce((sum, item) => sum + item.quantity, 0)}`, margin, 281, 70, "left", true, 7);
  cellText(`Overall Total: Rs. ${inr(offerTotal)}`, margin + 70, 281, 120, "right", true, 7.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.setTextColor(110, 110, 110);
  doc.text("Generated from the Natpe Thunai Crackers website", pageWidth / 2, 285, { align: "center" });

  const fileName = `Natpe-Thunai-Estimate-${safeFilePart(details.estimateNumber)}.pdf`;
  return { doc, fileName };
}

export async function downloadEstimatePdf(details: EstimateDetails) {
  const result = await createEstimatePdf(details);
  result.doc.save(result.fileName);
  return result.fileName;
}
