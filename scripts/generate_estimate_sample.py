from pathlib import Path
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "natpe-thunai-order-estimate-sample.pdf"
LOGO = ROOT / "public" / "brand-logo.png"

ITEMS = [
    ("Golden Flower Pots", 1, 900),
    ("Colour Flower Pots", 2, 1200),
    ("Deluxe Fountains", 1, 1800),
    ("Ground Chakkar Big", 1, 700),
    ("Deluxe Chakkars", 1, 1000),
    ("Special Ground Wheels", 1, 1500),
    ("Electric Sparklers", 3, 300),
    ("Colour Sparklers", 2, 500),
    ("Long Sparklers", 1, 800),
    ("12-Shot Celebration", 1, 1500),
    ("30-Shot Sky Show", 1, 3000),
    ("60-Shot Grand Finale", 1, 6000),
    ("Family Starter Box", 1, 2500),
    ("Celebration Selection", 1, 4000),
    ("Premium Festival Box", 1, 7500),
    ("Classic Atom Bombs", 1, 600),
    ("Hydro Bomb Range", 1, 1100),
    ("Giant Crackers", 1, 2000),
]


def money(value: float) -> str:
    return f"{value:,.2f}"


def text(c, value, x, y, size=7, bold=False, align="left"):
    c.setFont("Helvetica-Bold" if bold else "Helvetica", size)
    if align == "right":
        c.drawRightString(x, y, value)
    elif align == "center":
        c.drawCentredString(x, y, value)
    else:
        c.drawString(x, y, value)


