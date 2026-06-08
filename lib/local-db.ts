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
  products: 'renaissance_products',
  collections: 'renaissance_collections',
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
  { id: 'prod_1', name: 'Chrome Shell Puffer', slug: 'chrome-shell-puffer', description: 'A futuristic puffer jacket with reflective chrome shell technology.', shortDescription: 'Futuristic chrome puffer with reflective shell', price: 680, salePrice: null, sku: 'CSP-001', stockQuantity: 45, category: 'Outerwear', collection: 'Cyber Atelier', tags: ['new', 'chrome', 'puffer'], status: 'published', images: ['/product-jacket.png'], thumbnail: '/product-jacket.png', createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-06-01T10:00:00Z' },
  { id: 'prod_2', name: 'Hyperline Cargo Pant', slug: 'hyperline-cargo-pant', description: 'Technical cargo pants with hyperline stitching and multiple utility pockets.', shortDescription: 'Technical cargo pants with utility details', price: 320, salePrice: 240, sku: 'HCP-002', stockQuantity: 23, category: 'Bottoms', collection: 'Cyber Atelier', tags: ['sale', 'cargo', 'technical'], status: 'published', images: ['/product-pants.png'], thumbnail: '/product-pants.png', createdAt: '2026-02-20T10:00:00Z', updatedAt: '2026-05-15T10:00:00Z' },
  { id: 'prod_3', name: 'Holo Crop Tee', slug: 'holo-crop-tee', description: 'Iridescent holographic crop top that shifts colors with movement.', shortDescription: 'Iridescent holographic crop top', price: 180, salePrice: null, sku: 'HCT-003', stockQuantity: 67, category: 'Tops', collection: 'Mirror Drop', tags: ['holographic', 'crop', 'trending'], status: 'published', images: ['/product-top.png'], thumbnail: '/product-top.png', createdAt: '2026-03-10T10:00:00Z', updatedAt: '2026-04-20T10:00:00Z' },
  { id: 'prod_4', name: 'Liquid Chrome Mini Bag', slug: 'liquid-chrome-mini-bag', description: 'Statement mini bag with liquid chrome finish.', shortDescription: 'Compact chrome statement bag', price: 420, salePrice: null, sku: 'LCMB-004', stockQuantity: 0, category: 'Accessories', collection: 'Mirror Drop', tags: ['limited', 'bag', 'chrome'], status: 'published', images: ['/product-bag.png'], thumbnail: '/product-bag.png', createdAt: '2026-01-05T10:00:00Z', updatedAt: '2026-06-08T10:00:00Z' },
  { id: 'prod_5', name: 'Metallic Oversized Blazer', slug: 'metallic-oversized-blazer', description: 'Statement blazer with metallic finish and oversized silhouette.', shortDescription: 'Metallic oversized blazer', price: 450, salePrice: null, sku: 'MOB-005', stockQuantity: 12, category: 'Outerwear', collection: 'Cyber Atelier', tags: ['blazer', 'metallic', 'statement'], status: 'published', images: ['/product-jacket.png'], thumbnail: '/product-jacket.png', createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-05-10T10:00:00Z' },
  { id: 'prod_6', name: 'Sequin Midi Dress', slug: 'sequin-midi-dress', description: 'Dazzling sequin midi dress perfect for special occasions.', shortDescription: 'Dazzling sequin midi dress', price: 550, salePrice: 425, sku: 'SMD-006', stockQuantity: 8, category: 'Dresses', collection: 'Y2K Essentials', tags: ['dress', 'sequin', 'party'], status: 'published', images: ['/product-top.png'], thumbnail: '/product-top.png', createdAt: '2026-02-14T10:00:00Z', updatedAt: '2026-05-20T10:00:00Z' },
  { id: 'prod_7', name: 'Y2K Cropped Denim Jacket', slug: 'y2k-cropped-denim-jacket', description: 'Classic Y2K inspired cropped denim jacket with distressed details.', shortDescription: 'Classic Y2K cropped denim', price: 280, salePrice: null, sku: 'YCDJ-007', stockQuantity: 3, category: 'Outerwear', collection: 'Y2K Essentials', tags: ['denim', 'y2k', 'classic'], status: 'published', images: ['/product-jacket.png'], thumbnail: '/product-jacket.png', createdAt: '2026-01-20T10:00:00Z', updatedAt: '2026-06-05T10:00:00Z' },
  { id: 'prod_8', name: 'Mesh Overlay Top', slug: 'mesh-overlay-top', description: 'Translucent mesh top perfect for layering.', shortDescription: 'Translucent mesh layering top', price: 120, salePrice: null, sku: 'MOT-008', stockQuantity: 34, category: 'Tops', collection: 'Cyber Atelier', tags: ['mesh', 'layering', 'transparent'], status: 'draft', images: ['/product-top.png'], thumbnail: '/product-top.png', createdAt: '2026-06-01T10:00:00Z', updatedAt: '2026-06-08T10:00:00Z' },
];

const initialCollections: Collection[] = [
  { id: 'col_1', name: 'Cyber Atelier', slug: 'cyber-atelier', description: 'Chrome and metallic pieces engineered for the future.', bannerImage: null, featured: true, status: 'active', createdAt: '2026-01-01T10:00:00Z', updatedAt: '2026-06-01T10:00:00Z' },
  { id: 'col_2', name: 'Mirror Drop', slug: 'mirror-drop', description: 'Iridescent and holographic pieces that reflect your unique style.', bannerImage: null, featured: true, status: 'active', createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-05-15T10:00:00Z' },
  { id: 'col_3', name: 'Y2K Essentials', slug: 'y2k-essentials', description: 'Classic Y2K fashion staples that never go out of style.', bannerImage: null, featured: false, status: 'active', createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-04-10T10:00:00Z' },
  { id: 'col_4', name: 'Limited Drops', slug: 'limited-drops', description: 'Exclusive limited edition pieces.', bannerImage: null, featured: true, status: 'active', createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-06-01T10:00:00Z' },
];

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
