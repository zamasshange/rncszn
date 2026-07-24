// Unified database layer — auto-detects Supabase vs localStorage
// When Supabase is configured, all operations go through the cloud database.
// Otherwise, falls back to localStorage for demo/offline mode.

import { Product, Collection, Order, Customer, Discount, SiteSettings, ProductVariant } from './database';
import { isSupabaseConfigured } from './supabase';
import * as sb from './supabase-db';

// Re-export types for convenience
export type { Product, Collection, Order, Customer, Discount, SiteSettings, ProductVariant, OrderStatus, ProductStatus, DiscountType } from './database';

// ============================================================
// localStorage helpers (fallback)
// ============================================================
const STORAGE_KEYS = {
  products: 'renaissance_products_v4',
  collections: 'renaissance_collections_v2',
  orders: 'renaissance_orders',
  customers: 'renaissance_customers',
  discounts: 'renaissance_discounts',
  settings: 'renaissance_settings',
};

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
}

function setStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ============================================================
// Initial demo data (only used for localStorage fallback)
// ============================================================
const initialProducts: Product[] = [
  { id: 'prod_0', name: "RNC Soldier Chain", slug: "rnc-soldier-chain", description: "RNC Soldier Chain — silver ball chain with soldier pendant and R tag. Limited accessory drop.", shortDescription: "RNC Soldier Chain", price: 700, salePrice: null, sku: "RNZ-000", stockQuantity: 25, category: "Accessories", collection: "Accessories", tags: ["new", "limited"], status: 'published', images: ["/products/rnc-soldier-chain.png"], thumbnail: "/products/rnc-soldier-chain.png", createdAt: '2026-07-24T17:00:00Z', updatedAt: '2026-07-24T17:00:00Z' },
  { id: 'prod_1', name: "Make SA Great Again Tee", slug: "make-sa-great-again-tee", description: "Official Renaissance drop \u2014 Make SA Great Again Tee. Street / Y2K / thrift energy.", shortDescription: "Make SA Great Again Tee", price: 450, salePrice: null, sku: "RNZ-001", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: ["new"], status: 'published', images: ["/products/make-sa-great-again-tee.png"], thumbnail: "/products/make-sa-great-again-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_2', name: "Girls First Tee", slug: "girls-first-tee", description: "Official Renaissance drop \u2014 Girls First Tee. Street / Y2K / thrift energy.", shortDescription: "Girls First Tee", price: 450, salePrice: null, sku: "RNZ-002", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: ["new"], status: 'published', images: ["/products/girls-first-tee.png"], thumbnail: "/products/girls-first-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_3', name: "Renaissance Landscape Tee", slug: "renaissance-landscape-tee", description: "Official Renaissance drop \u2014 Renaissance Landscape Tee. Street / Y2K / thrift energy.", shortDescription: "Renaissance Landscape Tee", price: 450, salePrice: null, sku: "RNZ-003", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: ["new"], status: 'published', images: ["/products/renaissance-landscape-tee.png"], thumbnail: "/products/renaissance-landscape-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_4', name: "No Hoes Allowed Tee", slug: "no-hoes-allowed-tee", description: "Official Renaissance drop \u2014 No Hoes Allowed Tee. Street / Y2K / thrift energy.", shortDescription: "No Hoes Allowed Tee", price: 450, salePrice: null, sku: "RNZ-004", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: ["new"], status: 'published', images: ["/products/no-hoes-allowed-tee.png"], thumbnail: "/products/no-hoes-allowed-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_5', name: "Renaissance L.N.D Winter Tee", slug: "renaissance-lnd-winter-tee", description: "Official Renaissance drop \u2014 Renaissance L.N.D Winter Tee. Street / Y2K / thrift energy.", shortDescription: "Renaissance L.N.D Winter Tee", price: 450, salePrice: null, sku: "RNZ-005", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: ["new"], status: 'published', images: ["/products/renaissance-lnd-winter-tee.png"], thumbnail: "/products/renaissance-lnd-winter-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_6', name: "You've Just Seen A... Tee", slug: "pornstar-tee", description: "Official Renaissance drop \u2014 You've Just Seen A... Tee. Street / Y2K / thrift energy.", shortDescription: "You've Just Seen A... Tee", price: 450, salePrice: null, sku: "RNZ-006", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: ["new"], status: 'published', images: ["/products/pornstar-tee.png"], thumbnail: "/products/pornstar-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_7', name: "I Love A$$ Tee", slug: "i-love-ass-tee", description: "Official Renaissance drop \u2014 I Love A$$ Tee. Street / Y2K / thrift energy.", shortDescription: "I Love A$$ Tee", price: 450, salePrice: null, sku: "RNZ-007", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: ["new"], status: 'published', images: ["/products/i-love-ass-tee.png"], thumbnail: "/products/i-love-ass-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_8', name: "HOR NY Tee", slug: "horny-ny-tee", description: "Official Renaissance drop \u2014 HOR NY Tee. Street / Y2K / thrift energy.", shortDescription: "HOR NY Tee", price: 450, salePrice: null, sku: "RNZ-008", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: ["new"], status: 'published', images: ["/products/horny-ny-tee.png"], thumbnail: "/products/horny-ny-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_9', name: "Jack Portrait Tee", slug: "jack-portrait-tee", description: "Official Renaissance drop \u2014 Jack Portrait Tee. Street / Y2K / thrift energy.", shortDescription: "Jack Portrait Tee", price: 380, salePrice: null, sku: "RNZ-009", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: ["new"], status: 'published', images: ["/products/jack-portrait-tee.png"], thumbnail: "/products/jack-portrait-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_10', name: "Renaissance 00 Jersey", slug: "renaissance-00-jersey", description: "Official Renaissance drop \u2014 Renaissance 00 Jersey. Street / Y2K / thrift energy.", shortDescription: "Renaissance 00 Jersey", price: 380, salePrice: null, sku: "RNZ-010", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: ["new"], status: 'published', images: ["/products/renaissance-00-jersey.png"], thumbnail: "/products/renaissance-00-jersey.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_11', name: "So Sick Of This Shit Tee", slug: "so-sick-tee", description: "Official Renaissance drop \u2014 So Sick Of This Shit Tee. Street / Y2K / thrift energy.", shortDescription: "So Sick Of This Shit Tee", price: 350, salePrice: null, sku: "RNZ-011", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: ["new"], status: 'published', images: ["/products/so-sick-tee.png"], thumbnail: "/products/so-sick-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_12', name: "Love Tag Tee", slug: "love-tag-tee", description: "Official Renaissance drop \u2014 Love Tag Tee. Street / Y2K / thrift energy.", shortDescription: "Love Tag Tee", price: 350, salePrice: null, sku: "RNZ-012", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: ["new"], status: 'published', images: ["/products/love-tag-tee.png"], thumbnail: "/products/love-tag-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_13', name: "I Want To Get High Tee", slug: "high-sex-tee", description: "Official Renaissance drop \u2014 I Want To Get High Tee. Street / Y2K / thrift energy.", shortDescription: "I Want To Get High Tee", price: 450, salePrice: null, sku: "RNZ-013", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: [], status: 'published', images: ["/products/high-sex-tee.png"], thumbnail: "/products/high-sex-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_14', name: "Renaissance L.N.D Crop", slug: "renaissance-lnd-crop", description: "Official Renaissance drop \u2014 Renaissance L.N.D Crop. Street / Y2K / thrift energy.", shortDescription: "Renaissance L.N.D Crop", price: 320, salePrice: null, sku: "RNZ-014", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: [], status: 'published', images: ["/products/renaissance-lnd-crop.png"], thumbnail: "/products/renaissance-lnd-crop.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_15', name: "I Heart Renaissance Tee", slug: "i-heart-renaissance-tee", description: "Official Renaissance drop \u2014 I Heart Renaissance Tee. Street / Y2K / thrift energy.", shortDescription: "I Heart Renaissance Tee", price: 350, salePrice: null, sku: "RNZ-015", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: [], status: 'published', images: ["/products/i-heart-renaissance-tee.png"], thumbnail: "/products/i-heart-renaissance-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_16', name: "Faces Grid Tee", slug: "faces-grid-tee", description: "Official Renaissance drop \u2014 Faces Grid Tee. Street / Y2K / thrift energy.", shortDescription: "Faces Grid Tee", price: 380, salePrice: null, sku: "RNZ-016", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: [], status: 'published', images: ["/products/faces-grid-tee.png"], thumbnail: "/products/faces-grid-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_17', name: "Infant Boys Club Tee", slug: "infant-boys-club-tee", description: "Official Renaissance drop \u2014 Infant Boys Club Tee. Street / Y2K / thrift energy.", shortDescription: "Infant Boys Club Tee", price: 350, salePrice: null, sku: "RNZ-017", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: [], status: 'published', images: ["/products/infant-boys-club-tee.png"], thumbnail: "/products/infant-boys-club-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_18', name: "Pan-African Logo Tee", slug: "pan-african-logo-tee", description: "Official Renaissance drop \u2014 Pan-African Logo Tee. Street / Y2K / thrift energy.", shortDescription: "Pan-African Logo Tee", price: 450, salePrice: null, sku: "RNZ-018", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: [], status: 'published', images: ["/products/pan-african-logo-tee.png"], thumbnail: "/products/pan-african-logo-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_19', name: "Renaissance Logo Crewneck", slug: "renaissance-logo-crewneck", description: "Official Renaissance drop \u2014 Renaissance Logo Crewneck. Street / Y2K / thrift energy.", shortDescription: "Renaissance Logo Crewneck", price: 550, salePrice: null, sku: "RNZ-019", stockQuantity: 25, category: "Outerwear", collection: "Heavyweight", tags: [], status: 'published', images: ["/products/renaissance-logo-crewneck.png"], thumbnail: "/products/renaissance-logo-crewneck.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_20', name: "Renaissance Logo Hoodie", slug: "renaissance-logo-hoodie", description: "Official Renaissance drop \u2014 Renaissance Logo Hoodie. Street / Y2K / thrift energy.", shortDescription: "Renaissance Logo Hoodie", price: 650, salePrice: null, sku: "RNZ-020", stockQuantity: 25, category: "Outerwear", collection: "Heavyweight", tags: [], status: 'published', images: ["/products/renaissance-logo-hoodie.png"], thumbnail: "/products/renaissance-logo-hoodie.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_21', name: "Stars & Flame Hoodie", slug: "renaissance-stars-flame-hoodie", description: "Official Renaissance drop \u2014 Stars & Flame Hoodie. Street / Y2K / thrift energy.", shortDescription: "Stars & Flame Hoodie", price: 600, salePrice: null, sku: "RNZ-021", stockQuantity: 25, category: "Outerwear", collection: "Heavyweight", tags: [], status: 'published', images: ["/products/renaissance-stars-flame-hoodie.png"], thumbnail: "/products/renaissance-stars-flame-hoodie.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_22', name: "Renaissance Eagles Hoodie", slug: "renaissance-eagles-hoodie", description: "Official Renaissance drop \u2014 Renaissance Eagles Hoodie. Street / Y2K / thrift energy.", shortDescription: "Renaissance Eagles Hoodie", price: 720, salePrice: null, sku: "RNZ-022", stockQuantity: 25, category: "Outerwear", collection: "Heavyweight", tags: [], status: 'published', images: ["/products/renaissance-eagles-hoodie.png"], thumbnail: "/products/renaissance-eagles-hoodie.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_23', name: "Billion Dollar Gang Crewneck", slug: "billion-dollar-gang-crewneck", description: "Official Renaissance drop \u2014 Billion Dollar Gang Crewneck. Street / Y2K / thrift energy.", shortDescription: "Billion Dollar Gang Crewneck", price: 600, salePrice: null, sku: "RNZ-023", stockQuantity: 25, category: "Outerwear", collection: "Billion Dollar Gang", tags: [], status: 'published', images: ["/products/billion-dollar-gang-crewneck.png"], thumbnail: "/products/billion-dollar-gang-crewneck.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_24', name: "Crimson Angels Sleeve Script", slug: "crimson-sleeve-script-crew", description: "Official Renaissance drop \u2014 Crimson Angels Sleeve Script. Street / Y2K / thrift energy.", shortDescription: "Crimson Angels Sleeve Script", price: 580, salePrice: null, sku: "RNZ-024", stockQuantity: 25, category: "Outerwear", collection: "Crimson Angels", tags: [], status: 'published', images: ["/products/crimson-sleeve-script-crew.png"], thumbnail: "/products/crimson-sleeve-script-crew.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_25', name: "Crimson Angels Polo", slug: "crimson-polo", description: "Official Renaissance drop \u2014 Crimson Angels Polo. Street / Y2K / thrift energy.", shortDescription: "Crimson Angels Polo", price: 450, salePrice: null, sku: "RNZ-025", stockQuantity: 25, category: "Tops", collection: "Crimson Angels", tags: [], status: 'published', images: ["/products/crimson-polo.png"], thumbnail: "/products/crimson-polo.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_26', name: "Crimson Angels Monroe Crew", slug: "crimson-monroe-crew", description: "Official Renaissance drop \u2014 Crimson Angels Monroe Crew. Street / Y2K / thrift energy.", shortDescription: "Crimson Angels Monroe Crew", price: 620, salePrice: null, sku: "RNZ-026", stockQuantity: 25, category: "Outerwear", collection: "Crimson Angels", tags: [], status: 'published', images: ["/products/crimson-monroe-crew.png"], thumbnail: "/products/crimson-monroe-crew.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_27', name: "Crimson Angels Script Hoodie", slug: "crimson-script-hoodie", description: "Official Renaissance drop \u2014 Crimson Angels Script Hoodie. Street / Y2K / thrift energy.", shortDescription: "Crimson Angels Script Hoodie", price: 680, salePrice: null, sku: "RNZ-027", stockQuantity: 25, category: "Outerwear", collection: "Crimson Angels", tags: [], status: 'published', images: ["/products/crimson-script-hoodie.png"], thumbnail: "/products/crimson-script-hoodie.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_28', name: "Crimson Angels Side Tank", slug: "crimson-side-tank", description: "Official Renaissance drop \u2014 Crimson Angels Side Tank. Street / Y2K / thrift energy.", shortDescription: "Crimson Angels Side Tank", price: 320, salePrice: null, sku: "RNZ-028", stockQuantity: 25, category: "Tops", collection: "Crimson Angels", tags: [], status: 'published', images: ["/products/crimson-side-tank.png"], thumbnail: "/products/crimson-side-tank.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_29', name: "Crimson Angels Lagos Crest", slug: "crimson-lagos-crest-crew", description: "Official Renaissance drop \u2014 Crimson Angels Lagos Crest. Street / Y2K / thrift energy.", shortDescription: "Crimson Angels Lagos Crest", price: 600, salePrice: null, sku: "RNZ-029", stockQuantity: 25, category: "Outerwear", collection: "Crimson Angels", tags: [], status: 'published', images: ["/products/crimson-lagos-crest-crew.png"], thumbnail: "/products/crimson-lagos-crest-crew.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_30', name: "BDG Astronaut Tee (Black)", slug: "bdg-astronaut-black-tee", description: "Official Renaissance drop \u2014 BDG Astronaut Tee (Black). Street / Y2K / thrift energy.", shortDescription: "BDG Astronaut Tee (Black)", price: 350, salePrice: null, sku: "RNZ-030", stockQuantity: 25, category: "Tops", collection: "Billion Dollar Gang", tags: [], status: 'published', images: ["/products/bdg-astronaut-black-tee.png"], thumbnail: "/products/bdg-astronaut-black-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_31', name: "BDG Public Enemy Tee", slug: "bdg-public-enemy-tee", description: "Official Renaissance drop \u2014 BDG Public Enemy Tee. Street / Y2K / thrift energy.", shortDescription: "BDG Public Enemy Tee", price: 450, salePrice: null, sku: "RNZ-031", stockQuantity: 25, category: "Tops", collection: "Billion Dollar Gang", tags: [], status: 'published', images: ["/products/bdg-public-enemy-tee.png"], thumbnail: "/products/bdg-public-enemy-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_32', name: "BDG Block Logo Tee", slug: "bdg-block-logo-tee", description: "Official Renaissance drop \u2014 BDG Block Logo Tee. Street / Y2K / thrift energy.", shortDescription: "BDG Block Logo Tee", price: 350, salePrice: null, sku: "RNZ-032", stockQuantity: 25, category: "Tops", collection: "Billion Dollar Gang", tags: [], status: 'published', images: ["/products/bdg-block-logo-tee.png"], thumbnail: "/products/bdg-block-logo-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_33', name: "BDG Astronaut Tee (White)", slug: "bdg-astronaut-white-tee", description: "Official Renaissance drop \u2014 BDG Astronaut Tee (White). Street / Y2K / thrift energy.", shortDescription: "BDG Astronaut Tee (White)", price: 350, salePrice: null, sku: "RNZ-033", stockQuantity: 25, category: "Tops", collection: "Billion Dollar Gang", tags: [], status: 'published', images: ["/products/bdg-astronaut-white-tee.png"], thumbnail: "/products/bdg-astronaut-white-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_34', name: "BDG Chrome Figure Tee", slug: "bdg-chrome-figure-tee", description: "Official Renaissance drop \u2014 BDG Chrome Figure Tee. Street / Y2K / thrift energy.", shortDescription: "BDG Chrome Figure Tee", price: 400, salePrice: null, sku: "RNZ-034", stockQuantity: 25, category: "Tops", collection: "Billion Dollar Gang", tags: [], status: 'published', images: ["/products/bdg-chrome-figure-tee.png"], thumbnail: "/products/bdg-chrome-figure-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_35', name: "BDG Diamond Figure Tee", slug: "bdg-diamond-figure-tee", description: "Official Renaissance drop \u2014 BDG Diamond Figure Tee. Street / Y2K / thrift energy.", shortDescription: "BDG Diamond Figure Tee", price: 400, salePrice: null, sku: "RNZ-035", stockQuantity: 25, category: "Tops", collection: "Billion Dollar Gang", tags: [], status: 'published', images: ["/products/bdg-diamond-figure-tee.png"], thumbnail: "/products/bdg-diamond-figure-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_36', name: "BDG Crayon Tee", slug: "bdg-crayon-tee", description: "Official Renaissance drop \u2014 BDG Crayon Tee. Street / Y2K / thrift energy.", shortDescription: "BDG Crayon Tee", price: 450, salePrice: null, sku: "RNZ-036", stockQuantity: 25, category: "Tops", collection: "Billion Dollar Gang", tags: [], status: 'published', images: ["/products/bdg-crayon-tee.png"], thumbnail: "/products/bdg-crayon-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_37', name: "We Are Fucking Angry Tee", slug: "we-are-fucking-angry-tee", description: "Official Renaissance drop \u2014 We Are Fucking Angry Tee. Street / Y2K / thrift energy.", shortDescription: "We Are Fucking Angry Tee", price: 350, salePrice: null, sku: "RNZ-037", stockQuantity: 25, category: "Tops", collection: "Renaissance Tees", tags: [], status: 'published', images: ["/products/we-are-fucking-angry-tee.png"], thumbnail: "/products/we-are-fucking-angry-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_38', name: "BDG Pixel Green Tee", slug: "bdg-pixel-green-tee", description: "Official Renaissance drop \u2014 BDG Pixel Green Tee. Street / Y2K / thrift energy.", shortDescription: "BDG Pixel Green Tee", price: 450, salePrice: null, sku: "RNZ-038", stockQuantity: 25, category: "Tops", collection: "Billion Dollar Gang", tags: [], status: 'published', images: ["/products/bdg-pixel-green-tee.png"], thumbnail: "/products/bdg-pixel-green-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_39', name: "No Hoes Allowed Baby Tee", slug: "no-hoes-baby-tee", description: "Official Renaissance drop \u2014 No Hoes Allowed Baby Tee. Street / Y2K / thrift energy.", shortDescription: "No Hoes Allowed Baby Tee", price: 320, salePrice: null, sku: "RNZ-039", stockQuantity: 25, category: "Tops", collection: "Girls Drop", tags: [], status: 'published', images: ["/products/no-hoes-baby-tee.png"], thumbnail: "/products/no-hoes-baby-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_40', name: "Money Makes Me Tank", slug: "money-makes-me-tank", description: "Official Renaissance drop \u2014 Money Makes Me Tank. Street / Y2K / thrift energy.", shortDescription: "Money Makes Me Tank", price: 250, salePrice: null, sku: "RNZ-040", stockQuantity: 25, category: "Tops", collection: "Girls Drop", tags: [], status: 'published', images: ["/products/money-makes-me-tank.png"], thumbnail: "/products/money-makes-me-tank.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_41', name: "Girls First Baby Tee", slug: "girls-first-baby-tee", description: "Official Renaissance drop \u2014 Girls First Baby Tee. Street / Y2K / thrift energy.", shortDescription: "Girls First Baby Tee", price: 320, salePrice: null, sku: "RNZ-041", stockQuantity: 25, category: "Tops", collection: "Girls Drop", tags: [], status: 'published', images: ["/products/girls-first-baby-tee.png"], thumbnail: "/products/girls-first-baby-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_42', name: "Love Tag Baby Tee", slug: "love-tag-baby-tee", description: "Official Renaissance drop \u2014 Love Tag Baby Tee. Street / Y2K / thrift energy.", shortDescription: "Love Tag Baby Tee", price: 320, salePrice: null, sku: "RNZ-042", stockQuantity: 25, category: "Tops", collection: "Girls Drop", tags: [], status: 'published', images: ["/products/love-tag-baby-tee.png"], thumbnail: "/products/love-tag-baby-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_43', name: "HOR NY Baby Tee", slug: "horny-ny-baby-tee", description: "Official Renaissance drop \u2014 HOR NY Baby Tee. Street / Y2K / thrift energy.", shortDescription: "HOR NY Baby Tee", price: 320, salePrice: null, sku: "RNZ-043", stockQuantity: 25, category: "Tops", collection: "Girls Drop", tags: [], status: 'published', images: ["/products/horny-ny-baby-tee.png"], thumbnail: "/products/horny-ny-baby-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_44', name: "NAKED Distressed Tank", slug: "naked-distressed-tank", description: "Official Renaissance drop \u2014 NAKED Distressed Tank. Street / Y2K / thrift energy.", shortDescription: "NAKED Distressed Tank", price: 250, salePrice: null, sku: "RNZ-044", stockQuantity: 25, category: "Tops", collection: "Girls Drop", tags: [], status: 'published', images: ["/products/naked-distressed-tank.png"], thumbnail: "/products/naked-distressed-tank.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_45', name: "NAKED Denim Mini", slug: "naked-denim-mini", description: "Official Renaissance drop \u2014 NAKED Denim Mini. Street / Y2K / thrift energy.", shortDescription: "NAKED Denim Mini", price: 420, salePrice: null, sku: "RNZ-045", stockQuantity: 25, category: "Bottoms", collection: "Girls Drop", tags: [], status: 'published', images: ["/products/naked-denim-mini.png"], thumbnail: "/products/naked-denim-mini.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_46', name: "SEX. Distressed Tank", slug: "sex-distressed-tank", description: "Official Renaissance drop \u2014 SEX. Distressed Tank. Street / Y2K / thrift energy.", shortDescription: "SEX. Distressed Tank", price: 250, salePrice: null, sku: "RNZ-046", stockQuantity: 25, category: "Tops", collection: "Girls Drop", tags: [], status: 'published', images: ["/products/sex-distressed-tank.png"], thumbnail: "/products/sex-distressed-tank.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_47', name: "EBONY Baby Tee", slug: "ebony-baby-tee", description: "Official Renaissance drop \u2014 EBONY Baby Tee. Street / Y2K / thrift energy.", shortDescription: "EBONY Baby Tee", price: 300, salePrice: null, sku: "RNZ-047", stockQuantity: 25, category: "Tops", collection: "Girls Drop", tags: [], status: 'published', images: ["/products/ebony-baby-tee.png"], thumbnail: "/products/ebony-baby-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_48', name: "Halo Girl Tank", slug: "halo-girl-tank", description: "Official Renaissance drop \u2014 Halo Girl Tank. Street / Y2K / thrift energy.", shortDescription: "Halo Girl Tank", price: 320, salePrice: null, sku: "RNZ-048", stockQuantity: 25, category: "Tops", collection: "Girls Drop", tags: [], status: 'published', images: ["/products/halo-girl-tank.png"], thumbnail: "/products/halo-girl-tank.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_49', name: "EBONY Denim Mini", slug: "ebony-denim-mini", description: "Official Renaissance drop \u2014 EBONY Denim Mini. Street / Y2K / thrift energy.", shortDescription: "EBONY Denim Mini", price: 450, salePrice: null, sku: "RNZ-049", stockQuantity: 25, category: "Bottoms", collection: "Girls Drop", tags: [], status: 'published', images: ["/products/ebony-denim-mini.png"], thumbnail: "/products/ebony-denim-mini.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_50', name: "MOWA Shorts", slug: "mowa-shorts", description: "Official Renaissance drop \u2014 MOWA Shorts. Street / Y2K / thrift energy.", shortDescription: "MOWA Shorts", price: 280, salePrice: null, sku: "RNZ-050", stockQuantity: 25, category: "Bottoms", collection: "Girls Drop", tags: [], status: 'published', images: ["/products/mowa-shorts.png"], thumbnail: "/products/mowa-shorts.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_51', name: "Camo Stars Shorts", slug: "camo-stars-shorts", description: "Official Renaissance drop \u2014 Camo Stars Shorts. Street / Y2K / thrift energy.", shortDescription: "Camo Stars Shorts", price: 550, salePrice: null, sku: "RNZ-051", stockQuantity: 25, category: "Bottoms", collection: "Bottoms Archive", tags: [], status: 'published', images: ["/products/camo-stars-shorts.png"], thumbnail: "/products/camo-stars-shorts.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_52', name: "Renaissance Logo Shorts", slug: "logo-denim-shorts", description: "Official Renaissance drop \u2014 Renaissance Logo Shorts. Street / Y2K / thrift energy.", shortDescription: "Renaissance Logo Shorts", price: 500, salePrice: null, sku: "RNZ-052", stockQuantity: 25, category: "Bottoms", collection: "Bottoms Archive", tags: [], status: 'published', images: ["/products/logo-denim-shorts.png"], thumbnail: "/products/logo-denim-shorts.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_53', name: "Flame Side Shorts", slug: "flame-side-shorts", description: "Official Renaissance drop \u2014 Flame Side Shorts. Street / Y2K / thrift energy.", shortDescription: "Flame Side Shorts", price: 450, salePrice: null, sku: "RNZ-053", stockQuantity: 25, category: "Bottoms", collection: "Bottoms Archive", tags: [], status: 'published', images: ["/products/flame-side-shorts.png"], thumbnail: "/products/flame-side-shorts.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_54', name: "Vertical Logo Sweats", slug: "vertical-logo-sweats", description: "Official Renaissance drop \u2014 Vertical Logo Sweats. Street / Y2K / thrift energy.", shortDescription: "Vertical Logo Sweats", price: 520, salePrice: null, sku: "RNZ-054", stockQuantity: 25, category: "Bottoms", collection: "Bottoms Archive", tags: [], status: 'published', images: ["/products/vertical-logo-sweats.png"], thumbnail: "/products/vertical-logo-sweats.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_55', name: "HOR NY Sweats", slug: "horny-ny-sweats", description: "Official Renaissance drop \u2014 HOR NY Sweats. Street / Y2K / thrift energy.", shortDescription: "HOR NY Sweats", price: 600, salePrice: null, sku: "RNZ-055", stockQuantity: 25, category: "Bottoms", collection: "Bottoms Archive", tags: [], status: 'published', images: ["/products/horny-ny-sweats.png"], thumbnail: "/products/horny-ny-sweats.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_56', name: "Logo Seat Joggers", slug: "logo-seat-joggers", description: "Official Renaissance drop \u2014 Logo Seat Joggers. Street / Y2K / thrift energy.", shortDescription: "Logo Seat Joggers", price: 500, salePrice: null, sku: "RNZ-056", stockQuantity: 25, category: "Bottoms", collection: "Bottoms Archive", tags: [], status: 'published', images: ["/products/logo-seat-joggers.png"], thumbnail: "/products/logo-seat-joggers.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_57', name: "Crimson Angels Beanie", slug: "crimson-angels-beanie", description: "Official Renaissance drop \u2014 Crimson Angels Beanie. Street / Y2K / thrift energy.", shortDescription: "Crimson Angels Beanie", price: 220, salePrice: null, sku: "RNZ-057", stockQuantity: 25, category: "Accessories", collection: "Crimson Angels", tags: [], status: 'published', images: ["/products/crimson-angels-beanie.png"], thumbnail: "/products/crimson-angels-beanie.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_58', name: "Camo Graffiti Cap", slug: "camo-graffiti-cap", description: "Official Renaissance drop \u2014 Camo Graffiti Cap. Street / Y2K / thrift energy.", shortDescription: "Camo Graffiti Cap", price: 280, salePrice: null, sku: "RNZ-058", stockQuantity: 25, category: "Accessories", collection: "Accessories", tags: [], status: 'published', images: ["/products/camo-graffiti-cap.png"], thumbnail: "/products/camo-graffiti-cap.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_59', name: "EBONY Block Tee", slug: "ebony-block-tee", description: "Official Renaissance drop \u2014 EBONY Block Tee. Street / Y2K / thrift energy.", shortDescription: "EBONY Block Tee", price: 300, salePrice: null, sku: "RNZ-059", stockQuantity: 25, category: "Tops", collection: "Girls Drop", tags: [], status: 'published', images: ["/products/ebony-block-tee.png"], thumbnail: "/products/ebony-block-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_60', name: "Crimson Angels Heart Tee", slug: "crimson-heart-tee", description: "Official Renaissance drop \u2014 Crimson Angels Heart Tee. Street / Y2K / thrift energy.", shortDescription: "Crimson Angels Heart Tee", price: 350, salePrice: null, sku: "RNZ-060", stockQuantity: 25, category: "Tops", collection: "Crimson Angels", tags: [], status: 'published', images: ["/products/crimson-heart-tee.png"], thumbnail: "/products/crimson-heart-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'prod_61', name: "EBONY NY Tee", slug: "ebony-ny-tee", description: "Official Renaissance drop \u2014 EBONY NY Tee. Street / Y2K / thrift energy.", shortDescription: "EBONY NY Tee", price: 600, salePrice: null, sku: "RNZ-061", stockQuantity: 25, category: "Tops", collection: "Girls Drop", tags: [], status: 'published', images: ["/products/ebony-ny-tee.png"], thumbnail: "/products/ebony-ny-tee.png", createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
]

const initialCollections: Collection[] = [
  { id: 'col_1', name: 'Renaissance Tees', slug: 'renaissance-tees', description: 'Boxy graphic tees for the underground.', bannerImage: null, featured: true, status: 'active', createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'col_2', name: 'Heavyweight', slug: 'heavyweight', description: 'Hoodies and crewnecks — thick and boxy.', bannerImage: null, featured: true, status: 'active', createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'col_3', name: 'Billion Dollar Gang', slug: 'billion-dollar-gang', description: 'BDG tees and crew.', bannerImage: null, featured: true, status: 'active', createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'col_4', name: 'Crimson Angels', slug: 'crimson-angels', description: 'Crimson Angels line.', bannerImage: null, featured: true, status: 'active', createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'col_5', name: 'Girls Drop', slug: 'girls-drop', description: 'Baby tees, tanks, minis.', bannerImage: null, featured: true, status: 'active', createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'col_6', name: 'Bottoms Archive', slug: 'bottoms-archive', description: 'Shorts, sweats, joggers.', bannerImage: null, featured: false, status: 'active', createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
  { id: 'col_7', name: 'Accessories', slug: 'accessories', description: 'Hats and extras.', bannerImage: null, featured: false, status: 'active', createdAt: '2026-07-14T10:00:00Z', updatedAt: '2026-07-14T10:00:00Z' },
]

const initialCustomers: Customer[] = [
  { id: 'cust_1', email: 'emma@example.com', firstName: 'Emma', lastName: 'Watson', phone: '+27 82 123 4567', orders: 12, totalSpent: 8450, addresses: [{ line1: '123 Main Street', line2: 'Sandton', city: 'Johannesburg', state: 'Gauteng', postalCode: '2196', country: 'South Africa' }], defaultAddress: { line1: '123 Main Street', line2: 'Sandton', city: 'Johannesburg', state: 'Gauteng', postalCode: '2196', country: 'South Africa' }, createdAt: '2025-01-15T10:00:00Z', updatedAt: '2026-06-01T10:00:00Z' },
  { id: 'cust_2', email: 'john@example.com', firstName: 'John', lastName: 'Smith', phone: '+27 83 234 5678', orders: 5, totalSpent: 2340, addresses: [{ line1: '45 Ocean Drive', line2: null, city: 'Cape Town', state: 'Western Cape', postalCode: '8001', country: 'South Africa' }], defaultAddress: { line1: '45 Ocean Drive', line2: null, city: 'Cape Town', state: 'Western Cape', postalCode: '8001', country: 'South Africa' }, createdAt: '2025-03-20T10:00:00Z', updatedAt: '2026-04-15T10:00:00Z' },
  { id: 'cust_3', email: 'sarah@example.com', firstName: 'Sarah', lastName: 'Johnson', phone: '+27 84 345 6789', orders: 8, totalSpent: 4560, addresses: [{ line1: '78 Garden Road', line2: 'Rosebank', city: 'Johannesburg', state: 'Gauteng', postalCode: '2192', country: 'South Africa' }], defaultAddress: { line1: '78 Garden Road', line2: 'Rosebank', city: 'Johannesburg', state: 'Gauteng', postalCode: '2192', country: 'South Africa' }, createdAt: '2025-05-10T10:00:00Z', updatedAt: '2026-05-20T10:00:00Z' },
];

const initialOrders: Order[] = [
  { id: 'ord_1', orderNumber: 'ORD-10293', customerId: 'cust_1', customerEmail: 'emma@example.com', customerName: 'Emma Watson', items: [{ productId: 'prod_1', productName: 'Chrome Shell Puffer', variantId: null, variantName: 'M / Silver', quantity: 1, price: 680, salePrice: null, image: '/product-jacket.png' }], subtotal: 680, tax: 68, shipping: 0, discount: 0, total: 748, status: 'completed', shippingAddress: { line1: '123 Main Street', line2: 'Sandton', city: 'Johannesburg', state: 'Gauteng', postalCode: '2196', country: 'South Africa' }, billingAddress: { line1: '123 Main Street', line2: 'Sandton', city: 'Johannesburg', state: 'Gauteng', postalCode: '2196', country: 'South Africa' }, notes: null, createdAt: '2026-06-08T10:00:00Z', updatedAt: '2026-06-08T14:00:00Z' },
  { id: 'ord_2', orderNumber: 'ORD-10292', customerId: 'cust_2', customerEmail: 'john@example.com', customerName: 'John Smith', items: [{ productId: 'prod_2', productName: 'Hyperline Cargo Pant', variantId: null, variantName: 'L / White', quantity: 1, price: 240, salePrice: 240, image: '/product-pants.png' }, { productId: 'prod_3', productName: 'Holo Crop Tee', variantId: null, variantName: 'M / Iridescent', quantity: 1, price: 180, salePrice: null, image: '/product-top.png' }], subtotal: 420, tax: 42, shipping: 0, discount: 0, total: 462, status: 'processing', shippingAddress: { line1: '45 Ocean Drive', line2: null, city: 'Cape Town', state: 'Western Cape', postalCode: '8001', country: 'South Africa' }, billingAddress: { line1: '45 Ocean Drive', line2: null, city: 'Cape Town', state: 'Western Cape', postalCode: '8001', country: 'South Africa' }, notes: 'Please gift wrap', createdAt: '2026-06-07T09:00:00Z', updatedAt: '2026-06-07T15:00:00Z' },
  { id: 'ord_3', orderNumber: 'ORD-10291', customerId: 'cust_3', customerEmail: 'sarah@example.com', customerName: 'Sarah Johnson', items: [{ productId: 'prod_6', productName: 'Sequin Midi Dress', variantId: null, variantName: 'S / Silver', quantity: 1, price: 425, salePrice: 425, image: '/product-top.png' }], subtotal: 425, tax: 42.5, shipping: 0, discount: 0, total: 467.5, status: 'shipped', shippingAddress: { line1: '78 Garden Road', line2: 'Rosebank', city: 'Johannesburg', state: 'Gauteng', postalCode: '2192', country: 'South Africa' }, billingAddress: { line1: '78 Garden Road', line2: 'Rosebank', city: 'Johannesburg', state: 'Gauteng', postalCode: '2192', country: 'South Africa' }, notes: null, createdAt: '2026-06-06T11:00:00Z', updatedAt: '2026-06-07T10:00:00Z' },
  { id: 'ord_4', orderNumber: 'ORD-10290', customerId: 'cust_1', customerEmail: 'emma@example.com', customerName: 'Emma Watson', items: [{ productId: 'prod_5', productName: 'Metallic Oversized Blazer', variantId: null, variantName: 'M / Silver', quantity: 1, price: 450, salePrice: null, image: '/product-jacket.png' }], subtotal: 450, tax: 45, shipping: 0, discount: 0, total: 495, status: 'pending', shippingAddress: { line1: '123 Main Street', line2: 'Sandton', city: 'Johannesburg', state: 'Gauteng', postalCode: '2196', country: 'South Africa' }, billingAddress: { line1: '123 Main Street', line2: 'Sandton', city: 'Johannesburg', state: 'Gauteng', postalCode: '2196', country: 'South Africa' }, notes: null, createdAt: '2026-06-05T16:00:00Z', updatedAt: '2026-06-05T16:00:00Z' },
];

const initialDiscounts: Discount[] = [
  { id: 'disc_1', code: 'WELCOME15', description: '15% off your first order', type: 'percentage', value: 15, minOrderAmount: 500, maxUses: 1000, usedCount: 234, startsAt: '2026-01-01T00:00:00Z', expiresAt: null, active: true, createdAt: '2026-01-01T10:00:00Z' },
  { id: 'disc_2', code: 'SUMMER50', description: 'R50 off orders over R500', type: 'fixed', value: 50, minOrderAmount: 500, maxUses: 500, usedCount: 156, startsAt: '2026-05-01T00:00:00Z', expiresAt: '2026-08-31T23:59:59Z', active: true, createdAt: '2026-05-01T10:00:00Z' },
  { id: 'disc_3', code: 'VIP25', description: '25% off for VIP customers', type: 'percentage', value: 25, minOrderAmount: 1000, maxUses: 50, usedCount: 12, startsAt: '2026-04-01T00:00:00Z', expiresAt: '2026-12-31T23:59:59Z', active: true, createdAt: '2026-04-01T10:00:00Z' },
];

const initialSettings: SiteSettings = {
  id: 'settings_1', siteName: 'RENAISSANCE', siteUrl: 'rncszn.co.za', currency: 'ZAR', currencySymbol: 'R', timezone: 'Africa/Johannesburg', email: 'hello@renaissance.co.za', phone: '+27 10 123 4567', address: { line1: '90 Rivonia Road', line2: 'Sandton', city: 'Johannesburg', state: 'Gauteng', postalCode: '2196', country: 'South Africa' }, seoTitle: 'RENAISSANCE — The Future of Y2K Fashion', seoDescription: 'RENAISSANCE is a premium Y2K luxury fashion house.', seoKeywords: ['y2k fashion', 'chrome clothing', 'holographic fashion'], ogImage: '/og-image.jpg', updatedAt: '2026-06-01T10:00:00Z',
};

// ============================================================
// PRODUCTS
// ============================================================
export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) return sb.sbGetProducts();
  return getStorage(STORAGE_KEYS.products, initialProducts);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (isSupabaseConfigured()) return sb.sbGetProductById(id);
  const products = getStorage(STORAGE_KEYS.products, initialProducts);
  return products.find(p => p.id === id);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (isSupabaseConfigured()) return sb.sbGetProductBySlug(slug);
  const products = getStorage(STORAGE_KEYS.products, initialProducts);
  return products.find(p => p.slug === slug);
}

