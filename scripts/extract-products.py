"""Re-extract products: looser crops, transparent backgrounds, higher res."""
from __future__ import annotations

import json
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps

ASSETS = Path(
    r"C:\Users\Lenovo\.cursor\projects\c-Users-Lenovo-Downloads-renaissance-e-commerce-platform-1\assets"
)
OUT = Path(__file__).resolve().parents[1] / "public" / "products"
OUT.mkdir(parents=True, exist_ok=True)

SIZE = 1400  # output canvas (square; cards use object-contain)


def find_asset(short: str) -> Path:
    matches = list(ASSETS.glob(f"*{short}*.png"))
    if not matches:
        raise FileNotFoundError(short)
    return matches[0]


def crop_grid(
    img: Image.Image,
    rows: int,
    cols: int,
    pad_x: float = 0.02,
    pad_y: float = 0.02,
    inset: float = 0.012,
) -> list[Image.Image]:
    w, h = img.size
    left = int(w * pad_x)
    top = int(h * pad_y)
    right = int(w * (1 - pad_x))
    bottom = int(h * (1 - pad_y))
    usable_w = right - left
    usable_h = bottom - top
    cell_w = usable_w / cols
    cell_h = usable_h / rows
    crops: list[Image.Image] = []
    for r in range(rows):
        for c in range(cols):
            x0 = left + int(c * cell_w + cell_w * inset)
            y0 = top + int(r * cell_h + cell_h * inset)
            x1 = left + int((c + 1) * cell_w - cell_w * inset)
            y1 = top + int((r + 1) * cell_h - cell_h * inset)
            crops.append(img.crop((x0, y0, x1, y1)))
    return crops


def crop_cells(
    img: Image.Image,
    cells: list[tuple[float, float, float, float]],
) -> list[Image.Image]:
    w, h = img.size
    return [
        img.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))
        for x0, y0, x1, y1 in cells
    ]


