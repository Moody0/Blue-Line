-- ==============================================================================
-- Blue Line (بلو لاين) — Permissions & Row Level Security (RLS) Policies
-- ==============================================================================

-- ── 0. Schema & Table Grants for Supabase PostgREST Roles ─────────────────────
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- Enable Row Level Security on all application tables
ALTER TABLE categories          ENABLE ROW LEVEL SECURITY;
ALTER TABLE products            ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants    ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders              ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items         ENABLE ROW LEVEL SECURITY;

-- ── 1. Categories Policies ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT
  USING (true);

-- ── 2. Products Policies ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow public read access to active products" ON products;
CREATE POLICY "Allow public read access to active products"
  ON products FOR SELECT
  USING (is_active = true);

-- ── 3. Product Variants Policies ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow public read access to product variants" ON product_variants;
CREATE POLICY "Allow public read access to product variants"
  ON product_variants FOR SELECT
  USING (true);

-- ── 4. Customer Profile Policies ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view their own profile" ON customers;
CREATE POLICY "Users can view their own profile"
  ON customers FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON customers;
CREATE POLICY "Users can update their own profile"
  ON customers FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON customers;
CREATE POLICY "Users can insert their own profile"
  ON customers FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ── 5. Cart Items Policies ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
CREATE POLICY "Users can view their own cart items"
  ON cart_items FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR (auth.uid() IS NULL AND session_id = current_setting('request.headers', true)::json->>'x-session-id')
    OR true
  );

DROP POLICY IF EXISTS "Users can insert their own cart items" ON cart_items;
CREATE POLICY "Users can insert their own cart items"
  ON cart_items FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
CREATE POLICY "Users can update their own cart items"
  ON cart_items FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;
CREATE POLICY "Users can delete their own cart items"
  ON cart_items FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- ── 6. Orders Policies ───────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Customers can view their own orders" ON orders;
CREATE POLICY "Customers can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Customers can insert their own orders" ON orders;
CREATE POLICY "Customers can insert their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- ── 7. Order Items Policies ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "Customers can view their own order items" ON order_items;
CREATE POLICY "Customers can view their own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.customer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Customers can insert their own order items" ON order_items;
CREATE POLICY "Customers can insert their own order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.customer_id = auth.uid()
    )
  );
