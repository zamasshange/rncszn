// Database types for RENAISSANCE E-commerce

export type ProductStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice: number | null;
  sku: string;
  stockQuantity: number;
  category: string;
  collection: string | null;
  tags: string[];
  status: ProductStatus;
  images: string[];
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductVariant = {
  id: string;
  productId: string;
  size: string;
  color: string;
  sku: string;
  stockQuantity: number;
  price: number;
  salePrice: number | null;
  available: boolean;
  image: string | null;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string | null;
  featured: boolean;
  status: 'active' | 'draft';
  createdAt: string;
  updatedAt: string;
};

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';

export type Order = {
  id: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  productId: string;
  productName: string;
  variantId: string | null;
  variantName: string | null;
  quantity: number;
  price: number;
  salePrice: number | null;
  image: string | null;
};

export type Address = {
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type Customer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  orders: number;
  totalSpent: number;
  addresses: Address[];
  defaultAddress: Address | null;
  createdAt: string;
  updatedAt: string;
};

export type DiscountType = 'percentage' | 'fixed';

export type Discount = {
  id: string;
  code: string;
  description: string;
  type: DiscountType;
  value: number;
  minOrderAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  startsAt: string;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
};

export type HomepageContent = {
  id: string;
  section: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string | null;
  heroButtonText: string | null;
  heroButtonLink: string | null;
  featuredProducts: string[];
  featuredCollections: string[];
  announcementBar: string | null;
  announcementBarLink: string | null;
  updatedAt: string;
};

export type SiteSettings = {
  id: string;
  siteName: string;
  siteUrl: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  email: string;
  phone: string | null;
  address: Address | null;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  ogImage: string | null;
  updatedAt: string;
};

// Database Row types for Supabase
export type DatabaseProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string;
  created_at: string;
  updated_at: string;
};

export type DatabaseCollection = Omit<Collection, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string;
  created_at: string;
  updated_at: string;
};

export type DatabaseOrder = Omit<Order, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string;
  created_at: string;
  updated_at: string;
};

export type DatabaseCustomer = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string;
  created_at: string;
  updated_at: string;
};

export type DatabaseDiscount = Omit<Discount, 'id' | 'createdAt'> & {
  id: string;
  created_at: string;
};

// ============================================================
// TALENT PLATFORM TYPES
// ============================================================
export type ApplicationType = 'model' | 'ambassador' | 'creator' | 'photographer' | 'videographer' | 'stylist' | 'designer' | 'collaborator';
export type ApplicationStatus = 'pending' | 'under_review' | 'shortlisted' | 'interview' | 'accepted' | 'rejected';

export type Application = {
  id: string;
  applicationNumber: string;
  type: ApplicationType;
  status: ApplicationStatus;
  fullName: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  portfolioWebsite: string | null;
  extraFields: Record<string, unknown>;
  whyJoin: string | null;
  whatMakesUnique: string | null;
  whatContribute: string | null;
  aboutYourself: string | null;
  reviewedBy: string | null;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
  // Joined data (populated on fetch)
  files?: ApplicationFile[];
  notes?: ApplicationNote[];
  statusHistory?: StatusHistoryEntry[];
};

export type ApplicationFile = {
  id: string;
  applicationId: string;
  fileType: 'image' | 'pdf' | 'video' | 'headshot' | 'fullbody' | 'additional';
  fileUrl: string;
  fileName: string | null;
  createdAt: string;
};

export type ApplicationNote = {
  id: string;
  applicationId: string;
  note: string;
  author: string;
  createdAt: string;
};

export type StatusHistoryEntry = {
  id: string;
  applicationId: string;
  oldStatus: string | null;
  newStatus: string;
  note: string | null;
  changedBy: string;
  createdAt: string;
};