export async function getPublishedProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) return sb.sbGetPublishedProducts();
  const products = getStorage(STORAGE_KEYS.products, initialProducts);
  return products.filter(p => p.status === 'published');
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  if (isSupabaseConfigured()) {
    const result = await sb.sbCreateProduct(product);
    if (result) return result;
  }
  const products = getStorage(STORAGE_KEYS.products, initialProducts);
  const newProduct: Product = { ...product, id: `prod_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  products.push(newProduct);
  setStorage(STORAGE_KEYS.products, products);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (isSupabaseConfigured()) return sb.sbUpdateProduct(id, updates);
  const products = getStorage(STORAGE_KEYS.products, initialProducts);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
  setStorage(STORAGE_KEYS.products, products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) return sb.sbDeleteProduct(id);
  const products = getStorage(STORAGE_KEYS.products, initialProducts);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  setStorage(STORAGE_KEYS.products, products);
  return true;
}

export async function duplicateProduct(id: string): Promise<Product | null> {
  if (isSupabaseConfigured()) return sb.sbDuplicateProduct(id);
  const product = await getProductById(id);
  if (!product) return null;
  return createProduct({ ...product, name: `${product.name} (Copy)`, slug: `${product.slug}-copy`, status: 'draft' });
}

// ============================================================
// COLLECTIONS
// ============================================================
export async function getCollections(): Promise<Collection[]> {
  if (isSupabaseConfigured()) return sb.sbGetCollections();
  return getStorage(STORAGE_KEYS.collections, initialCollections);
}

export async function getCollectionById(id: string): Promise<Collection | undefined> {
  const collections = await getCollections();
  return collections.find(c => c.id === id);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  const collections = await getCollections();
  return collections.find(c => c.slug === slug);
}

export async function getActiveCollections(): Promise<Collection[]> {
  if (isSupabaseConfigured()) return sb.sbGetActiveCollections();
  const collections = getStorage(STORAGE_KEYS.collections, initialCollections);
  return collections.filter(c => c.status === 'active');
}

export async function getFeaturedCollections(): Promise<Collection[]> {
  const collections = await getCollections();
  return collections.filter(c => c.featured && c.status === 'active');
}

export async function createCollection(collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>): Promise<Collection> {
  if (isSupabaseConfigured()) {
    const result = await sb.sbCreateCollection(collection);
    if (result) return result;
  }
  const collections = getStorage(STORAGE_KEYS.collections, initialCollections);
  const newCol: Collection = { ...collection, id: `col_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  collections.push(newCol);
  setStorage(STORAGE_KEYS.collections, collections);
  return newCol;
}

