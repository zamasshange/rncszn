// Local database implementation for demo mode
// This provides full CRUD functionality using localStorage

import { Product, Collection, Order, Customer, Discount, SiteSettings, ProductVariant } from './database';

// Initial demo data
const initialProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Chrome Shell Puffer',
    slug: 'chrome-shell-puffer',
    description: 'A futuristic puffer jacket with reflective chrome shell technology. Features water-resistant exterior and lightweight insulation for ultimate comfort.',
    shortDescription: 'Futuristic chrome puffer with reflective shell',
    price: 680,
    salePrice: null,
    sku: 'CSP-001',
    stockQuantity: 45,
    category: 'Outerwear',
    collection: 'Cyber Atelier',
    tags: ['new', 'chrome', 'puffer'],
    status: 'published',
    images: ['/products/chrome-puffer-1.jpg', '/products/chrome-puffer-2.jpg'],
    thumbnail: '/products/chrome-puffer-1.jpg',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'prod_2',
    name: 'Hyperline Cargo Pant',
    slug: 'hyperline-cargo-pant',
    description: 'Technical cargo pants with hyperline stitching and multiple utility pockets. The perfect blend of functionality and futuristic style.',
    shortDescription: 'Technical cargo pants with utility details',
    price: 320,
    salePrice: 240,
    sku: 'HCP-002',
    stockQuantity: 23,
    category: 'Bottoms',
    collection: 'Cyber Atelier',
    tags: ['sale', 'cargo', 'technical'],
    status: 'published',
    images: ['/products/cargo-pant-1.jpg'],
    thumbnail: '/products/cargo-pant-1.jpg',
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-05-15T10:00:00Z',
  },
  {
    id: 'prod_3',
    name: 'Holo Crop Tee',
    slug: 'holo-crop-tee',
    description: 'Iridescent holographic crop top that shifts colors with movement. Made from premium stretch fabric for a comfortable fit.',
    shortDescription: 'Iridescent holographic crop top',
    price: 180,
    salePrice: null,
    sku: 'HCT-003',
    stockQuantity: 67,
    category: 'Tops',
    collection: 'Mirror Drop',
    tags: ['holographic', 'crop', 'trending'],
    status: 'published',
    images: ['/products/holo-crop-1.jpg'],
    thumbnail: '/products/holo-crop-1.jpg',
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-04-20T10:00:00Z',
  },
  {
    id: 'prod_4',
    name: 'Liquid Chrome Mini Bag',
    slug: 'liquid-chrome-mini-bag',
    description: 'Statement mini bag with liquid chrome finish. Compact size with enough room for essentials.',
    shortDescription: 'Compact chrome statement bag',
    price: 420,
    salePrice: null,
    sku: 'LCMB-004',
    stockQuantity: 0,
    category: 'Accessories',
    collection: 'Mirror Drop',
    tags: ['limited', 'bag', 'chrome'],
    status: 'published',
    images: ['/products/chrome-bag-1.jpg'],
    thumbnail: '/products/chrome-bag-1.jpg',
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-06-08T10:00:00Z',
  },
  {
    id: 'prod_5',
    name: 'Metallic Oversized Blazer',
    slug: 'metallic-oversized-blazer',
    description: 'Statement blazer with metallic finish and oversized silhouette. Perfect for layering over any outfit.',
    shortDescription: 'Metallic oversized blazer',
    price: 450,
    salePrice: null,
    sku: 'MOB-005',
    stockQuantity: 12,
    category: 'Outerwear',
    collection: 'Cyber Atelier',
    tags: ['blazer', 'metallic', 'statement'],
    status: 'published',
    images: ['/products/blazer-1.jpg'],
    thumbnail: '/products/blazer-1.jpg',
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-05-10T10:00:00Z',
  },
  {
    id: 'prod_6',
    name: 'Sequin Midi Dress',
    slug: 'sequin-midi-dress',
    description: 'Dazzling sequin midi dress perfect for special occasions. Features all-over sequin embellishment with a comfortable lining.',
    shortDescription: 'Dazzling sequin midi dress',
    price: 550,
    salePrice: 425,
    sku: 'SMD-006',
    stockQuantity: 8,
    category: 'Dresses',
    collection: 'Y2K Essentials',
    tags: ['dress', 'sequin', 'party'],
    status: 'published',
    images: ['/products/sequin-dress-1.jpg'],
    thumbnail: '/products/sequin-dress-1.jpg',
    createdAt: '2026-02-14T10:00:00Z',
    updatedAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 'prod_7',
    name: 'Y2K Cropped Denim Jacket',
    slug: 'y2k-cropped-denim-jacket',
    description: 'Classic Y2K inspired cropped denim jacket with distressed details. A timeless piece for any wardrobe.',
    shortDescription: 'Classic Y2K cropped denim',
    price: 280,
    salePrice: null,
    sku: 'YCDJ-007',
    stockQuantity: 3,
    category: 'Outerwear',
    collection: 'Y2K Essentials',
    tags: ['denim', 'y2k', 'classic'],
    status: 'published',
    images: ['/products/denim-jacket-1.jpg'],
    thumbnail: '/products/denim-jacket-1.jpg',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-06-05T10:00:00Z',
  },
  {
    id: 'prod_8',
    name: 'Mesh Overlay Top',
    slug: 'mesh-overlay-top',
    description: 'Translucent mesh top perfect for layering. Features a unique overlay design with subtle sparkle.',
    shortDescription: 'Translucent mesh layering top',
    price: 120,
    salePrice: null,
    sku: 'MOT-008',
    stockQuantity: 34,
    category: 'Tops',
    collection: 'Cyber Atelier',
    tags: ['mesh', 'layering', 'transparent'],
    status: 'draft',
    images: ['/products/mesh-top-1.jpg'],
    thumbnail: '/products/mesh-top-1.jpg',
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-08T10:00:00Z',
  },
];

