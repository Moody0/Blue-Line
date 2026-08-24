-- ==============================================================================
-- Blue Line (بلو لاين) — Seed Data: Premium Sanitary Ware & Fixtures
-- ==============================================================================

-- ── 1. Categories ─────────────────────────────────────────────────────────────
INSERT INTO categories (id, name_en, name_ar, slug, sort_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Faucets & Mixers', 'حنفيات وخلاطات مياه', 'faucets', 1),
  ('a1000000-0000-0000-0000-000000000002', 'Concealed Shower Systems', 'أنظمة دش مخفية', 'shower-mixers', 2),
  ('a1000000-0000-0000-0000-000000000003', 'Countertop Basins', 'أحواض كاونتر فاخرة', 'basins', 3),
  ('a1000000-0000-0000-0000-000000000004', 'Freestanding Bathtubs', 'بانيوهات قائمة بذاتها', 'bathtubs', 4),
  ('a1000000-0000-0000-0000-000000000005', 'Smart Digital Controls', 'أنظمة تحكم ذكية وحساسات', 'smart-controls', 5)
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  slug = EXCLUDED.slug,
  sort_order = EXCLUDED.sort_order;

-- ── 2. Products ───────────────────────────────────────────────────────────────
INSERT INTO products (id, title_en, title_ar, slug, sku, description_en, description_ar, base_price, discount_price, category_id, is_concealed, warranty_years, is_featured, is_active) VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'Aegean Single-Lever Architectural Basin Mixer',
    'خلاط حوض أيجين أحادي الذراع بتصميم معماري',
    'aegean-single-lever-basin-mixer',
    'BL-FAU-101',
    'Precision-engineered single-lever mixer with German ceramic disc cartridge and laminar water flow. PVD surface coating prevents tarnishing and corrosion.',
    'خلاط مياه أحادي الذراع بتقنية قلب سيراميكي ألماني فائق الدقة وتدفق مياه هادئ ومنتظم. طلاء سطحي بتقنية PVD لحماية فائقة من التكلس والخدوش.',
    5200.00,
    4680.00,
    'a1000000-0000-0000-0000-000000000001',
    false,
    10,
    true,
    true
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'Nero Concealed Thermostatic Rain Shower System 300mm',
    'نظام دش مطري مخفي ثرموستاتي نيرو ٣٠٠ مم',
    'nero-concealed-thermostatic-shower',
    'BL-SHW-201',
    'Minimalist concealed thermostatic valve with integrated 3-way push-button diverter, 300mm ultra-slim stainless steel rain head, and magnetic baton hand shower.',
    'نظام دش ثرموستاتي مخفي بجدار الحمام مع صمام تحكم بالضغط، ورأس دش مطري ٣٠٠ مم فائق النحافة مصنوع من الستانلس ستيل، مع سماعة يدوية مغناطيسية.',
    16800.00,
    14900.00,
    'a1000000-0000-0000-0000-000000000002',
    true,
    12,
    true,
    true
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'Elara Architectural Countertop Basin 60cm',
    'حوض كاونتر معماري إيلارا ٦٠ سم',
    'elara-architectural-countertop-basin',
    'BL-BAS-301',
    'Thin-rim fine fireclay countertop basin with hydrophobic hygiene glaze. Resistant to scratches, stains, and thermal shock.',
    'حوض كاونتر بحواف فائقة النحافة مصنوع من الفخار الناري الفاخر مع طبقة حماية مقاومة للبكتيريا والترسبات الكلسية والتغيرات الحرارية.',
    7400.00,
    6600.00,
    'a1000000-0000-0000-0000-000000000003',
    false,
    15,
    true,
    true
  ),
  (
    'b1000000-0000-0000-0000-000000000004',
    'Luxor Freestanding Mineral-Cast Bathtub 170cm',
    'بانيو لوكسور قائم بذاته من الرخام الصناعي المصبوب ١٧٠ سم',
    'luxor-freestanding-bathtub',
    'BL-BTB-401',
    'Sculptural monolithic bathtub crafted from solid mineral-composite. Superior heat retention with smooth velvety touch and integrated concealed overflow.',
    'بانيو منحوت قائم بذاته مصنوع من مركب المعادن والرخام الصلب الصافي. احتفاظ فائق بدرجة حرارة المياه مع ملمس مخملي ناعم ونظام تصريف مخفي مدمج.',
    38500.00,
    NULL,
    'a1000000-0000-0000-0000-000000000004',
    false,
    20,
    true,
    true
  ),
  (
    'b1000000-0000-0000-0000-000000000005',
    'Aura Touchless Smart Electronic Basin Tap',
    'خلاط حوض ذكي إلكتروني أورا بدون لمس',
    'aura-smart-electronic-basin-tap',
    'BL-SMT-501',
    'Infrared precision dual-sensor electronic tap with adjustable temperature limiter, Bluetooth configuration, and solar-assist battery system.',
    'خلاط إلكتروني ذكي يعمل بمستشعر الأشعة تحت الحمراء عالي الحساسية بدون لمس، مع إمكانية ضبط درجة الحرارة والتوصيل عبر البلوتوث وبطارية مدعومة بالطاقة الضوئية.',
    9800.00,
    8900.00,
    'a1000000-0000-0000-0000-000000000005',
    false,
    7,
    true,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ar = EXCLUDED.title_ar,
  slug = EXCLUDED.slug,
  sku = EXCLUDED.sku,
  description_en = EXCLUDED.description_en,
  description_ar = EXCLUDED.description_ar,
  base_price = EXCLUDED.base_price,
  discount_price = EXCLUDED.discount_price,
  category_id = EXCLUDED.category_id,
  is_concealed = EXCLUDED.is_concealed,
  warranty_years = EXCLUDED.warranty_years,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active;

-- ── 3. Product Variants (Luxury Finishes) ─────────────────────────────────────
INSERT INTO product_variants (id, product_id, finish_name, finish_code, hex_color, stock_quantity, price_override, is_default) VALUES
  -- Aegean Basin Mixer Finishes
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Chrome', 'CHR', '#D4D4D8', 45, NULL, true),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'Matte Black', 'MBK', '#18181B', 28, 4950.00, false),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'Brushed Hard Graphite', 'BHG', '#3F3F46', 20, 5200.00, false),
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001', 'Warm Sunset', 'WST', '#B45309', 15, 5450.00, false),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001', 'Polished Gold', 'PGD', '#EAB308', 10, 5900.00, false),

  -- Nero Shower System Finishes
  ('c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000002', 'Matte Black', 'MBK', '#18181B', 32, NULL, true),
  ('c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000002', 'Brushed Hard Graphite', 'BHG', '#3F3F46', 18, 15500.00, false),
  ('c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000002', 'Chrome', 'CHR', '#D4D4D8', 25, 14200.00, false),

  -- Elara Basin Finishes
  ('c1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000003', 'Glossy White', 'GWH', '#FAFAFA', 40, NULL, true),
  ('c1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000003', 'Matte White', 'MWH', '#F4F4F5', 22, 6900.00, false),
  ('c1000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000003', 'Matte Black', 'MBK', '#18181B', 14, 7200.00, false),

  -- Luxor Bathtub Finishes
  ('c1000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000004', 'Glossy Alpine White', 'GWH', '#FAFAFA', 8, NULL, true),
  ('c1000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000004', 'Velvet Matte White', 'MWH', '#F4F4F5', 6, 41000.00, false),

  -- Aura Smart Tap Finishes
  ('c1000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000005', 'Chrome', 'CHR', '#D4D4D8', 19, NULL, true),
  ('c1000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000005', 'Matte Black', 'MBK', '#18181B', 12, 9400.00, false)
ON CONFLICT (id) DO UPDATE SET
  finish_name = EXCLUDED.finish_name,
  finish_code = EXCLUDED.finish_code,
  hex_color = EXCLUDED.hex_color,
  stock_quantity = EXCLUDED.stock_quantity,
  price_override = EXCLUDED.price_override,
  is_default = EXCLUDED.is_default;
