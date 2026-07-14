"""Set products without zip photos to draft; keep zip-imported items published."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMPORTED = {
    "make-sa-great-again-tee", "girls-first-tee", "horny-ny-sweats", "horny-ny-tee",
    "renaissance-lnd-winter-tee", "renaissance-landscape-tee", "bdg-public-enemy-tee",
    "renaissance-stars-flame-hoodie", "high-sex-tee", "i-love-ass-tee", "sex-distressed-tank",
    "naked-distressed-tank", "pan-african-logo-tee", "money-makes-me-tank", "no-hoes-baby-tee",
    "bdg-pixel-green-tee", "bdg-crayon-tee", "horny-ny-baby-tee", "no-hoes-allowed-tee",
    "camo-stars-shorts", "camo-graffiti-cap", "logo-denim-shorts", "ebony-baby-tee",
    "ebony-denim-mini", "ebony-block-tee", "pornstar-tee", "ebony-ny-tee",
}

# Patch local-db.ts
local = (ROOT / "lib/local-db.ts").read_text(encoding="utf-8")
for slug in IMPORTED:
    # ensure published
    local = re.sub(
        rf"(slug: '{slug}'[^}}]+status: )'draft'",
        r"\1'published'",
        local,
    )
for m in re.finditer(r"slug: '([^']+)'", local):
    slug = m.group(1)
    if slug not in IMPORTED:
        local = re.sub(
            rf"(slug: '{slug}'[^}}]+status: )'published'",
            r"\1'draft'",
            local,
            count=1,
        )

(ROOT / "lib/local-db.ts").write_text(local, encoding="utf-8")

# Patch products.ts static fallback — only keep imported
prod = (ROOT / "lib/products.ts").read_text(encoding="utf-8")
start = prod.index("export const products: Product[] = [")
end = prod.index("]\n\nexport const reviews")
block = prod[start:end + 1]

kept_lines = []
for line in block.splitlines():
    if "slug:" in line:
        sm = re.search(r'slug: "([^"]+)"', line) or re.search(r"slug: '([^']+)'", line)
        if sm and sm.group(1) not in IMPORTED:
            continue
    # crude: rebuild by parsing objects... easier to regenerate from catalog json

catalog = json.loads((ROOT / "public/products/_catalog.json").read_text(encoding="utf-8"))
catalog = [p for p in catalog if p["slug"] in IMPORTED]

site_lines = []
for i, p in enumerate(catalog, 1):
    badge = "'New'" if i <= 8 else "undefined"
    if p["category"] == "Accessories":
        sizes = "['OS']"
    elif "mini" in p["slug"] or "shorts" in p["slug"]:
        sizes = "['XS', 'S', 'M', 'L']"
    else:
        sizes = "['XS', 'S', 'M', 'L', 'XL']"
    site_lines.append(
        f"  {{\n    id: 'p{i}',\n    name: {json.dumps(p['name'])},\n    slug: {json.dumps(p['slug'])},\n    price: {p['price']},\n    image: {json.dumps(p['image'])},\n    category: {json.dumps(p['category'])},\n    collection: {json.dumps(p['collection'])},\n    colors: ['Default'],\n    sizes: {sizes},\n    badge: {badge},\n    inStock: true,\n  }},"
    )

new_block = "export const products: Product[] = [\n" + "\n".join(site_lines) + "\n]"
prod = prod[:start] + new_block + prod[end + 1:]
(ROOT / "lib/products.ts").write_text(prod, encoding="utf-8")

# Update catalog json too
(ROOT / "public/products/_catalog.json").write_text(json.dumps(catalog, indent=2) + "\n", encoding="utf-8")

print(f"Published {len(catalog)} products with zip photos")
