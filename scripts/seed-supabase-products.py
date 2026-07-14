"""Seed Supabase products table from public/products/_catalog.json."""
from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    path = ROOT / ".env.local"
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def request(method: str, url: str, key: str, body: object | None = None, prefer: str = "") -> tuple[int, str]:
    data = None if body is None else json.dumps(body).encode("utf-8")
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    if prefer:
        headers["Prefer"] = prefer
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")


def main() -> None:
    env = load_env()
    url = env["NEXT_PUBLIC_SUPABASE_URL"].rstrip("/")
    key = env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]
    catalog = json.loads((ROOT / "public/products/_catalog.json").read_text(encoding="utf-8"))

    # Check current products
    status, body = request("GET", f"{url}/rest/v1/products?select=id,slug,name&limit=100", key)
    print(f"GET products -> {status}")
    existing = json.loads(body) if status == 200 else []
    print(f"Existing count: {len(existing)}")
    if existing[:3]:
        print("Sample:", existing[:3])

    rows = []
    for i, p in enumerate(catalog, 1):
        rows.append(
            {
                "name": p["name"],
                "slug": p["slug"],
                "description": f"Official Renaissance drop — {p['name']}. Street / Y2K / thrift energy.",
                "short_description": p["name"],
                "price": p["price"],
                "sale_price": None,
                "sku": f"RNZ-{i:03d}",
                "stock_quantity": 25,
                "category": p["category"],
                "collection": p["collection"],
                "tags": ["new"] if i <= 12 else [],
                "status": "published",
                "images": [p["image"]],
                "thumbnail": p["image"],
            }
        )

    # Upsert by slug
    status, body = request(
        "POST",
        f"{url}/rest/v1/products?on_conflict=slug",
        key,
        rows,
        prefer="resolution=merge-duplicates,return=representation",
    )
    print(f"UPSERT products -> {status}")
    if status not in (200, 201):
        print(body[:2000])
        # Try delete-all + insert if upsert blocked by RLS
        print("Trying single inserts...")
        ok = 0
        fail = 0
        for row in rows:
            s, b = request("POST", f"{url}/rest/v1/products", key, row, prefer="return=minimal")
            if s in (200, 201):
                ok += 1
            else:
                fail += 1
                if fail <= 3:
                    print("FAIL", row["slug"], s, b[:300])
        print(f"Inserted ok={ok} fail={fail}")
    else:
        data = json.loads(body) if body else []
        print(f"Upserted {len(data)} rows")

    status, body = request(
        "GET",
        f"{url}/rest/v1/products?select=id&status=eq.published",
        key,
    )
    print(f"Published count check -> {status}: {len(json.loads(body)) if status == 200 else body[:300]}")


if __name__ == "__main__":
    main()