const initialCollections: Collection[] = [
  {
    id: 'col_1',
    name: 'Cyber Atelier',
    slug: 'cyber-atelier',
    description: 'Chrome and metallic pieces engineered for the future. Our flagship collection featuring cutting-edge materials and futuristic silhouettes.',
    bannerImage: '/collections/cyber-atelier.jpg',
    featured: true,
    status: 'active',
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'col_2',
    name: 'Mirror Drop',
    slug: 'mirror-drop',
    description: 'Iridescent and holographic pieces that reflect your unique style. Limited edition drops that sell out fast.',
    bannerImage: '/collections/mirror-drop.jpg',
    featured: true,
    status: 'active',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-05-15T10:00:00Z',
  },
  {
    id: 'col_3',
    name: 'Y2K Essentials',
    slug: 'y2k-essentials',
    description: 'Classic Y2K fashion staples that never go out of style. Timeless pieces for the modern wardrobe.',
    bannerImage: '/collections/y2k-essentials.jpg',
    featured: false,
    status: 'active',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-04-10T10:00:00Z',
  },
  {
    id: 'col_4',
    name: 'Limited Drops',
    slug: 'limited-drops',
    description: 'Exclusive limited edition pieces. Once they\'re gone, they\'re gone forever.',
    bannerImage: '/collections/limited-drops.jpg',
    featured: true,
    status: 'active',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'col_5',
    name: 'Summer Collection',
    slug: 'summer-collection',
    description: 'Summer-inspired fashion pieces for the warm season.',
    bannerImage: null,
    featured: false,
    status: 'draft',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z',
  },
];

