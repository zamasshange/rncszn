-- ============================================================
-- RENAISSANCE E-Commerce — Full Supabase Setup
-- Run this ENTIRE script in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Clean up if re-running
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS discounts CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- ============================================================
-- 1. COLLECTIONS
-- ============================================================
CREATE TABLE collections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  banner_image text,
  featured boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'draft')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 2. PRODUCTS
-- ============================================================
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  short_description text DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  sale_price numeric(10,2),
  sku text DEFAULT '',
  stock_quantity integer DEFAULT 0,
  category text DEFAULT '',
  collection text,
  tags text[] DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  images text[] DEFAULT '{}',
  thumbnail text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 3. PRODUCT VARIANTS
-- ============================================================
CREATE TABLE product_variants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  size text NOT NULL,
  color text NOT NULL DEFAULT '',
  sku text DEFAULT '',
  stock_quantity integer DEFAULT 0,
  price numeric(10,2) NOT NULL,
  sale_price numeric(10,2),
  available boolean DEFAULT true,
  image text
);

-- ============================================================
-- 4. CUSTOMERS
-- ============================================================
CREATE TABLE customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  phone text,
  orders_count integer DEFAULT 0,
  total_spent numeric(12,2) DEFAULT 0,
  addresses jsonb DEFAULT '[]',
  default_address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 5. ORDERS
-- ============================================================
CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number text NOT NULL UNIQUE,
  customer_id uuid REFERENCES customers(id),
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  subtotal numeric(10,2) DEFAULT 0,
  tax numeric(10,2) DEFAULT 0,
  shipping numeric(10,2) DEFAULT 0,
  discount numeric(10,2) DEFAULT 0,
  total numeric(10,2) DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'completed', 'cancelled')),
  shipping_address jsonb NOT NULL DEFAULT '{}',
  billing_address jsonb NOT NULL DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 6. DISCOUNTS
-- ============================================================
CREATE TABLE discounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  description text DEFAULT '',
  type text NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value numeric(10,2) NOT NULL,
  min_order_amount numeric(10,2),
  max_uses integer,
  used_count integer DEFAULT 0,
  starts_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 7. SITE SETTINGS
-- ============================================================
CREATE TABLE site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name text DEFAULT 'RENAISSANCE',
  site_url text DEFAULT '',
  currency text DEFAULT 'ZAR',
  currency_symbol text DEFAULT 'R',
  timezone text DEFAULT 'Africa/Johannesburg',
  email text DEFAULT '',
  phone text,
  address jsonb,
  seo_title text DEFAULT '',
  seo_description text DEFAULT '',
  seo_keywords text[] DEFAULT '{}',
  og_image text,
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 8. INDEXES for performance
-- ============================================================
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_discounts_code ON discounts(code);
CREATE INDEX idx_discounts_active ON discounts(active);
CREATE INDEX idx_collections_slug ON collections(slug);

-- ============================================================
-- 9. AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_collections_updated_at BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 10. STORAGE BUCKET for product images
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view product images (public bucket)
CREATE POLICY "product-images-public-read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow anyone to upload product images
CREATE POLICY "product-images-upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

-- Allow anyone to update product images (replace)
CREATE POLICY "product-images-update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images');

-- Allow anyone to delete product images
CREATE POLICY "product-images-delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');

-- ============================================================
-- 11. ROW LEVEL SECURITY (RLS) on tables
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Public read policies (site visitors can see published data)
CREATE POLICY "products_public_read" ON products FOR SELECT USING (status = 'published');
CREATE POLICY "collections_public_read" ON collections FOR SELECT USING (status = 'active');
CREATE POLICY "site_settings_public_read" ON site_settings FOR SELECT USING (true);

-- Admin full access policies (for development - authenticated + anon can CRUD)
-- In production, you'd restrict these to authenticated admin users only.