def generate():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4)
    width, height = A4
    left, right = 28, width - 28
    top, bottom = height - 28, 28

    c.setStrokeColor(colors.HexColor("#202020"))
    c.setLineWidth(0.7)
    c.rect(left, bottom, right - left, top - bottom)

    # Estimate band.
    band_h = 21
    c.setFillColor(colors.HexColor("#eeeeee"))
    c.rect(left, top - band_h, right - left, band_h, fill=1, stroke=1)
    c.setFillColor(colors.HexColor("#202020"))
    text(c, "Estimate No: NTC-20260813-10001", left + 5, top - 14, 7)
    text(c, "ORDER ESTIMATE", width / 2, top - 14, 9, True, "center")
    text(c, "Date: 13/08/2026", right - 5, top - 14, 7, False, "right")

    contact_y = top - 35
    text(c, "Mobile: +91 85240 90862 / +91 83448 06268", left + 5, contact_y, 7, True)
    text(c, "WhatsApp orders only - No online payment", right - 5, contact_y, 7, True, "right")
    c.line(left, top - 42, right, top - 42)

    if LOGO.exists():
        with Image.open(LOGO) as source:
            source.thumbnail((220, 220))
            compressed = BytesIO()
            source.convert("RGB").save(compressed, format="JPEG", quality=84, optimize=True)
            compressed.seek(0)
            c.drawImage(ImageReader(compressed), width / 2 - 23, top - 92, 46, 46, preserveAspectRatio=True, mask="auto")
    text(c, "NATPE THUNAI CRACKERS", width / 2, top - 104, 13, True, "center")
    text(c, "Athupalayam Stop, Sivakasi Road, Virudhunagar, Tamil Nadu, India", width / 2, top - 118, 7, False, "center")
    text(c, "Quality crackers, family combos and festive favourites", width / 2, top - 130, 6, False, "center")

    # Customer block.
    cust_top = top - 142
    cust_bottom = cust_top - 74
    c.line(left, cust_top, right, cust_top)
    c.setFillColor(colors.HexColor("#f7f7f7"))
    c.rect(left, cust_top - 18, right - left, 18, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#202020"))
    text(c, "CUSTOMER DETAILS", left + 5, cust_top - 13, 7, True)
    text(c, "Name: Sample Customer", left + 5, cust_top - 31, 7, True)
    text(c, "Mobile: 98765 43210", width / 2 + 10, cust_top - 31, 7)
    text(c, "Email: customer@example.com", left + 5, cust_top - 45, 7)
    text(c, "Address: 24 Sample Street, Virudhunagar, Tamil Nadu - 626001", left + 5, cust_top - 59, 7)
    c.line(left, cust_bottom, right, cust_bottom)

    # Product table.
    table_top = cust_bottom
    cols = [left, left + 38, left + 88, left + 318, left + 374, left + 415, left + 478, right]
    headers = ["S.No", "Code", "Product Name", "Content", "Qty", "Rate", "Amount"]
    header_h, row_h = 21, 15
    c.setFillColor(colors.HexColor("#eeeeee"))
    c.rect(left, table_top - header_h, right - left, header_h, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#202020"))
    for x in cols:
        c.line(x, table_top, x, table_top - header_h)
    c.line(left, table_top - header_h, right, table_top - header_h)
    for i, label in enumerate(headers):
        text(c, label, (cols[i] + cols[i + 1]) / 2, table_top - 14, 6.5, True, "center")

    y = table_top - header_h
    subtotal = 0
    for index, (name, qty, rate) in enumerate(ITEMS, start=1):
        amount = qty * rate
        subtotal += amount
        if index % 2 == 0:
            c.setFillColor(colors.HexColor("#fafafa"))
            c.rect(left, y - row_h, right - left, row_h, fill=1, stroke=0)
            c.setFillColor(colors.HexColor("#202020"))
        for x in cols:
            c.line(x, y, x, y - row_h)
        c.line(left, y - row_h, right, y - row_h)
        values = [str(index), f"NTC-{index:03d}", name, "1 Pkt", str(qty), money(rate), money(amount)]
        aligns = ["center", "center", "left", "center", "center", "right", "right"]
        for col_index, value in enumerate(values):
            if aligns[col_index] == "left":
                x = cols[col_index] + 4
            elif aligns[col_index] == "right":
                x = cols[col_index + 1] - 4
            else:
                x = (cols[col_index] + cols[col_index + 1]) / 2
            text(c, value, x, y - 10.5, 6.1, False, aligns[col_index])
        y -= row_h

    discount = subtotal * 0.70
    total = subtotal - discount
    for index, (label, value) in enumerate([
        ("Sub Total", subtotal),
        ("Discount (70%)", discount),
        ("Estimated Total", total),
    ]):
        if index != 1:
            c.setFillColor(colors.HexColor("#e8e8e8" if index == 2 else "#f0f0f0"))
            c.rect(left, y - 17, right - left, 17, fill=1, stroke=0)
            c.setFillColor(colors.HexColor("#202020"))
        c.line(left, y, right, y)
        c.line(left, y - 17, right, y - 17)
        c.line(cols[-2], y, cols[-2], y - 17)
        text(c, label, cols[-2] - 5, y - 12, 6.8, True, "right")
        text(c, money(value), right - 5, y - 12, 6.8, True, "right")
        y -= 17

    note_top = max(bottom + 68, y - 18)
    c.setFillColor(colors.HexColor("#fff7f1"))
    c.setStrokeColor(colors.HexColor("#d95023"))
    c.roundRect(left + 8, note_top - 48, right - left - 16, 48, 5, fill=1, stroke=1)
    c.setFillColor(colors.HexColor("#202020"))
    text(c, "ORDER ESTIMATE - NOT A TAX INVOICE", left + 18, note_top - 14, 7.2, True)
    text(c, "GST/tax is not included because tax details have not been supplied. The shop will confirm applicable tax,", left + 18, note_top - 29, 6.1)
    text(c, "product availability and final payable amount. No online payment was collected.", left + 18, note_top - 40, 6.1)

    footer_y = bottom + 20
    c.setStrokeColor(colors.HexColor("#202020"))
    c.line(left, footer_y + 12, right, footer_y + 12)
    text(c, f"Total Items: {sum(qty for _, qty, _ in ITEMS)}", left + 5, footer_y, 7, True)
    text(c, f"Overall Total: Rs. {money(total)}", right - 5, footer_y, 7.5, True, "right")
    text(c, "Generated from the Natpe Thunai Crackers website", width / 2, bottom + 5, 5.8, False, "center")

    c.showPage()
    c.save()
    print(OUTPUT.name)


if __name__ == "__main__":
    generate()
