"""Generate the PWA / home-screen icons from the app's own tokens.

Run:  python scripts/generate_icons.py
Writes into icons/. Re-run only if the brand mark changes.
"""
import os
from PIL import Image, ImageDraw, ImageFont

BG = (10, 10, 15)          # --bg
ACCENT = (74, 158, 255)    # --accent
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "icons")

FONT_CANDIDATES = [
    r"C:\Windows\Fonts\segoeuib.ttf",
    r"C:\Windows\Fonts\arialbd.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def load_font(size):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def draw_mark(size, pad_ratio, rounded):
    """Dark ground, accent-tinted rounded plate, 'DL' centred on it."""
    img = Image.new("RGBA", (size, size), BG + (255,))
    d = ImageDraw.Draw(img)
    pad = int(size * pad_ratio)
    box = (pad, pad, size - pad, size - pad)
    radius = int((size - 2 * pad) * 0.24)
    if rounded:
        d.rounded_rectangle(box, radius=radius, fill=(18, 30, 48, 255),
                            outline=ACCENT + (110,), width=max(2, size // 96))
    inner = size - 2 * pad
    font = load_font(int(inner * 0.42))
    text = "DL"
    l, t, r, b = d.textbbox((0, 0), text, font=font)
    d.text((size / 2 - (r + l) / 2, size / 2 - (b + t) / 2), text, font=font, fill=ACCENT + (255,))
    return img


def main():
    os.makedirs(OUT, exist_ok=True)
    specs = [
        ("icon-192.png", 192, 0.14, True),
        ("icon-512.png", 512, 0.14, True),
        # Maskable: art must survive a circular crop, so keep it well inside.
        ("icon-maskable-512.png", 512, 0.22, True),
        ("apple-touch-icon.png", 180, 0.10, True),
        ("favicon-32.png", 32, 0.06, False),
    ]
    for name, size, pad, rounded in specs:
        path = os.path.join(OUT, name)
        draw_mark(size, pad, rounded).save(path)
        print("wrote", path)


if __name__ == "__main__":
    main()
