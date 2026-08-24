-- ==============================================================================
-- Blue Line — Migration: Coupons & Dynamic Site Settings Schema
-- ==============================================================================

-- 1. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                TEXT UNIQUE NOT NULL,
  discount_type       TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value      NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  min_order_value     NUMERIC(10, 2) DEFAULT 0 CHECK (min_order_value >= 0),
  max_discount_amount NUMERIC(10, 2),
  usage_limit         INT,
  used_count          INT DEFAULT 0 CHECK (used_count >= 0),
  expires_at          TIMESTAMPTZ,
  is_active           BOOLEAN DEFAULT true,
  created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active) WHERE is_active = true;

-- 2. Site Settings Table (Key-Value JSONB store for dynamic CMS)
CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Coupons RLS: Public can read active coupons to validate at checkout; Service Role/Admins full access
CREATE POLICY "Public read active coupons" ON coupons
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin manage coupons" ON coupons
  FOR ALL USING (true);

-- Site Settings RLS: Public can read all settings; Service Role/Admins full access
CREATE POLICY "Public read site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin manage site settings" ON site_settings
  FOR ALL USING (true);