-- Products admin access
CREATE POLICY "products_admin_select" ON products FOR SELECT USING (true);
CREATE POLICY "products_admin_insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_admin_update" ON products FOR UPDATE USING (true);
CREATE POLICY "products_admin_delete" ON products FOR DELETE USING (true);

-- Collections admin access
CREATE POLICY "collections_admin_select" ON collections FOR SELECT USING (true);
CREATE POLICY "collections_admin_insert" ON collections FOR INSERT WITH CHECK (true);
CREATE POLICY "collections_admin_update" ON collections FOR UPDATE USING (true);
CREATE POLICY "collections_admin_delete" ON collections FOR DELETE USING (true);

-- Orders admin access
CREATE POLICY "orders_admin_select" ON orders FOR SELECT USING (true);
CREATE POLICY "orders_admin_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_admin_update" ON orders FOR UPDATE USING (true);
CREATE POLICY "orders_admin_delete" ON orders FOR DELETE USING (true);

-- Customers admin access
CREATE POLICY "customers_admin_select" ON customers FOR SELECT USING (true);
CREATE POLICY "customers_admin_insert" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "customers_admin_update" ON customers FOR UPDATE USING (true);
CREATE POLICY "customers_admin_delete" ON customers FOR DELETE USING (true);

-- Discounts admin access
CREATE POLICY "discounts_admin_select" ON discounts FOR SELECT USING (true);
CREATE POLICY "discounts_admin_insert" ON discounts FOR INSERT WITH CHECK (true);
CREATE POLICY "discounts_admin_update" ON discounts FOR UPDATE USING (true);
CREATE POLICY "discounts_admin_delete" ON discounts FOR DELETE USING (true);

-- Site settings admin access
CREATE POLICY "settings_admin_select" ON site_settings FOR SELECT USING (true);
CREATE POLICY "settings_admin_insert" ON site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "settings_admin_update" ON site_settings FOR UPDATE USING (true);
CREATE POLICY "settings_admin_delete" ON site_settings FOR DELETE USING (true);

-- Product variants admin access
CREATE POLICY "variants_admin_select" ON product_variants FOR SELECT USING (true);
CREATE POLICY "variants_admin_insert" ON product_variants FOR INSERT WITH CHECK (true);
CREATE POLICY "variants_admin_update" ON product_variants FOR UPDATE USING (true);
CREATE POLICY "variants_admin_delete" ON product_variants FOR DELETE USING (true);

-- ============================================================
-- 12. SEED DATA
-- ============================================================

-- Collections
INSERT INTO collections (name, slug, description, banner_image, featured, status) VALUES
('Cyber Atelier', 'cyber-atelier', 'Chrome and metallic pieces engineered for the future. Our flagship collection featuring cutting-edge materials and futuristic silhouettes.', NULL, true, 'active'),
('Mirror Drop', 'mirror-drop', 'Iridescent and holographic pieces that reflect your unique style. Limited edition drops that sell out fast.', NULL, true, 'active'),
('Y2K Essentials', 'y2k-essentials', 'Classic Y2K fashion staples that never go out of style. Timeless pieces for the modern wardrobe.', NULL, false, 'active'),
('Limited Drops', 'limited-drops', 'Exclusive limited edition pieces. Once they''re gone, they''re gone forever.', NULL, true, 'active');