const initialCustomers: Customer[] = [
  {
    id: 'cust_1',
    email: 'emma@example.com',
    firstName: 'Emma',
    lastName: 'Watson',
    phone: '+27 82 123 4567',
    orders: 12,
    totalSpent: 8450,
    addresses: [
      {
        line1: '123 Main Street',
        line2: 'Sandton',
        city: 'Johannesburg',
        state: 'Gauteng',
        postalCode: '2196',
        country: 'South Africa',
      },
    ],
    defaultAddress: {
      line1: '123 Main Street',
      line2: 'Sandton',
      city: 'Johannesburg',
      state: 'Gauteng',
      postalCode: '2196',
      country: 'South Africa',
    },
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'cust_2',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Smith',
    phone: '+27 83 234 5678',
    orders: 5,
    totalSpent: 2340,
    addresses: [
      {
        line1: '45 Ocean Drive',
        line2: null,
        city: 'Cape Town',
        state: 'Western Cape',
        postalCode: '8001',
        country: 'South Africa',
      },
    ],
    defaultAddress: {
      line1: '45 Ocean Drive',
      line2: null,
      city: 'Cape Town',
      state: 'Western Cape',
      postalCode: '8001',
      country: 'South Africa',
    },
    createdAt: '2025-03-20T10:00:00Z',
    updatedAt: '2026-04-15T10:00:00Z',
  },
  {
    id: 'cust_3',
    email: 'sarah@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+27 84 345 6789',
    orders: 8,
    totalSpent: 4560,
    addresses: [
      {
        line1: '78 Garden Road',
        line2: 'Rosebank',
        city: 'Johannesburg',
        state: 'Gauteng',
        postalCode: '2192',
        country: 'South Africa',
      },
    ],
    defaultAddress: {
      line1: '78 Garden Road',
      line2: 'Rosebank',
      city: 'Johannesburg',
      state: 'Gauteng',
      postalCode: '2192',
      country: 'South Africa',
    },
    createdAt: '2025-05-10T10:00:00Z',
    updatedAt: '2026-05-20T10:00:00Z',
  },
];