export async function updateCollection(id: string, updates: Partial<Collection>): Promise<Collection | null> {
  if (isSupabaseConfigured()) return sb.sbUpdateCollection(id, updates);
  const collections = getStorage(STORAGE_KEYS.collections, initialCollections);
  const index = collections.findIndex(c => c.id === id);
  if (index === -1) return null;
  collections[index] = { ...collections[index], ...updates, updatedAt: new Date().toISOString() };
  setStorage(STORAGE_KEYS.collections, collections);
  return collections[index];
}

export async function deleteCollection(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) return sb.sbDeleteCollection(id);
  const collections = getStorage(STORAGE_KEYS.collections, initialCollections);
  const index = collections.findIndex(c => c.id === id);
  if (index === -1) return false;
  collections.splice(index, 1);
  setStorage(STORAGE_KEYS.collections, collections);
  return true;
}

// ============================================================
// ORDERS
// ============================================================
export async function getOrders(): Promise<Order[]> {
  if (isSupabaseConfigured()) return sb.sbGetOrders();
  return getStorage(STORAGE_KEYS.orders, initialOrders);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await getOrders();
  return orders.find(o => o.id === id);
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
  const orders = await getOrders();
  return orders.find(o => o.orderNumber === orderNumber);
}

export async function getOrdersByCustomer(customerId: string): Promise<Order[]> {
  const orders = await getOrders();
  return orders.filter(o => o.customerId === customerId);
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
  if (isSupabaseConfigured()) return sb.sbUpdateOrder(id, updates);
  const orders = getStorage(STORAGE_KEYS.orders, initialOrders);
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() };
  setStorage(STORAGE_KEYS.orders, orders);
  return orders[index];
}

