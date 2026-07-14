"""Extract individual garment crops from Canva collage sheets."""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageOps

ASSETS = Path(
    r"C:\Users\Lenovo\.cursor\projects\c-Users-Lenovo-Downloads-renaissance-e-commerce-platform-1\assets"
)
OUT = Path(__file__).resolve().parents[1] / "public" / "products"
OUT.mkdir(parents=True, exist_ok=True)


def find_asset(short: str) -> Path:
    matches = list(ASSETS.glob(f"*{short}*.png"))
    if not matches:
        raise FileNotFoundError(short)
    return matches[0]


def crop_grid(
    img: Image.Image,
    rows: int,
    cols: int,
    pad_x: float = 0.04,
    pad_y: float = 0.04,
    inset: float = 0.06,
) -> list[Image.Image]:
    """Even grid crop with outer margin + per-cell inset."""
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
    """Crop using fractional (x0,y0,x1,y1) boxes in 0..1."""
    w, h = img.size
    return [
        img.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))
        for x0, y0, x1, y1 in cells
    ]


def save(img: Image.Image, slug: str) -> str:
    # Pad to square-ish product card with dark bg
    out = ImageOps.contain(img.convert("RGB"), (900, 900))
    canvas = Image.new("RGB", (900, 900), (28, 28, 30))
    ox = (900 - out.width) // 2
    oy = (900 - out.height) // 2
    canvas.paste(out, (ox, oy))
    path = OUT / f"{slug}.png"
    canvas.save(path, "PNG", optimize=True)
    return f"/products/{slug}.png"


# --- Sheet definitions: unique products only ---

SHEETS: list[dict] = [
    {
        "id": "3983890f",
        "mode": "grid",
        "rows": 3,
        "cols": 3,
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
        # 3 hoodies/crew top row, 2 bottom
        "cells": [
            (0.02, 0.02, 0.34, 0.52),
            (0.34, 0.02, 0.66, 0.52),
            (0.66, 0.02, 0.98, 0.52),
            (0.12, 0.50, 0.50, 0.98),
            (0.50, 0.50, 0.88, 0.98),
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
        "pad_x": 0.03,
        "pad_y": 0.04,
        "inset": 0.05,
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
        "pad_x": 0.03,
        "pad_y": 0.02,
        "inset": 0.05,
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
            (0.02, 0.04, 0.34, 0.52),
            (0.34, 0.02, 0.66, 0.52),
            (0.66, 0.04, 0.98, 0.52),
            (0.10, 0.50, 0.48, 0.98),
            (0.52, 0.50, 0.90, 0.98),
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
                pad_x=sheet.get("pad_x", 0.04),
                pad_y=sheet.get("pad_y", 0.04),
                inset=sheet.get("inset", 0.06),
            )
        else:
            crops = crop_cells(img, sheet["cells"])

        assert len(crops) == len(items), f"{sheet['id']}: {len(crops)} crops vs {len(items)} items"
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
            print(f"OK  {slug}  -> {path}")

    meta = OUT / "_catalog.json"
    meta.write_text(json.dumps(catalog, indent=2), encoding="utf-8")
    print(f"\nExtracted {len(catalog)} products -> {meta}")


if __name__ == "__main__":
    main()
