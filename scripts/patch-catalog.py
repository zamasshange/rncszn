"""Patch local-db.ts and products.ts with extracted catalog."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
initial = (ROOT / "scripts/_initial_products.tsfrag").read_text(encoding="utf-8").rstrip() + "\n"
site = (ROOT / "scripts/_site_products.tsfrag").read_text(encoding="utf-8").rstrip() + "\n"

# --- local-db.ts ---
local = (ROOT / "lib/local-db.ts").read_text(encoding="utf-8")
local = local.replace(
    "products: 'renaissance_products',",
    "products: 'renaissance_products_v2',",
)
local = local.replace(
    "collections: 'renaissance_collections',",
    "collections: 'renaissance_collections_v2',",
)

start = local.index("const initialProducts: Product[] = [")
end = local.index("];", start) + 2
new_products = "const initialProducts: Product[] = [\n" + initial + "]"
local = local[:start] + new_products + local[end:]

start = local.index("const initialCollections: Collection[] = [")
end = local.index("];", start) + 2
new_collections = """const initialCollections: Collection[] = [
  { id: 'col_1', name: 'Renaissance Tees', slug: 'renaissance-tees', description: 'Boxy graphic tees for the underground.', bannerImage: null, featured: true, status: 'active', createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'col_2', name: 'Heavyweight', slug: 'heavyweight', description: 'Hoodies and crewnecks — thick and boxy.', bannerImage: null, featured: true, status: 'active', createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'col_3', name: 'Billion Dollar Gang', slug: 'billion-dollar-gang', description: 'BDG tees and crew.', bannerImage: null, featured: true, status: 'active', createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'col_4', name: 'Crimson Angels', slug: 'crimson-angels', description: 'Crimson Angels line.', bannerImage: null, featured: true, status: 'active', createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'col_5', name: 'Girls Drop', slug: 'girls-drop', description: 'Baby tees, tanks, minis.', bannerImage: null, featured: true, status: 'active', createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'col_6', name: 'Bottoms Archive', slug: 'bottoms-archive', description: 'Shorts, sweats, joggers.', bannerImage: null, featured: false, status: 'active', createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'col_7', name: 'Accessories', slug: 'accessories', description: 'Hats and extras.', bannerImage: null, featured: false, status: 'active', createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
]"""
local = local[:start] + new_collections + local[end:]

# Keep order demo items pointing at valid products lightly — leave orders as-is for now
# or patch images — optional. Orders reference old luxury products; fine for admin demo.

(ROOT / "lib/local-db.ts").write_text(local, encoding="utf-8")

# --- products.ts ---
prod = (ROOT / "lib/products.ts").read_text(encoding="utf-8")
start = prod.index("export const products: Product[] = [")
end = prod.index("]\n\nexport const reviews")
new_site = "export const products: Product[] = [\n" + site + "]"
prod = prod[:start] + new_site + prod[end:]
(ROOT / "lib/products.ts").write_text(prod, encoding="utf-8")

print("Patched lib/local-db.ts and lib/products.ts")