-- Products
INSERT INTO products (name, slug, description, short_description, price, sale_price, sku, stock_quantity, category, collection, tags, status, images, thumbnail) VALUES
('Chrome Shell Puffer', 'chrome-shell-puffer', 'A futuristic puffer jacket with reflective chrome shell technology. Features water-resistant exterior and lightweight insulation for ultimate comfort.', 'Futuristic chrome puffer with reflective shell', 680.00, NULL, 'CSP-001', 45, 'Outerwear', 'Cyber Atelier', ARRAY['new', 'chrome', 'puffer'], 'published', ARRAY['/product-jacket.png'], '/product-jacket.png'),
('Hyperline Cargo Pant', 'hyperline-cargo-pant', 'Technical cargo pants with hyperline stitching and multiple utility pockets.', 'Technical cargo pants with utility details', 320.00, 240.00, 'HCP-002', 23, 'Bottoms', 'Cyber Atelier', ARRAY['sale', 'cargo', 'technical'], 'published', ARRAY['/product-pants.png'], '/product-pants.png'),
('Holo Crop Tee', 'holo-crop-tee', 'Iridescent holographic crop top that shifts colors with movement.', 'Iridescent holographic crop top', 180.00, NULL, 'HCT-003', 67, 'Tops', 'Mirror Drop', ARRAY['holographic', 'crop', 'trending'], 'published', ARRAY['/product-top.png'], '/product-top.png'),
('Liquid Chrome Mini Bag', 'liquid-chrome-mini-bag', 'Statement mini bag with liquid chrome finish. Compact size with enough room for essentials.', 'Compact chrome statement bag', 420.00, NULL, 'LCMB-004', 0, 'Accessories', 'Mirror Drop', ARRAY['limited', 'bag', 'chrome'], 'published', ARRAY['/product-bag.png'], '/product-bag.png'),
('Metallic Oversized Blazer', 'metallic-oversized-blazer', 'Statement blazer with metallic finish and oversized silhouette.', 'Metallic oversized blazer', 450.00, NULL, 'MOB-005', 12, 'Outerwear', 'Cyber Atelier', ARRAY['blazer', 'metallic', 'statement'], 'published', ARRAY['/product-jacket.png'], '/product-jacket.png'),
('Sequin Midi Dress', 'sequin-midi-dress', 'Dazzling sequin midi dress perfect for special occasions.', 'Dazzling sequin midi dress', 550.00, 425.00, 'SMD-006', 8, 'Dresses', 'Y2K Essentials', ARRAY['dress', 'sequin', 'party'], 'published', ARRAY['/product-top.png'], '/product-top.png'),
('Y2K Cropped Denim Jacket', 'y2k-cropped-denim-jacket', 'Classic Y2K inspired cropped denim jacket with distressed details.', 'Classic Y2K cropped denim', 280.00, NULL, 'YCDJ-007', 3, 'Outerwear', 'Y2K Essentials', ARRAY['denim', 'y2k', 'classic'], 'published', ARRAY['/product-jacket.png'], '/product-jacket.png'),
('Mesh Overlay Top', 'mesh-overlay-top', 'Translucent mesh top perfect for layering.', 'Translucent mesh layering top', 120.00, NULL, 'MOT-008', 34, 'Tops', 'Cyber Atelier', ARRAY['mesh', 'layering', 'transparent'], 'draft', ARRAY['/product-top.png'], '/product-top.png');

-- Customers
INSERT INTO customers (email, first_name, last_name, phone, orders_count, total_spent, default_address) VALUES
('emma@example.com', 'Emma', 'Watson', '+27 82 123 4567', 12, 8450.00, '{"line1": "123 Main Street", "line2": "Sandton", "city": "Johannesburg", "state": "Gauteng", "postalCode": "2196", "country": "South Africa"}'),
('john@example.com', 'John', 'Smith', '+27 83 234 5678', 5, 2340.00, '{"line1": "45 Ocean Drive", "city": "Cape Town", "state": "Western Cape", "postalCode": "8001", "country": "South Africa"}'),
('sarah@example.com', 'Sarah', 'Johnson', '+27 84 345 6789', 8, 4560.00, '{"line1": "78 Garden Road", "line2": "Rosebank", "city": "Johannesburg", "state": "Gauteng", "postalCode": "2192", "country": "South Africa"}');