// ============================================================
// CUSTOMERS
// ============================================================
export async function getCustomers(): Promise<Customer[]> {
  if (isSupabaseConfigured()) return sb.sbGetCustomers();
  return getStorage(STORAGE_KEYS.customers, initialCustomers);
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  const customers = await getCustomers();
  return customers.find(c => c.id === id);
}

export async function getCustomerByEmail(email: string): Promise<Customer | undefined> {
  const customers = await getCustomers();
  return customers.find(c => c.email === email);
}

// ============================================================
// DISCOUNTS
// ============================================================
export async function getDiscounts(): Promise<Discount[]> {
  if (isSupabaseConfigured()) return sb.sbGetDiscounts();
  return getStorage(STORAGE_KEYS.discounts, initialDiscounts);
}

export async function getDiscountById(id: string): Promise<Discount | undefined> {
  const discounts = await getDiscounts();
  return discounts.find(d => d.id === id);
}

export async function getDiscountByCode(code: string): Promise<Discount | undefined> {
  const discounts = await getDiscounts();
  return discounts.find(d => d.code.toUpperCase() === code.toUpperCase());
}

export async function getActiveDiscounts(): Promise<Discount[]> {
  if (isSupabaseConfigured()) return sb.sbGetActiveDiscounts();
  const discounts = getStorage(STORAGE_KEYS.discounts, initialDiscounts);
  return discounts.filter(d => d.active);
}

