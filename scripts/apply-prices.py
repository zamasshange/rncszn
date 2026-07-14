"""Apply price rules + regenerate products fragments in local-db / products.ts."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
catalog_path = ROOT / "public/products/_catalog.json"
catalog = json.loads(catalog_path.read_text(encoding="utf-8"))

MEN_TEES = {
    "make-sa-great-again-tee",
    "girls-first-tee",
    "renaissance-landscape-tee",
    "no-hoes-allowed-tee",
    "renaissance-lnd-winter-tee",
    "pornstar-tee",
    "i-love-ass-tee",
    "horny-ny-tee",
    "high-sex-tee",
    "pan-african-logo-tee",
    "bdg-public-enemy-tee",
    "bdg-crayon-tee",
    "bdg-pixel-green-tee",
}
GIRL_TANKS = {
    "money-makes-me-tank",
    "naked-distressed-tank",
    "sex-distressed-tank",
}
OVERRIDES = {
    "ebony-denim-mini": 450,
    "camo-stars-shorts": 550,
    "renaissance-stars-flame-hoodie": 600,
    "logo-denim-shorts": 500,
    "horny-ny-sweats": 600,
    "ebony-ny-tee": 600,
}

for p in catalog:
    slug = p["slug"]
    if slug in OVERRIDES:
        p["price"] = OVERRIDES[slug]
    elif slug in MEN_TEES:
        p["price"] = 450
    elif slug in GIRL_TANKS:
        p["price"] = 250

catalog_path.write_text(json.dumps(catalog, indent=2) + "\n", encoding="utf-8")

# Patch prices in lib/products.ts by slug
prod_path = ROOT / "lib/products.ts"
prod = prod_path.read_text(encoding="utf-8")
for p in catalog:
    # Replace price on the product object that contains this slug
    prod = re.sub(
        rf'(slug: "{re.escape(p["slug"])}",\n\s*price: )\d+',
        rf'\g<1>{p["price"]}',
        prod,
    )
prod_path.write_text(prod, encoding="utf-8")

# Patch local-db.ts (single-line objects)
local_path = ROOT / "lib/local-db.ts"
local = local_path.read_text(encoding="utf-8")
for p in catalog:
    local = re.sub(
        rf"(slug: '{re.escape(p['slug'])}'[^}}]*?price: )\d+",
        rf"\g<1>{p['price']}",
        local,
    )
    local = re.sub(
        rf'(slug: "{re.escape(p["slug"])}"[^}}]*?price: )\d+',
        rf"\g<1>{p['price']}",
        local,
    )
local_path.write_text(local, encoding="utf-8")

print("Updated prices:")
for p in catalog:
    print(f"  {p['slug']}: R{p['price']}")
