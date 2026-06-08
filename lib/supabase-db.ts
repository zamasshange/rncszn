// Supabase-backed database layer for RENAISSANCE
// Falls back to null if Supabase is not configured

import { supabase, isSupabaseConfigured } from './supabase';
import type { Product, Collection, Order, Customer, Discount, SiteSettings } from './database';

// Helper to map Supabase row → Product type
function mapProductRow(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    shortDescription: row.short_description || '',
    price: Number(row.price) || 0,
    salePrice: row.sale_price ? Number(row.sale_price) : null,
    sku: row.sku || '',
    stockQuantity: row.stock_quantity || 0,
    category: row.category || '',
    collection: row.collection || null,
    tags: row.tags || [],
    status: row.status,
    images: row.images || [],
    thumbnail: row.thumbnail || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCollectionRow(row: any): Collection {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    bannerImage: row.banner_image || null,
    featured: row.featured || false,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapOrderRow(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerId: row.customer_id,
    customerEmail: row.customer_email,
    customerName: row.customer_name,
    items: row.items || [],
    subtotal: Number(row.subtotal) || 0,
    tax: Number(row.tax) || 0,
    shipping: Number(row.shipping) || 0,
    discount: Number(row.discount) || 0,
    total: Number(row.total) || 0,
    status: row.status,
    shippingAddress: row.shipping_address || {},
    billingAddress: row.billing_address || {},
    notes: row.notes || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCustomerRow(row: any): Customer {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    phone: row.phone || null,
    orders: row.orders_count || 0,
    totalSpent: Number(row.total_spent) || 0,
    addresses: row.addresses || [],
    defaultAddress: row.default_address || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDiscountRow(row: any): Discount {
  return {
    id: row.id,
    code: row.code,
    description: row.description || '',
    type: row.type,
    value: Number(row.value) || 0,
    minOrderAmount: row.min_order_amount ? Number(row.min_order_amount) : null,
    maxUses: row.max_uses || null,
    usedCount: row.used_count || 0,
    startsAt: row.starts_at,
    expiresAt: row.expires_at || null,
    active: row.active,
    createdAt: row.created_at,
  };
}

function mapSettingsRow(row: any): SiteSettings {
  return {
    id: row.id,
    siteName: row.site_name || '',
    siteUrl: row.site_url || '',
    currency: row.currency || 'ZAR',
    currencySymbol: row.currency_symbol || 'R',
    timezone: row.timezone || 'Africa/Johannesburg',
    email: row.email || '',
    phone: row.phone || null,
    address: row.address || null,
    seoTitle: row.seo_title || '',
    seoDescription: row.seo_description || '',
    seoKeywords: row.seo_keywords || [],
    ogImage: row.og_image || null,
    updatedAt: row.updated_at,
  };
}

// ============================================================
// PRODUCTS
// ============================================================
export async function sbGetProducts(): Promise<Product[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('sbGetProducts error:', JSON.stringify(error, null, 2), error.message); return []; }
  return (data || []).map(mapProductRow);
}

export async function sbGetPublishedProducts(): Promise<Product[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  if (error) { console.error('sbGetPublishedProducts error:', JSON.stringify(error, null, 2), error.message); return []; }
  return (data || []).map(mapProductRow);
}

export async function sbGetProductById(id: string): Promise<Product | undefined> {
  if (!supabase) return undefined;
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) return undefined;
  return data ? mapProductRow(data) : undefined;
}

export async function sbGetProductBySlug(slug: string): Promise<Product | undefined> {
  if (!supabase) return undefined;
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
  if (error) return undefined;
  return data ? mapProductRow(data) : undefined;
}

export async function sbCreateProduct(product: Partial<Product>): Promise<Product | null> {
  if (!supabase) return null;
  const insertData = {
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    short_description: product.shortDescription || '',
    price: product.price || 0,
    sale_price: product.salePrice || null,
    sku: product.sku || '',
    stock_quantity: product.stockQuantity || 0,
    category: product.category || '',
    collection: product.collection || null,
    tags: product.tags || [],
    status: product.status || 'draft',
    images: product.images || [],
    thumbnail: product.thumbnail || null,
  };
  const { data, error } = await supabase.from('products').insert(insertData).select().single();
  if (error) { console.error('sbCreateProduct error:', error); return null; }
  return data ? mapProductRow(data) : null;
}

export async function sbUpdateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (!supabase) return null;
  const updateData: any = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.slug !== undefined) updateData.slug = updates.slug;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.shortDescription !== undefined) updateData.short_description = updates.shortDescription;
  if (updates.price !== undefined) updateData.price = updates.price;
  if (updates.salePrice !== undefined) updateData.sale_price = updates.salePrice;
  if (updates.sku !== undefined) updateData.sku = updates.sku;
  if (updates.stockQuantity !== undefined) updateData.stock_quantity = updates.stockQuantity;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.collection !== undefined) updateData.collection = updates.collection;
  if (updates.tags !== undefined) updateData.tags = updates.tags;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.images !== undefined) updateData.images = updates.images;
  if (updates.thumbnail !== undefined) updateData.thumbnail = updates.thumbnail;

  const { data, error } = await supabase.from('products').update(updateData).eq('id', id).select().single();
  if (error) { console.error('sbUpdateProduct error:', error); return null; }
  return data ? mapProductRow(data) : null;
}

