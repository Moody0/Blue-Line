import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  console.log("Setting up Supabase tables: coupons & site_settings...");

  // 1. Create coupons table if not exists
  const createCouponsSQL = `
    CREATE TABLE IF NOT EXISTS coupons (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT NOT NULL,
      discount_value NUMERIC(10, 2) NOT NULL,
      min_order_value NUMERIC(10, 2) DEFAULT 0,
      max_discount_amount NUMERIC(10, 2),
      usage_limit INT,
      used_count INT DEFAULT 0,
      expires_at TIMESTAMPTZ,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `;

  // 2. Create site_settings table if not exists
  const createSettingsSQL = `
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  `;

  // Execute using direct RPC or postgres client or through table checks
  // Let's test if we can query/insert or execute SQL via postgres connection
  console.log("Checking tables...");

  // Seed default site settings
  const defaultSettings = [
    {
      key: "announcement_bar",
      value: {
        text: "شحن وتوصيل فوري لكافة محافظات جمهورية مصر العربية | ضمان معتمد حتى ٥ سنوات",
        is_active: true,
        badge_text: "عروض الموسم",
        link_url: "/category/mixers-basins",
        free_shipping_threshold: 5000,
      },
    },
    {
      key: "hero_slides",
      value: [
        {
          id: 1,
          tagline: "هندسة ألمانية فائقة • جودة متكاملة",
          title: "حمامات عصرية متكاملة بتصميم وتجهيزات ألمانية فاخرة",
          ctaText: "تسوق الآن",
          ctaHref: "/category/mixers-basins",
          imageSrc: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=2000&q=85",
        },
        {
          id: 2,
          tagline: "أنظمة الدش والشاور الفندقية",
          title: "أنظمة دش مطري مخفية بتصميم فندقي وأداء فائق",
          ctaText: "تسوق الآن",
          ctaHref: "/category/shower-bury",
          imageSrc: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=2000&q=85",
        },
        {
          id: 3,
          tagline: "خلاطات مياه فاخرة بتقنية PVD",
          title: "خلاطات مياه معمارية لحمام عصري متميز",
          ctaText: "تسوق الآن",
          ctaHref: "/category/bathtub-mixers",
          imageSrc: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=85",
        },
      ],
    },
    {
      key: "service_pillars",
      value: [
        {
          id: "engineering",
          titleAr: "تركيب واستشارات هندسية",
          descriptionAr: "دعم فني ومخططات سباكة دقيقة لكافة المشاريع والفيلات الخاصة.",
          iconName: "Droplets",
        },
        {
          id: "warranty",
          titleAr: "ضمان شامل معتمد",
          descriptionAr: "ضمان حقيقي يصل إلى ٢٠ عاماً ضد عيوب الصناعة وتغير الألوان.",
          iconName: "Bath",
        },
        {
          id: "parts",
          titleAr: "قطع غيار ومستلزمات أصلية",
          descriptionAr: "نوفر جميع القلوب والمحابس وقطع الغيار الأصلية المطابقة للمواصفات القياسية.",
          iconName: "Wrench",
        },
        {
          id: "shipping",
          titleAr: "شحن سريع وآمن",
          descriptionAr: "توصيل لكافة محافظات مصر مع إمكانية الفحص والمعاينة عند الاستلام.",
          iconName: "Truck",
        },
      ],
    },
    {
      key: "warranty_content",
      value: {
        titleAr: "الضمان وخدمات ما بعد البيع",
        subtitleAr: "كافة خلاطات المياه والأدوات الصحية ومستلزمات السباكة المعتمدة لدى بلو لاين أصلية ومشمولة بضمان رسمي معتمد ضد عيوب الصناعة والتسريب.",
        durationAr: "من سنتين وحتى ٥ سنوات ضمان معتمد",
        sections: [
          {
            title: "١. مدة وتغطية الضمان",
            content: "تختلف فترة الضمان بحسب نوع المنتج والشركة المصنعة:\n• خلاطات المياه وأنظمة الدش: ضمان رسمي معتمد من سنتين وحتى ٥ سنوات يشمل القلوب السيراميكية وجودة الطلاء الداخلي والخارجي.\n• أجسام وخزانات الدفن: ضمان ضد تسريب الهيكل الداخلي ومحابس التغذية.\n• المحابس ولوازم السباكة: ضمان سلامة الخامات النحاسية وتحمل الضغط العالي ومقاومة الصدأ.",
          },
          {
            title: "٢. شروط سريان الضمان",
            content: "• وجود فاتورة الشراء أو رقم الطلب المسجل على الموقع.\n• أن يتم التركيب وفق الأصول الفنية للسباكة وبواسطة فني متخصص.\n• عدم استخدام منظفات حمضية كاوية (مثل ماء النار، الفلاش، أو الأحماض المركزة) على الأسطح المطلية والكروم لتجنب تلف طبقة الحماية.",
          },
          {
            title: "٣. كيفية تقديم طلب الضمان أو الصيانة",
            content: "تواصل مع فريق الدعم الفني عبر الواتساب أو الهاتف مع إرفاق صورة الفاتورة وتصوير المشكلة بالفيديو، وسيتم توجيه فني معتمد للمعاينة أو استبدال القطعة المعيبة.",
          },
        ],
      },
    },
    {
      key: "policies_content",
      value: {
        returns: {
          title: "سياسة الاستبدال والاسترجاع",
          subtitle: "مرونة كاملة وحماية لحقوق المشتري وفق معايير جهاز حماية المستهلك المصري",
          content: "• يحق للعميل استبدال أو استرجاع المنتجات خلال ١٤ يوماً من تاريخ الاستلام.\n• يجب أن يكون المنتج بحالته الأصلية غير مستخدم ومرفقاً بالكرتونة الأصلية وكافة الإكسسوارات والمخططات المرفقة.\n• يتم استرداد المبلغ بنفس طريقة الدفع الأصلية خلال ٣ إلى ٥ أيام عمل بعد فحص المرتجع بالمخزن.",
        },
        shipping: {
          title: "سياسة الشحن والتوصيل",
          subtitle: "توصيل سريع وآمن لجميع المحافظات مع شحن مجاني للطلبات الكبيرة",
          content: "• التوصيل لمحافظات القاهرة والجيزة والإسكندرية خلال ٢٤ إلى ٤8 ساعة عمل.\n• باقي محافظات الوجه البحري والقبلي خلال ٢ إلى ٤ أيام عمل.\n• الشحن مجاني لكافة الطلبات التي تتجاوز قيمتها ٥,٠٠٠ جنيه مصري.\n• إمكانية فتح الشحنة ومعاينتها بالكامل قبل سداد المبلغ لمندوب التوصيل.",
        },
        privacy: {
          title: "سياسة الخصوصية وأمان البيانات",
          subtitle: "التزام كامل بحماية وتشفير بياناتك الشخصية",
          content: "• نجمع فقط البيانات الضرورية لتنفيذ وتوصيل الطلبيات (الاسم، رقم الهاتف، العنوان، والبريد الإلكتروني).\n• لا يتم مشاركة أو بيع بياناتك لأي جهة خارجية عدا شركات الشحن الرسمية لإتمام التوصيل.\n• كافة المعاملات المالية ومعلومات الدفع مشفرة بأعلى بروتوكولات الأمان SSL.",
        },
        terms: {
          title: "الشروط والأحكام",
          subtitle: "القواعد المنظمة لاستخدام متجر بلو لاين وإتمام عمليات الشراء",
          content: "• جميع الأسعار المعروضة بالجنيه المصري وشاملة لضريبة القيمة المضافة.\n• يحتفظ المتجر بحق مراجعة أي طلب والتأكد من توافر المخزون قبل التأكيد النهائي.\n• في حال وجود خطأ غير مقصود في تسعير منتج، يتم التواصل مع العميل لتصحيح السعر أو إلغاء الطلب واسترداد أي مبالغ مدفوعة.",
        },
      },
    },
    {
      key: "store_contact",
      value: {
        phone: "01000000000",
        phoneDisplay: "+20 100 000 0000",
        whatsapp: "201000000000",
        email: "support@blueline-eg.com",
        address: "القاهرة الجديدة، التجمع الخامس، جمهورية مصر العربية",
        workingHours: "السبت - الخميس: ٩:٠٠ ص - ٩:٠٠ م",
      },
    },
  ];

  // Seed default coupons
  const defaultCoupons = [
    {
      code: "WELCOME10",
      discount_type: "percentage",
      discount_value: 10,
      min_order_value: 1000,
      max_discount_amount: 1500,
      usage_limit: 500,
      used_count: 34,
      expires_at: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString(),
      is_active: true,
    },
    {
      code: "GROHE500",
      discount_type: "fixed",
      discount_value: 500,
      min_order_value: 4000,
      max_discount_amount: null,
      usage_limit: 200,
      used_count: 18,
      expires_at: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
      is_active: true,
    },
    {
      code: "LUXURY15",
      discount_type: "percentage",
      discount_value: 15,
      min_order_value: 10000,
      max_discount_amount: 3000,
      usage_limit: 100,
      used_count: 8,
      expires_at: new Date(Date.now() + 45 * 24 * 3600 * 1000).toISOString(),
      is_active: true,
    },
  ];

  console.log("Seeding site_settings into Supabase...");
  for (const s of defaultSettings) {
    const { error } = await supabase
      .from("site_settings")
      .upsert(s, { onConflict: "key" });
    if (error) {
      console.log(`Setting ${s.key} upsert error:`, error.message);
    } else {
      console.log(`✓ Setting '${s.key}' seeded successfully!`);
    }
  }

  console.log("Seeding coupons into Supabase...");
  for (const c of defaultCoupons) {
    const { error } = await supabase
      .from("coupons")
      .upsert(c, { onConflict: "code" });
    if (error) {
      console.log(`Coupon ${c.code} upsert error:`, error.message);
    } else {
      console.log(`✓ Coupon '${c.code}' seeded successfully!`);
    }
  }

  console.log("Phase 1 database migration & seed completed!");
}

run();
