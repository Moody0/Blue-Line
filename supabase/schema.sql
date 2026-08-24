-- ==============================================================================
-- Blue Line (بلو لاين) — PostgreSQL Database Schema
-- Specializing in Luxury Sanitary Ware & Architectural Plumbing Solutions
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. Categories Table ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en     TEXT NOT NULL,
  name_ar     TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  image_url   TEXT,
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

-- ── 2. Products Table ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en              TEXT NOT NULL,
  title_ar              TEXT NOT NULL,
  slug                  TEXT UNIQUE NOT NULL,
  sku                   TEXT UNIQUE NOT NULL,
  description_en        TEXT DEFAULT '',
  description_ar        TEXT DEFAULT '',
  base_price            NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  discount_price        NUMERIC(10, 2) CHECK (discount_price IS NULL OR (discount_price >= 0 AND discount_price < base_price)),
  category_id           UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_concealed          BOOLEAN DEFAULT false,
  warranty_years        INT DEFAULT 5 CHECK (warranty_years >= 0),
  technical_drawing_url TEXT,
  is_featured           BOOLEAN DEFAULT false,
  is_active             BOOLEAN DEFAULT true,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;

-- ── 3. Product Variants (Finishes & Colors) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS product_variants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  finish_name     TEXT NOT NULL,
  finish_code     TEXT NOT NULL,
  hex_color       TEXT NOT NULL DEFAULT '#D4D4D8',
  image_urls      TEXT[] DEFAULT '{}',
  stock_quantity  INT DEFAULT 0 CHECK (stock_quantity >= 0),
  price_override  NUMERIC(10, 2) CHECK (price_override IS NULL OR price_override >= 0),
  is_default      BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);

-- ── 4. Customers Table (Profile linked to auth.users) ────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email          TEXT UNIQUE NOT NULL,
  full_name      TEXT UNIQUE NOT NULL,
  phone          TEXT UNIQUE,
  address_line_1 TEXT,
  address_line_2 TEXT,
  city           TEXT,
  governorate    TEXT,
  postal_code    TEXT,
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_email ON customers(lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_full_name ON customers(lower(full_name));
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone) WHERE phone IS NOT NULL;

-- ── 5. Cart Items Table (Supports guest session and authenticated user) ──────
CREATE TABLE IF NOT EXISTS cart_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id  TEXT NOT NULL,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id  UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity    INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session ON cart_items(session_id);

-- ── 6. Orders Table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id      UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_number     TEXT UNIQUE NOT NULL,
  status           TEXT NOT NULL DEFAULT 'confirmed'
                     CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal         NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  shipping_cost    NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  total            NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  shipping_address TEXT NOT NULL,
  payment_method   TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'instapay')),
  guest_name       TEXT,
  guest_phone      TEXT,
  guest_email      TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

-- ── 7. Order Items Table ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES products(id),
  variant_id    UUID NOT NULL REFERENCES product_variants(id),
  quantity      INT NOT NULL CHECK (quantity > 0),
  unit_price    NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  total_price   NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
  product_title TEXT NOT NULL,
  variant_name  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ── 8. Triggers & Automation Functions ───────────────────────────────────────

-- Trigger for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_orders_updated_at ON orders;
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for generating unique Blue Line order numbers (BL-YYYYMMDD-XXXX)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number = 'BL-' || to_char(now(), 'YYYYMMDD') || '-' || 
                       lpad(floor(random() * 10000)::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();