export async function createDiscount(discount: Omit<Discount, 'id' | 'createdAt' | 'usedCount'>): Promise<Discount> {
  if (isSupabaseConfigured()) {
    const result = await sb.sbCreateDiscount(discount);
    if (result) return result;
  }
  const discounts = getStorage(STORAGE_KEYS.discounts, initialDiscounts);
  const newDisc: Discount = { ...discount, id: `disc_${Date.now()}`, usedCount: 0, createdAt: new Date().toISOString() };
  discounts.push(newDisc);
  setStorage(STORAGE_KEYS.discounts, discounts);
  return newDisc;
}

export async function updateDiscount(id: string, updates: Partial<Discount>): Promise<Discount | null> {
  if (isSupabaseConfigured()) return sb.sbUpdateDiscount(id, updates);
  const discounts = getStorage(STORAGE_KEYS.discounts, initialDiscounts);
  const index = discounts.findIndex(d => d.id === id);
  if (index === -1) return null;
  discounts[index] = { ...discounts[index], ...updates };
  setStorage(STORAGE_KEYS.discounts, discounts);
  return discounts[index];
}

export async function deleteDiscount(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) return sb.sbDeleteDiscount(id);
  const discounts = getStorage(STORAGE_KEYS.discounts, initialDiscounts);
  const index = discounts.findIndex(d => d.id === id);
  if (index === -1) return false;
  discounts.splice(index, 1);
  setStorage(STORAGE_KEYS.discounts, discounts);
  return true;
}

