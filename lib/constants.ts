export const BRAND = {
  name: "Blue Line",
  nameAr: "بلو لاين",
  tagline: "Plumbing Fixtures & Sanitary Ware",
  taglineAr: "لأدوات السباكة",
  description:
    "Premium German-engineered bathroom solutions: faucets, concealed shower mixers, smart controls, basins & bathtubs.",
  descriptionAr:
    "حلول حمامات متطورة بهندسة ألمانية فائقة: خلاطات مياه، أنظمة دش مخفية، أنظمة تحكم ذكية، أحواض وبانيوهات.",
} as const;

export const CONTACT = {
  phone: "01203007686",
  phoneInternational: "+201203007686",
  phoneDisplay: "0120 300 7686",
  whatsappUrl: "https://wa.me/201203007686",
  facebookUrl: "https://www.facebook.com/profile.php?id=100068015732976",
} as const;

export const CURRENCY = {
  code: "EGP",
  symbol: "ج.م",
  symbolEn: "EGP",
  locale: "ar-EG",
  decimals: 0,
} as const;

export const FINISHES = [
  { name: "Chrome", nameAr: "كروم لامع", code: "CHR", hex: "#D4D4D8" },
  { name: "Matte Black", nameAr: "أسود مطفي", code: "MBK", hex: "#18181B" },
  { name: "Brushed Hard Graphite", nameAr: "جرافيت مصقول", code: "BHG", hex: "#3F3F46" },
  { name: "Warm Sunset", nameAr: "غروب دافئ", code: "WST", hex: "#B45309" },
  { name: "Brushed Nickel", nameAr: "نيكل مصقول", code: "BNK", hex: "#71717A" },
  { name: "Polished Gold", nameAr: "ذهبي لامع", code: "PGD", hex: "#EAB308" },
  { name: "Glossy White", nameAr: "أبيض لامع", code: "GWH", hex: "#FAFAFA" },
  { name: "Matte White", nameAr: "أبيض مطفي", code: "MWH", hex: "#F4F4F5" },
] as const;

export const FREE_SHIPPING_THRESHOLD = 5000;

export interface GovernorateShipping {
  name: string;
  fee: number;
}

export const EGYPT_GOVERNORATES: GovernorateShipping[] = [
  { name: "القاهرة", fee: 100 },
  { name: "الجيزة", fee: 100 },
  { name: "الإسكندرية", fee: 120 },
  { name: "القليوبية", fee: 100 },
  { name: "الشرقية", fee: 120 },
  { name: "الدقهلية", fee: 120 },
  { name: "البحيرة", fee: 120 },
  { name: "الغربية", fee: 120 },
  { name: "المنوفية", fee: 120 },
  { name: "دمياط", fee: 120 },
  { name: "بورسعيد", fee: 120 },
  { name: "الإسماعيلية", fee: 120 },
  { name: "السويس", fee: 120 },
  { name: "كفر الشيخ", fee: 120 },
  { name: "الفيوم", fee: 140 },
  { name: "بني سويف", fee: 140 },
  { name: "المنيا", fee: 150 },
  { name: "أسيوط", fee: 150 },
  { name: "سوهاج", fee: 150 },
  { name: "قنا", fee: 150 },
  { name: "الأقصر", fee: 150 },
  { name: "أسوان", fee: 150 },
  { name: "البحر الأحمر", fee: 180 },
  { name: "جنوب سيناء", fee: 180 },
  { name: "شمال سيناء", fee: 180 },
  { name: "مطروح", fee: 180 },
  { name: "الوادي الجديد", fee: 180 },
];

export const NAV_CATEGORIES = [
  { nameAr: "خلاطات أحواض", nameEn: "Basin Mixers", slug: "mixers-basins" },
  { nameAr: "شاور وأنظمة دش", nameEn: "Shower Systems", slug: "shower-bury" },
  { nameAr: "خلاطات بانيو", nameEn: "Bathtub Mixers", slug: "bathtub-mixers" },
  { nameAr: "خلاطات مطابخ", nameEn: "Kitchen Mixers", slug: "mixers-kitchens" },
  { nameAr: "أجسام وخزانات دفن", nameEn: "Concealed Bodies", slug: "burial-objects" },
  { nameAr: "إكسسوارات حمام", nameEn: "Bathroom Accessories", slug: "bathroom-accessories" },
] as const;