-- Orders
INSERT INTO orders (order_number, customer_email, customer_name, items, subtotal, tax, shipping, discount, total, status, shipping_address, billing_address) VALUES
('ORD-10293', 'emma@example.com', 'Emma Watson',
  '[{"productId":"p1","productName":"Chrome Shell Puffer","variantId":null,"variantName":"M / Silver","quantity":1,"price":680,"salePrice":null,"image":"/product-jacket.png"}]',
  680.00, 68.00, 0, 0, 748.00, 'completed',
  '{"line1":"123 Main Street","line2":"Sandton","city":"Johannesburg","state":"Gauteng","postalCode":"2196","country":"South Africa"}',
  '{"line1":"123 Main Street","line2":"Sandton","city":"Johannesburg","state":"Gauteng","postalCode":"2196","country":"South Africa"}'),
('ORD-10292', 'john@example.com', 'John Smith',
  '[{"productId":"p2","productName":"Hyperline Cargo Pant","variantId":null,"variantName":"L / White","quantity":1,"price":240,"salePrice":240,"image":"/product-pants.png"},{"productId":"p3","productName":"Holo Crop Tee","variantId":null,"variantName":"M / Iridescent","quantity":1,"price":180,"salePrice":null,"image":"/product-top.png"}]',
  420.00, 42.00, 0, 0, 462.00, 'processing',
  '{"line1":"45 Ocean Drive","city":"Cape Town","state":"Western Cape","postalCode":"8001","country":"South Africa"}',
  '{"line1":"45 Ocean Drive","city":"Cape Town","state":"Western Cape","postalCode":"8001","country":"South Africa"}'),
('ORD-10291', 'sarah@example.com', 'Sarah Johnson',
  '[{"productId":"p6","productName":"Sequin Midi Dress","variantId":null,"variantName":"S / Silver","quantity":1,"price":425,"salePrice":425,"image":"/product-top.png"}]',
  425.00, 42.50, 0, 0, 467.50, 'shipped',
  '{"line1":"78 Garden Road","line2":"Rosebank","city":"Johannesburg","state":"Gauteng","postalCode":"2192","country":"South Africa"}',
  '{"line1":"78 Garden Road","line2":"Rosebank","city":"Johannesburg","state":"Gauteng","postalCode":"2192","country":"South Africa"}'),
('ORD-10290', 'emma@example.com', 'Emma Watson',
  '[{"productId":"p5","productName":"Metallic Oversized Blazer","variantId":null,"variantName":"M / Silver","quantity":1,"price":450,"salePrice":null,"image":"/product-jacket.png"}]',
  450.00, 45.00, 0, 0, 495.00, 'pending',
  '{"line1":"123 Main Street","line2":"Sandton","city":"Johannesburg","state":"Gauteng","postalCode":"2196","country":"South Africa"}',
  '{"line1":"123 Main Street","line2":"Sandton","city":"Johannesburg","state":"Gauteng","postalCode":"2196","country":"South Africa"}');

-- Discounts
INSERT INTO discounts (code, description, type, value, min_order_amount, max_uses, used_count, active) VALUES
('WELCOME15', '15% off your first order', 'percentage', 15, 500, 1000, 234, true),
('SUMMER50', 'R50 off orders over R500', 'fixed', 50, 500, 500, 156, true),
('VIP25', '25% off for VIP customers', 'percentage', 25, 1000, 50, 12, true);

-- Site Settings
INSERT INTO site_settings (site_name, site_url, currency, currency_symbol, timezone, email, phone, address, seo_title, seo_description, seo_keywords) VALUES
('RENAISSANCE', 'rncszn.co.za', 'ZAR', 'R', 'Africa/Johannesburg', 'hello@renaissance.co.za', '+27 10 123 4567',
  '{"line1":"90 Rivonia Road","line2":"Sandton","city":"Johannesburg","state":"Gauteng","postalCode":"2196","country":"South Africa"}',
  'RENAISSANCE — The Future of Y2K Fashion',
  'RENAISSANCE is a premium Y2K luxury fashion house.',
  ARRAY['y2k fashion', 'chrome clothing', 'holographic fashion', 'luxury fashion', 'south african fashion']);

-- ============================================================
-- DONE! Your RENAISSANCE store database is ready.
-- ============================================================