// ============================================================
// SETTINGS
// ============================================================
export async function getSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured()) {
    const result = await sb.sbGetSettings();
    if (result) return result;
  }
  return getStorage(STORAGE_KEYS.settings, initialSettings);
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  if (isSupabaseConfigured()) {
    const result = await sb.sbUpdateSettings(updates);
    if (result) return result;
  }
  const settings = getStorage(STORAGE_KEYS.settings, initialSettings);
  const updated = { ...settings, ...updates, updatedAt: new Date().toISOString() };
  setStorage(STORAGE_KEYS.settings, updated);
  return updated;
}

// ============================================================
// DASHBOARD STATS
// ============================================================
export async function getDashboardStats() {
  if (isSupabaseConfigured()) return sb.sbGetDashboardStats();

  const products = getStorage(STORAGE_KEYS.products, initialProducts);
  const orders = getStorage(STORAGE_KEYS.orders, initialOrders);
  const customers = getStorage(STORAGE_KEYS.customers, initialCustomers);
  const discounts = getStorage(STORAGE_KEYS.discounts, initialDiscounts).filter(d => d.active);
  const now = new Date();

  return {
    products: {
      total: products.length,
      published: products.filter(p => p.status === 'published').length,
      draft: products.filter(p => p.status === 'draft').length,
      lowStock: products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5).length,
      outOfStock: products.filter(p => p.stockQuantity === 0).length,
    },
    orders: {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    },
    customers: {
      total: customers.length,
      newThisMonth: customers.filter(c => { const d = new Date(c.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length,
    },
    revenue: {
      total: orders.reduce((sum, o) => sum + o.total, 0),
      thisMonth: orders.filter(o => { const d = new Date(o.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).reduce((sum, o) => sum + o.total, 0),
    },
    activeDiscounts: discounts.length,
    recentOrders: orders.slice(0, 5),
  };
}