export async function sbDeleteProduct(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('products').delete().eq('id', id);
  return !error;
}

export async function sbDuplicateProduct(id: string): Promise<Product | null> {
  const original = await sbGetProductById(id);
  if (!original) return null;
  return sbCreateProduct({
    ...original,
    id: undefined as any,
    name: `${original.name} (Copy)`,
    slug: `${original.slug}-copy`,
    status: 'draft',
    createdAt: undefined as any,
    updatedAt: undefined as any,
  });
}

// ============================================================
// COLLECTIONS
// ============================================================
export async function sbGetCollections(): Promise<Collection[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('collections').select('*').order('created_at', { ascending: false });
  return (data || []).map(mapCollectionRow);
}

export async function sbGetActiveCollections(): Promise<Collection[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('collections').select('*').eq('status', 'active').order('created_at', { ascending: false });
  return (data || []).map(mapCollectionRow);
}

export async function sbCreateCollection(collection: Partial<Collection>): Promise<Collection | null> {
  if (!supabase) return null;
  const insertData = {
    name: collection.name, slug: collection.slug, description: collection.description || '',
    banner_image: collection.bannerImage || null, featured: collection.featured || false, status: collection.status || 'active',
  };
  const { data, error } = await supabase.from('collections').insert(insertData).select().single();
  if (error) { console.error('sbCreateCollection error:', error); return null; }
  return data ? mapCollectionRow(data) : null;
}

export async function sbUpdateCollection(id: string, updates: Partial<Collection>): Promise<Collection | null> {
  if (!supabase) return null;
  const updateData: any = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.slug !== undefined) updateData.slug = updates.slug;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.bannerImage !== undefined) updateData.banner_image = updates.bannerImage;
  if (updates.featured !== undefined) updateData.featured = updates.featured;
  if (updates.status !== undefined) updateData.status = updates.status;
  const { data, error } = await supabase.from('collections').update(updateData).eq('id', id).select().single();
  if (error) return null;
  return data ? mapCollectionRow(data) : null;
}

export async function sbDeleteCollection(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('collections').delete().eq('id', id);
  return !error;
}

// ============================================================
// ORDERS
// ============================================================
export async function sbGetOrders(): Promise<Order[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  return (data || []).map(mapOrderRow);
}

export async function sbUpdateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
  if (!supabase) return null;
  const updateData: any = {};
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  if (updates.total !== undefined) updateData.total = updates.total;
  const { data, error } = await supabase.from('orders').update(updateData).eq('id', id).select().single();
  if (error) return null;
  return data ? mapOrderRow(data) : null;
}

// ============================================================
// CUSTOMERS
// ============================================================
export async function sbGetCustomers(): Promise<Customer[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
  return (data || []).map(mapCustomerRow);
}

// ============================================================
// DISCOUNTS
// ============================================================
export async function sbGetDiscounts(): Promise<Discount[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('discounts').select('*').order('created_at', { ascending: false });
  return (data || []).map(mapDiscountRow);
}