def _sample_bg(rgb: Image.Image) -> tuple[float, float, float]:
    w, h = rgb.size
    pts = [
        (2, 2),
        (w - 3, 2),
        (2, h - 3),
        (w - 3, h - 3),
        (w // 2, 2),
        (w // 2, h - 3),
        (2, h // 2),
        (w - 3, h // 2),
    ]
    samples = []
    px = rgb.load()
    for x, y in pts:
        samples.append(px[x, y])
    # median-ish via sort
    rs = sorted(s[0] for s in samples)
    gs = sorted(s[1] for s in samples)
    bs = sorted(s[2] for s in samples)
    mid = len(samples) // 2
    return float(rs[mid]), float(gs[mid]), float(bs[mid])


def remove_background(img: Image.Image, tol: float = 42.0) -> Image.Image:
    """Flood-fill soft bg wipe from edges — keeps garment, drops collage floor."""
    # Upscale for cleaner edges before masking
    scale = max(1, int(round(720 / max(img.size))))
    if scale > 1:
        img = img.resize((img.width * scale, img.height * scale), Image.Resampling.LANCZOS)
    elif max(img.size) < 500:
        img = img.resize((img.width * 2, img.height * 2), Image.Resampling.LANCZOS)

    try:
        from rembg import remove as rembg_remove

        cut = rembg_remove(img.convert("RGBA"))
        return cut
    except Exception:
        pass

    rgb = img.convert("RGB")
    w, h = rgb.size
    br, bg, bb = _sample_bg(rgb)
    px = rgb.load()
    visited = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def is_bg(x: int, y: int) -> bool:
        r, g, b = px[x, y]
        return ((r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2) ** 0.5 <= tol

    for x in range(w):
        for y in (0, h - 1):
            if is_bg(x, y):
                q.append((x, y))
                visited[y][x] = True
    for y in range(h):
        for x in (0, w - 1):
            if not visited[y][x] and is_bg(x, y):
                q.append((x, y))
                visited[y][x] = True

    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx] and is_bg(nx, ny):
                visited[ny][nx] = True
                q.append((nx, ny))

    rgba = img.convert("RGBA")
    out = rgba.copy()
    opx = out.load()
    for y in range(h):
        for x in range(w):
            if visited[y][x]:
                r, g, b, _ = opx[x, y]
                # soft fade near threshold
                dist = ((r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2) ** 0.5
                alpha = 0 if dist < tol * 0.85 else int(max(0, min(255, (dist - tol * 0.85) / (tol * 0.25) * 255)))
                opx[x, y] = (r, g, b, alpha)

    # Feather mask edges
    alpha = out.getchannel("A").filter(ImageFilter.GaussianBlur(1.2))
    out.putalpha(alpha)
    return out


def trim_and_pad(img: Image.Image, pad_ratio: float = 0.08) -> Image.Image:
    """Trim transparent margins then pad evenly on transparent canvas."""
    bbox = img.getbbox()
    if not bbox:
        return img
    trimmed = img.crop(bbox)
    tw, th = trimmed.size
    pad = int(max(tw, th) * pad_ratio)
    canvas_w = tw + pad * 2
    canvas_h = th + pad * 2
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    canvas.paste(trimmed, (pad, pad), trimmed)
    return canvas


def save(img: Image.Image, slug: str) -> str:
    cut = remove_background(img)
    cut = trim_and_pad(cut, pad_ratio=0.1)
    # Fit into SIZE x SIZE transparent frame
    fitted = ImageOps.contain(cut, (SIZE, SIZE), method=Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    ox = (SIZE - fitted.width) // 2
    oy = (SIZE - fitted.height) // 2
    canvas.paste(fitted, (ox, oy), fitted)
    path = OUT / f"{slug}.png"
    canvas.save(path, "PNG", optimize=True)
    return f"/products/{slug}.png"


# Keep same sheet map as before
SHEETS: list[dict] = [
    {
        "id": "3983890f",
        "mode": "grid",
        "rows": 3,
        "cols": 3,
        "inset": 0.008,
        "items": [
            ("make-sa-great-again-tee", "Make SA Great Again Tee", "Tops", "Renaissance Tees", 350),
            ("girls-first-tee", "Girls First Tee", "Tops", "Renaissance Tees", 350),
            ("renaissance-landscape-tee", "Renaissance Landscape Tee", "Tops", "Renaissance Tees", 350),
            ("no-hoes-allowed-tee", "No Hoes Allowed Tee", "Tops", "Renaissance Tees", 350),
            ("renaissance-lnd-winter-tee", "Renaissance L.N.D Winter Tee", "Tops", "Renaissance Tees", 350),
            ("pornstar-tee", "You've Just Seen A... Tee", "Tops", "Renaissance Tees", 350),
            ("i-love-ass-tee", "I Love A$$ Tee", "Tops", "Renaissance Tees", 350),
            ("horny-ny-tee", "HOR NY Tee", "Tops", "Renaissance Tees", 350),
            ("jack-portrait-tee", "Jack Portrait Tee", "Tops", "Renaissance Tees", 380),
        ],
    },
    {
        "id": "8f291c34",
        "mode": "grid",
        "rows": 3,
        "cols": 3,
        "inset": 0.008,
        "items": [
            ("renaissance-00-jersey", "Renaissance 00 Jersey", "Tops", "Renaissance Tees", 380),
            ("so-sick-tee", "So Sick Of This Shit Tee", "Tops", "Renaissance Tees", 350),
            ("love-tag-tee", "Love Tag Tee", "Tops", "Renaissance Tees", 350),
            ("high-sex-tee", "I Want To Get High Tee", "Tops", "Renaissance Tees", 350),
            ("renaissance-lnd-crop", "Renaissance L.N.D Crop", "Tops", "Renaissance Tees", 320),
            ("i-heart-renaissance-tee", "I Heart Renaissance Tee", "Tops", "Renaissance Tees", 350),
            ("faces-grid-tee", "Faces Grid Tee", "Tops", "Renaissance Tees", 380),
            ("infant-boys-club-tee", "Infant Boys Club Tee", "Tops", "Renaissance Tees", 350),
            ("pan-african-logo-tee", "Pan-African Logo Tee", "Tops", "Renaissance Tees", 350),
        ],
    },
    {
        "id": "c27e404b",
        "mode": "cells",
        "cells": [
            (0.01, 0.01, 0.35, 0.54),
            (0.33, 0.01, 0.67, 0.54),
            (0.65, 0.01, 0.99, 0.54),
            (0.10, 0.48, 0.52, 0.99),
            (0.48, 0.48, 0.90, 0.99),
        ],
        "items": [
            ("renaissance-logo-crewneck", "Renaissance Logo Crewneck", "Outerwear", "Heavyweight", 550),
            ("renaissance-logo-hoodie", "Renaissance Logo Hoodie", "Outerwear", "Heavyweight", 650),
            ("renaissance-stars-flame-hoodie", "Stars & Flame Hoodie", "Outerwear", "Heavyweight", 720),
            ("renaissance-eagles-hoodie", "Renaissance Eagles Hoodie", "Outerwear", "Heavyweight", 720),
            ("billion-dollar-gang-crewneck", "Billion Dollar Gang Crewneck", "Outerwear", "Billion Dollar Gang", 600),
        ],
    },
    {
        "id": "13fa317c",
        "mode": "grid",
        "rows": 2,
        "cols": 3,
        "pad_x": 0.02,
        "pad_y": 0.02,
        "inset": 0.01,
        "items": [
            ("crimson-sleeve-script-crew", "Crimson Angels Sleeve Script", "Outerwear", "Crimson Angels", 580),
            ("crimson-polo", "Crimson Angels Polo", "Tops", "Crimson Angels", 450),
            ("crimson-monroe-crew", "Crimson Angels Monroe Crew", "Outerwear", "Crimson Angels", 620),
            ("crimson-script-hoodie", "Crimson Angels Script Hoodie", "Outerwear", "Crimson Angels", 680),
            ("crimson-side-tank", "Crimson Angels Side Tank", "Tops", "Crimson Angels", 320),
            ("crimson-lagos-crest-crew", "Crimson Angels Lagos Crest", "Outerwear", "Crimson Angels", 600),
        ],
    },
    {
        "id": "defae902",
        "mode": "grid",
        "rows": 3,
        "cols": 3,
        "inset": 0.008,
        "items": [
            ("bdg-astronaut-black-tee", "BDG Astronaut Tee (Black)", "Tops", "Billion Dollar Gang", 350),
            ("bdg-public-enemy-tee", "BDG Public Enemy Tee", "Tops", "Billion Dollar Gang", 380),
            ("bdg-block-logo-tee", "BDG Block Logo Tee", "Tops", "Billion Dollar Gang", 350),
            ("bdg-astronaut-white-tee", "BDG Astronaut Tee (White)", "Tops", "Billion Dollar Gang", 350),
            ("bdg-chrome-figure-tee", "BDG Chrome Figure Tee", "Tops", "Billion Dollar Gang", 400),
            ("bdg-diamond-figure-tee", "BDG Diamond Figure Tee", "Tops", "Billion Dollar Gang", 400),
            ("bdg-crayon-tee", "BDG Crayon Tee", "Tops", "Billion Dollar Gang", 400),
            ("we-are-fucking-angry-tee", "We Are Fucking Angry Tee", "Tops", "Renaissance Tees", 350),
            ("bdg-pixel-green-tee", "BDG Pixel Green Tee", "Tops", "Billion Dollar Gang", 350),
        ],
    },
    {
        "id": "648d7187",
        "mode": "grid",
        "rows": 4,
        "cols": 3,
        "pad_x": 0.02,
        "pad_y": 0.015,
        "inset": 0.01,
        "items": [
            ("no-hoes-baby-tee", "No Hoes Allowed Baby Tee", "Tops", "Girls Drop", 320),
            ("money-makes-me-tank", "Money Makes Me Tank", "Tops", "Girls Drop", 280),
            ("girls-first-baby-tee", "Girls First Baby Tee", "Tops", "Girls Drop", 320),
            ("love-tag-baby-tee", "Love Tag Baby Tee", "Tops", "Girls Drop", 320),
            ("horny-ny-baby-tee", "HOR NY Baby Tee", "Tops", "Girls Drop", 320),
            ("naked-distressed-tank", "NAKED Distressed Tank", "Tops", "Girls Drop", 300),
            ("naked-denim-mini", "NAKED Denim Mini", "Bottoms", "Girls Drop", 420),
            ("sex-distressed-tank", "SEX. Distressed Tank", "Tops", "Girls Drop", 300),
            ("ebony-baby-tee", "EBONY Baby Tee", "Tops", "Girls Drop", 300),
            ("halo-girl-tank", "Halo Girl Tank", "Tops", "Girls Drop", 320),
            ("ebony-denim-mini", "EBONY Denim Mini", "Bottoms", "Girls Drop", 420),
            ("mowa-shorts", "MOWA Shorts", "Bottoms", "Girls Drop", 280),
        ],
    },
    {
        "id": "ab5ef478",
        "mode": "grid",
        "rows": 2,
        "cols": 3,
        "inset": 0.01,
        "items": [
            ("camo-stars-shorts", "Camo Stars Shorts", "Bottoms", "Bottoms Archive", 450),
            ("logo-denim-shorts", "Renaissance Logo Shorts", "Bottoms", "Bottoms Archive", 420),
            ("flame-side-shorts", "Flame Side Shorts", "Bottoms", "Bottoms Archive", 450),
            ("vertical-logo-sweats", "Vertical Logo Sweats", "Bottoms", "Bottoms Archive", 520),
            ("horny-ny-sweats", "HOR NY Sweats", "Bottoms", "Bottoms Archive", 520),
            ("logo-seat-joggers", "Logo Seat Joggers", "Bottoms", "Bottoms Archive", 500),
        ],
    },
    {
        "id": "61cb90f9",
        "mode": "cells",
        "cells": [
            (0.01, 0.02, 0.35, 0.54),
            (0.33, 0.01, 0.67, 0.54),
            (0.65, 0.02, 0.99, 0.54),
            (0.08, 0.48, 0.50, 0.99),
            (0.50, 0.48, 0.92, 0.99),
        ],
        "items": [
            ("crimson-angels-beanie", "Crimson Angels Beanie", "Accessories", "Crimson Angels", 220),
            ("camo-graffiti-cap", "Camo Graffiti Cap", "Accessories", "Accessories", 280),
            ("ebony-block-tee", "EBONY Block Tee", "Tops", "Girls Drop", 300),
            ("crimson-heart-tee", "Crimson Angels Heart Tee", "Tops", "Crimson Angels", 350),
            ("ebony-ny-tee", "EBONY NY Tee", "Tops", "Girls Drop", 320),
        ],
    },
]


def main() -> None:
    catalog = []
    for sheet in SHEETS:
        img = Image.open(find_asset(sheet["id"])).convert("RGB")
        items = sheet["items"]
        if sheet["mode"] == "grid":
            crops = crop_grid(
                img,
                sheet["rows"],
                sheet["cols"],
                pad_x=sheet.get("pad_x", 0.02),
                pad_y=sheet.get("pad_y", 0.02),
                inset=sheet.get("inset", 0.012),
            )
        else:
            crops = crop_cells(img, sheet["cells"])

        assert len(crops) == len(items), f"{sheet['id']}: {len(crops)} vs {len(items)}"
        for crop, (slug, name, category, collection, price) in zip(crops, items):
            path = save(crop, slug)
            catalog.append(
                {
                    "slug": slug,
                    "name": name,
                    "category": category,
                    "collection": collection,
                    "price": price,
                    "image": path,
                }
            )
            print(f"OK  {slug}")

    (OUT / "_catalog.json").write_text(json.dumps(catalog, indent=2), encoding="utf-8")
    print(f"\nDone — {len(catalog)} transparent products")


if __name__ == "__main__":
    main()