const initialOrders: Order[] = [
  {
    id: 'ord_1',
    orderNumber: 'ORD-10293',
    customerId: 'cust_1',
    customerEmail: 'emma@example.com',
    customerName: 'Emma Watson',
    items: [
      {
        productId: 'prod_1',
        productName: 'Chrome Shell Puffer',
        variantId: null,
        variantName: 'M / Silver',
        quantity: 1,
        price: 680,
        salePrice: null,
        image: '/products/chrome-puffer-1.jpg',
      },
    ],
    subtotal: 680,
    tax: 68,
    shipping: 0,
    discount: 0,
    total: 748,
    status: 'completed',
    shippingAddress: {
      line1: '123 Main Street',
      line2: 'Sandton',
      city: 'Johannesburg',
      state: 'Gauteng',
      postalCode: '2196',
      country: 'South Africa',
    },
    billingAddress: {
      line1: '123 Main Street',
      line2: 'Sandton',
      city: 'Johannesburg',
      state: 'Gauteng',
      postalCode: '2196',
      country: 'South Africa',
    },
    notes: null,
    createdAt: '2026-06-08T10:00:00Z',
    updatedAt: '2026-06-08T14:00:00Z',
  },
  {
    id: 'ord_2',
    orderNumber: 'ORD-10292',
    customerId: 'cust_2',
    customerEmail: 'john@example.com',
    customerName: 'John Smith',
    items: [
      {
        productId: 'prod_2',
        productName: 'Hyperline Cargo Pant',
        variantId: null,
        variantName: 'L / White',
        quantity: 1,
        price: 240,
        salePrice: 240,
        image: '/products/cargo-pant-1.jpg',
      },
      {
        productId: 'prod_3',
        productName: 'Holo Crop Tee',
        variantId: null,
        variantName: 'M / Iridescent',
        quantity: 1,
        price: 180,
        salePrice: null,
        image: '/products/holo-crop-1.jpg',
      },
    ],
    subtotal: 420,
    tax: 42,
    shipping: 0,
    discount: 0,
    total: 462,
    status: 'processing',
    shippingAddress: {
      line1: '45 Ocean Drive',
      line2: null,
      city: 'Cape Town',
      state: 'Western Cape',
      postalCode: '8001',
      country: 'South Africa',
    },
    billingAddress: {
      line1: '45 Ocean Drive',
      line2: null,
      city: 'Cape Town',
      state: 'Western Cape',
      postalCode: '8001',
      country: 'South Africa',
    },
    notes: 'Please gift wrap',
    createdAt: '2026-06-07T09:00:00Z',
    updatedAt: '2026-06-07T15:00:00Z',
  },
  {
    id: 'ord_3',
    orderNumber: 'ORD-10291',
    customerId: 'cust_3',
    customerEmail: 'sarah@example.com',
    customerName: 'Sarah Johnson',
    items: [
      {
        productId: 'prod_6',
        productName: 'Sequin Midi Dress',
        variantId: null,
        variantName: 'S / Silver',
        quantity: 1,
        price: 425,
        salePrice: 425,
        image: '/products/sequin-dress-1.jpg',
      },
    ],
    subtotal: 425,
    tax: 42.5,
    shipping: 0,
    discount: 0,
    total: 467.5,
    status: 'shipped',
    shippingAddress: {
      line1: '78 Garden Road',
      line2: 'Rosebank',
      city: 'Johannesburg',
      state: 'Gauteng',
      postalCode: '2192',
      country: 'South Africa',
    },
    billingAddress: {
      line1: '78 Garden Road',
      line2: 'Rosebank',
      city: 'Johannesburg',
      state: 'Gauteng',
      postalCode: '2192',
      country: 'South Africa',
    },
    notes: null,
    createdAt: '2026-06-06T11:00:00Z',
    updatedAt: '2026-06-07T10:00:00Z',
  },
  {
    id: 'ord_4',
    orderNumber: 'ORD-10290',
    customerId: 'cust_1',
    customerEmail: 'emma@example.com',
    customerName: 'Emma Watson',
    items: [
      {
        productId: 'prod_5',
        productName: 'Metallic Oversized Blazer',
        variantId: null,
        variantName: 'M / Silver',
        quantity: 1,
        price: 450,
        salePrice: null,
        image: '/products/blazer-1.jpg',
      },
    ],
    subtotal: 450,
    tax: 45,
    shipping: 0,
    discount: 0,
    total: 495,
    status: 'pending',
    shippingAddress: {
      line1: '123 Main Street',
      line2: 'Sandton',
      city: 'Johannesburg',
      state: 'Gauteng',
      postalCode: '2196',
      country: 'South Africa',
    },
    billingAddress: {
      line1: '123 Main Street',
      line2: 'Sandton',
      city: 'Johannesburg',
      state: 'Gauteng',
      postalCode: '2196',
      country: 'South Africa',
    },
    notes: null,
    createdAt: '2026-06-05T16:00:00Z',
    updatedAt: '2026-06-05T16:00:00Z',
  },
];

const initialDiscounts: Discount[] = [
  {
    id: 'disc_1',
    code: 'WELCOME15',
    description: '15% off your first order',
    type: 'percentage',
    value: 15,
    minOrderAmount: 500,
    maxUses: 1000,
    usedCount: 234,
    startsAt: '2026-01-01T00:00:00Z',
    expiresAt: null,
    active: true,
    createdAt: '2026-01-01T10:00:00Z',
  },
  {
    id: 'disc_2',
    code: 'SUMMER50',
    description: 'R50 off orders over R500',
    type: 'fixed',
    value: 50,
    minOrderAmount: 500,
    maxUses: 500,
    usedCount: 156,
    startsAt: '2026-05-01T00:00:00Z',
    expiresAt: '2026-08-31T23:59:59Z',
    active: true,
    createdAt: '2026-05-01T10:00:00Z',
  },
  {
    id: 'disc_3',
    code: 'VIP25',
    description: '25% off for VIP customers',
    type: 'percentage',
    value: 25,
    minOrderAmount: 1000,
    maxUses: 50,
    usedCount: 12,
    startsAt: '2026-04-01T00:00:00Z',
    expiresAt: '2026-12-31T23:59:59Z',
    active: true,
    createdAt: '2026-04-01T10:00:00Z',
  },
];