export async function sbGetActiveDiscounts(): Promise<Discount[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('discounts').select('*').eq('active', true);
  return (data || []).map(mapDiscountRow);
}

export async function sbCreateDiscount(discount: Partial<Discount>): Promise<Discount | null> {
  if (!supabase) return null;
  const insertData = {
    code: discount.code, description: discount.description || '', type: discount.type,
    value: discount.value, min_order_amount: discount.minOrderAmount || null,
    max_uses: discount.maxUses || null, used_count: 0,
    starts_at: discount.startsAt || new Date().toISOString(),
    expires_at: discount.expiresAt || null, active: discount.active !== false,
  };
  const { data, error } = await supabase.from('discounts').insert(insertData).select().single();
  if (error) return null;
  return data ? mapDiscountRow(data) : null;
}

export async function sbUpdateDiscount(id: string, updates: Partial<Discount>): Promise<Discount | null> {
  if (!supabase) return null;
  const updateData: any = {};
  if (updates.code !== undefined) updateData.code = updates.code;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.value !== undefined) updateData.value = updates.value;
  if (updates.minOrderAmount !== undefined) updateData.min_order_amount = updates.minOrderAmount;
  if (updates.maxUses !== undefined) updateData.max_uses = updates.maxUses;
  if (updates.usedCount !== undefined) updateData.used_count = updates.usedCount;
  if (updates.startsAt !== undefined) updateData.starts_at = updates.startsAt;
  if (updates.expiresAt !== undefined) updateData.expires_at = updates.expiresAt;
  if (updates.active !== undefined) updateData.active = updates.active;
  const { data, error } = await supabase.from('discounts').update(updateData).eq('id', id).select().single();
  if (error) return null;
  return data ? mapDiscountRow(data) : null;
}

export async function sbDeleteDiscount(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('discounts').delete().eq('id', id);
  return !error;
}

// ============================================================
// SETTINGS
// ============================================================
export async function sbGetSettings(): Promise<SiteSettings | null> {
  if (!supabase) return null;
  const { data } = await supabase.from('site_settings').select('*').limit(1).single();
  return data ? mapSettingsRow(data) : null;
}

export async function sbUpdateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings | null> {
  if (!supabase) return null;
  const { data: existing } = await supabase.from('site_settings').select('id').limit(1).single();
  if (!existing) return null;
  const updateData: any = {};
  if (updates.siteName !== undefined) updateData.site_name = updates.siteName;
  if (updates.siteUrl !== undefined) updateData.site_url = updates.siteUrl;
  if (updates.currency !== undefined) updateData.currency = updates.currency;
  if (updates.currencySymbol !== undefined) updateData.currency_symbol = updates.currencySymbol;
  if (updates.email !== undefined) updateData.email = updates.email;
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  if (updates.address !== undefined) updateData.address = updates.address;
  if (updates.seoTitle !== undefined) updateData.seo_title = updates.seoTitle;
  if (updates.seoDescription !== undefined) updateData.seo_description = updates.seoDescription;
  if (updates.seoKeywords !== undefined) updateData.seo_keywords = updates.seoKeywords;
  const { data, error } = await supabase.from('site_settings').update(updateData).eq('id', existing.id).select().single();
  if (error) return null;
  return data ? mapSettingsRow(data) : null;
}

// ============================================================
// DASHBOARD STATS
// ============================================================
export async function sbGetDashboardStats() {
  const [products, orders, customers, discounts] = await Promise.all([
    sbGetProducts(),
    sbGetOrders(),
    sbGetCustomers(),
    sbGetActiveDiscounts(),
  ]);

  const now = new Date();
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

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
      newThisMonth: customers.filter(c => {
        const created = new Date(c.createdAt);
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length,
    },
    revenue: {
      total: totalRevenue,
      thisMonth: orders
        .filter(o => {
          const created = new Date(o.createdAt);
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        })
        .reduce((sum, o) => sum + o.total, 0),
    },
    activeDiscounts: discounts.length,
    recentOrders: orders.slice(0, 5),
  };
}
