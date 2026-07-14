"""Import product_pictures.zip assets into public/products with clean transparent PNGs."""
from __future__ import annotations

import json
import re
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "product_pictures_extracted"
OUT = ROOT / "public" / "products"
OUT.mkdir(parents=True, exist_ok=True)
SIZE = 1600
PAD_RATIO = 0.08

# WhatsApp filename -> catalog slug
MAPPING: list[tuple[str, str]] = [
    ("WhatsApp Image 2026-07-14 at 10.34.13.jpeg", "make-sa-great-again-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.14.jpeg", "girls-first-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.17.jpeg", "horny-ny-sweats"),
    ("WhatsApp Image 2026-07-14 at 10.34.18.jpeg", "horny-ny-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.20.jpeg", "renaissance-lnd-winter-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.21.jpeg", "renaissance-landscape-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.23.jpeg", "bdg-public-enemy-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.24.jpeg", "renaissance-stars-flame-hoodie"),
    ("WhatsApp Image 2026-07-14 at 10.34.24 (1).jpeg", "high-sex-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.25.jpeg", "i-love-ass-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.25 (1).jpeg", "sex-distressed-tank"),
    ("WhatsApp Image 2026-07-14 at 10.34.26.jpeg", "naked-distressed-tank"),
    ("WhatsApp Image 2026-07-14 at 10.34.26 (1).jpeg", "pan-african-logo-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.26 (2).jpeg", "money-makes-me-tank"),
    ("WhatsApp Image 2026-07-14 at 10.34.27.jpeg", "no-hoes-baby-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.27 (1).jpeg", "bdg-pixel-green-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.27 (2).jpeg", "bdg-crayon-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.28.jpeg", "horny-ny-baby-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.28 (1).jpeg", "no-hoes-allowed-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.29.jpeg", "camo-stars-shorts"),
    ("WhatsApp Image 2026-07-14 at 10.34.30.jpeg", "camo-graffiti-cap"),
    ("WhatsApp Image 2026-07-14 at 10.34.30 (1).jpeg", "logo-denim-shorts"),
    ("WhatsApp Image 2026-07-14 at 10.34.30 (2).jpeg", "ebony-baby-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.31.jpeg", "ebony-denim-mini"),
    ("WhatsApp Image 2026-07-14 at 10.34.32.jpeg", "ebony-block-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.32 (1).jpeg", "pornstar-tee"),
    ("WhatsApp Image 2026-07-14 at 10.34.34.jpeg", "ebony-ny-tee"),
]


def sort_key(name: str) -> tuple:
    base = name.replace(" (1)", "_1").replace(" (2)", "_2")
    m = re.search(r"10\.34\.(\d+)", base)
    n = int(m.group(1)) if m else 0
    sub = 2 if " (2)" in name else (1 if " (1)" in name else 0)
    return (n, sub)


def remove_white_bg(img: Image.Image, threshold: int = 248) -> Image.Image:
    """Fast white/near-white background removal."""
    rgba = img.convert("RGBA")
    arr = np.array(rgba, dtype=np.float32)
    rgb = arr[..., :3]
    # distance from white
    dist = np.sqrt(((255.0 - rgb) ** 2).sum(axis=-1))
    alpha = np.clip((dist - 8) / 35.0 * 255.0, 0, 255).astype(np.uint8)
    # Also kill very light pixels directly
    light = (rgb.min(axis=-1) > threshold)
    alpha[light] = 0
    arr[..., 3] = alpha
    out = Image.fromarray(arr.astype(np.uint8), "RGBA")
    # soften edges
    a = out.getchannel("A").filter(ImageFilter.GaussianBlur(0.8))
    out.putalpha(a)
    return out


def process(img: Image.Image) -> Image.Image:
    # upscale small whatsapp images for sharper display
    if max(img.size) < 900:
        scale = 900 / max(img.size)
        img = img.resize(
            (int(img.width * scale), int(img.height * scale)),
            Image.Resampling.LANCZOS,
        )

    cut = remove_white_bg(img)
    bbox = cut.getbbox()
    if bbox:
        cut = cut.crop(bbox)

    pad = int(max(cut.size) * PAD_RATIO)
    padded = Image.new("RGBA", (cut.width + pad * 2, cut.height + pad * 2), (0, 0, 0, 0))
    padded.paste(cut, (pad, pad), cut)

    fitted = ImageOps.contain(padded, (SIZE, SIZE), method=Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    ox = (SIZE - fitted.width) // 2
    oy = (SIZE - fitted.height) // 2
    canvas.paste(fitted, (ox, oy), fitted)
    return canvas


def main() -> None:
    seen_slugs: set[str] = set()
    imported = []

    for fname, slug in MAPPING:
        if slug in seen_slugs:
            print(f"SKIP duplicate slug {slug} <- {fname}")
            continue

        src = SRC / fname
        if not src.exists():
            print(f"MISSING {fname}")
            continue

        out_path = OUT / f"{slug}.png"
        img = Image.open(src)
        result = process(img)
        result.save(out_path, "PNG", optimize=True)
        seen_slugs.add(slug)
        imported.append(slug)
        print(f"OK  {slug}  ({result.size[0]}px)")

    print(f"\nImported {len(imported)} product images")
    return imported


if __name__ == "__main__":
    main()