const initialSettings: SiteSettings = {
  id: 'settings_1',
  siteName: 'RENAISSANCE',
  siteUrl: 'rncszn.co.za',
  currency: 'ZAR',
  currencySymbol: 'R',
  timezone: 'Africa/Johannesburg',
  email: 'hello@renaissance.co.za',
  phone: '+27 10 123 4567',
  address: {
    line1: '90 Rivonia Road',
    line2: 'Sandton',
    city: 'Johannesburg',
    state: 'Gauteng',
    postalCode: '2196',
    country: 'South Africa',
  },
  seoTitle: 'RENAISSANCE — The Future of Y2K Fashion',
  seoDescription: 'RENAISSANCE is a premium Y2K luxury fashion house. Chrome, holographic, and editorial pieces engineered for the future of fashion.',
  seoKeywords: ['y2k fashion', 'chrome clothing', 'holographic fashion', 'luxury fashion', 'south african fashion'],
  ogImage: '/og-image.jpg',
  updatedAt: '2026-06-01T10:00:00Z',
};

const STORAGE_KEYS = {
  products: 'renaissance_products',
  collections: 'renaissance_collections',
  orders: 'renaissance_orders',
  customers: 'renaissance_customers',
  discounts: 'renaissance_discounts',
  settings: 'renaissance_settings',
};

