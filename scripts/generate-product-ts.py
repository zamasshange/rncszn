"""Generate TypeScript product arrays from extracted catalog JSON."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
catalog = json.loads((ROOT / "public/products/_catalog.json").read_text(encoding="utf-8"))
TS = "2026-07-14T10:00:00Z"

initial_lines = []
for i, p in enumerate(catalog, 1):
    slug = p["slug"]
    sku = f"RNZ-{i:03d}"
    tags = ["new"] if i <= 12 else []
    desc = f"Official Renaissance drop — {p['name']}. Street / Y2K / thrift energy."
    initial_lines.append(
        "  { "
        f"id: 'prod_{i}', name: {json.dumps(p['name'])}, slug: {json.dumps(slug)}, "
        f"description: {json.dumps(desc)}, shortDescription: {json.dumps(p['name'])}, "
        f"price: {p['price']}, salePrice: null, sku: {json.dumps(sku)}, stockQuantity: 25, "
        f"category: {json.dumps(p['category'])}, collection: {json.dumps(p['collection'])}, "
        f"tags: {json.dumps(tags)}, status: 'published', images: [{json.dumps(p['image'])}], "
        f"thumbnail: {json.dumps(p['image'])}, createdAt: '{TS}', updatedAt: '{TS}' "
        "},"
    )

(ROOT / "scripts/_initial_products.tsfrag").write_text("\n".join(initial_lines) + "\n", encoding="utf-8")

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
        "  {\n"
        f"    id: 'p{i}',\n"
        f"    name: {json.dumps(p['name'])},\n"
        f"    slug: {json.dumps(p['slug'])},\n"
        f"    price: {p['price']},\n"
        f"    image: {json.dumps(p['image'])},\n"
        f"    category: {json.dumps(p['category'])},\n"
        f"    collection: {json.dumps(p['collection'])},\n"
        "    colors: ['Default'],\n"
        f"    sizes: {sizes},\n"
        f"    badge: {badge},\n"
        "    inStock: true,\n"
        "  },"
    )

(ROOT / "scripts/_site_products.tsfrag").write_text("\n".join(site_lines) + "\n", encoding="utf-8")
print(f"Generated fragments for {len(catalog)} products")