function initializeStorage<T>(key: string, initialData: T): T {
  if (typeof window === 'undefined') return initialData;

  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(stored);
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Products
export function getProducts(): Product[] {
  return initializeStorage(STORAGE_KEYS.products, initialProducts);
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find(p => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getProducts();
  return products.find(p => p.slug === slug);
}

export function getPublishedProducts(): Product[] {
  const products = getProducts();
  return products.filter(p => p.status === 'published');
}

export function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: `prod_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveToStorage(STORAGE_KEYS.products, products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveToStorage(STORAGE_KEYS.products, products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;

  products.splice(index, 1);
  saveToStorage(STORAGE_KEYS.products, products);
  return true;
}

export function duplicateProduct(id: string): Product | null {
  const product = getProductById(id);
  if (!product) return null;

  const newProduct = createProduct({
    ...product,
    name: `${product.name} (Copy)`,
    slug: `${product.slug}-copy`,
    status: 'draft',
  });
  return newProduct;
}

// Collections
export function getCollections(): Collection[] {
  return initializeStorage(STORAGE_KEYS.collections, initialCollections);
}

export function getCollectionById(id: string): Collection | undefined {
  const collections = getCollections();
  return collections.find(c => c.id === id);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  const collections = getCollections();
  return collections.find(c => c.slug === slug);
}

export function getActiveCollections(): Collection[] {
  const collections = getCollections();
  return collections.filter(c => c.status === 'active');
}

export function getFeaturedCollections(): Collection[] {
  const collections = getCollections();
  return collections.filter(c => c.featured && c.status === 'active');
}

export function createCollection(collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>): Collection {
  const collections = getCollections();
  const newCollection: Collection = {
    ...collection,
    id: `col_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  collections.push(newCollection);
  saveToStorage(STORAGE_KEYS.collections, collections);
  return newCollection;
}

export function updateCollection(id: string, updates: Partial<Collection>): Collection | null {
  const collections = getCollections();
  const index = collections.findIndex(c => c.id === id);
  if (index === -1) return null;

  collections[index] = {
    ...collections[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveToStorage(STORAGE_KEYS.collections, collections);
  return collections[index];
}

export function deleteCollection(id: string): boolean {
  const collections = getCollections();
  const index = collections.findIndex(c => c.id === id);
  if (index === -1) return false;

  collections.splice(index, 1);
  saveToStorage(STORAGE_KEYS.collections, collections);
  return true;
}

// Orders
export function getOrders(): Order[] {
  return initializeStorage(STORAGE_KEYS.orders, initialOrders);
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders();
  return orders.find(o => o.id === id);
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  const orders = getOrders();
  return orders.find(o => o.orderNumber === orderNumber);
}

export function getOrdersByCustomer(customerId: string): Order[] {
  const orders = getOrders();
  return orders.filter(o => o.customerId === customerId);
}

export function updateOrder(id: string, updates: Partial<Order>): Order | null {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveToStorage(STORAGE_KEYS.orders, orders);
  return orders[index];
}

// Customers
export function getCustomers(): Customer[] {
  return initializeStorage(STORAGE_KEYS.customers, initialCustomers);
}

export function getCustomerById(id: string): Customer | undefined {
  const customers = getCustomers();
  return customers.find(c => c.id === id);
}

export function getCustomerByEmail(email: string): Customer | undefined {
  const customers = getCustomers();
  return customers.find(c => c.email === email);
}

// Discounts
export function getDiscounts(): Discount[] {
  return initializeStorage(STORAGE_KEYS.discounts, initialDiscounts);
}

export function getDiscountById(id: string): Discount | undefined {
  const discounts = getDiscounts();
  return discounts.find(d => d.id === id);
}

export function getDiscountByCode(code: string): Discount | undefined {
  const discounts = getDiscounts();
  return discounts.find(d => d.code.toUpperCase() === code.toUpperCase());
}

export function getActiveDiscounts(): Discount[] {
  const discounts = getDiscounts();
  return discounts.filter(d => d.active);
}

export function createDiscount(discount: Omit<Discount, 'id' | 'createdAt' | 'usedCount'>): Discount {
  const discounts = getDiscounts();
  const newDiscount: Discount = {
    ...discount,
    id: `disc_${Date.now()}`,
    usedCount: 0,
    createdAt: new Date().toISOString(),
  };
  discounts.push(newDiscount);
  saveToStorage(STORAGE_KEYS.discounts, discounts);
  return newDiscount;
}

export function updateDiscount(id: string, updates: Partial<Discount>): Discount | null {
  const discounts = getDiscounts();
  const index = discounts.findIndex(d => d.id === id);
  if (index === -1) return null;

  discounts[index] = {
    ...discounts[index],
    ...updates,
  };
  saveToStorage(STORAGE_KEYS.discounts, discounts);
  return discounts[index];
}

export function deleteDiscount(id: string): boolean {
  const discounts = getDiscounts();
  const index = discounts.findIndex(d => d.id === id);
  if (index === -1) return false;

  discounts.splice(index, 1);
  saveToStorage(STORAGE_KEYS.discounts, discounts);
  return true;
}

// Settings
export function getSettings(): SiteSettings {
  return initializeStorage(STORAGE_KEYS.settings, initialSettings);
}

export function updateSettings(updates: Partial<SiteSettings>): SiteSettings {
  const settings = getSettings();
  const updated = {
    ...settings,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveToStorage(STORAGE_KEYS.settings, updated);
  return updated;
}

// Stats
export function getDashboardStats() {
  const products = getProducts();
  const orders = getOrders();
  const customers = getCustomers();
  const discounts = getActiveDiscounts();

  const totalProducts = products.length;
  const publishedProducts = products.filter(p => p.status === 'published').length;
  const lowStockProducts = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5).length;
  const outOfStockProducts = products.filter(p => p.stockQuantity === 0).length;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  const totalCustomers = customers.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const recentOrders = orders.slice(0, 5);

  return {
    products: {
      total: totalProducts,
      published: publishedProducts,
      draft: products.filter(p => p.status === 'draft').length,
      lowStock: lowStockProducts,
      outOfStock: outOfStockProducts,
    },
    orders: {
      total: totalOrders,
      pending: pendingOrders,
      processing: processingOrders,
      shipped: shippedOrders,
      completed: completedOrders,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    },
    customers: {
      total: totalCustomers,
      newThisMonth: customers.filter(c => {
        const created = new Date(c.createdAt);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length,
    },
    revenue: {
      total: totalRevenue,
      thisMonth: orders
        .filter(o => {
          const created = new Date(o.createdAt);
          const now = new Date();
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        })
        .reduce((sum, o) => sum + o.total, 0),
    },
    activeDiscounts: discounts.length,
    recentOrders,
  };
}