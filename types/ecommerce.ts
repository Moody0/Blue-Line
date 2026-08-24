/* ═══════════════════════════════════════════════════════════════
   Blue Line (بلو لاين) — E-Commerce TypeScript Type Definitions
   ═══════════════════════════════════════════════════════════════ */

export interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  finish_name: string;          // e.g. "Chrome", "Matte Black"
  finish_code: string;          // e.g. "CHR", "MBK"
  hex_color: string;            // e.g. "#D4D4D8", "#18181B"
  image_urls: string[];
  stock_quantity: number;
  price_override: number | null;
  is_default: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  title_en: string;
  title_ar: string;
  slug: string;
  sku: string;
  description_en: string;
  description_ar: string;
  base_price: number;
  discount_price: number | null;
  category_id: string | null;
  is_concealed: boolean;        // concealed installation type
  warranty_years: number;
  technical_drawing_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  rating?: number;              // 1 to 5 stars
  brand?: string;               // e.g. "American Standard", "GROHE", "Kohler", "Duravit", "Blue Line"
  material?: string;            // e.g. "Brass", "Bronze", "Nickel", "Stainless Steel"
  product_type?: string;        // e.g. "Water Tap", "Sanitary", "Pipes", "Shower", "Wash Basins"
  in_stock?: boolean;
  created_at: string;
  updated_at: string;
  // Joined relations
  category?: Category;
  variants?: ProductVariant[];
}

export interface CartItem {
  id: string;
  user_id: string | null;
  session_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  created_at: string;
  // Joined relations
  product?: Product;
  variant?: ProductVariant;
}

export interface Customer {
  id: string;                   // matches auth.users.id
  email: string;
  full_name: string;
  phone: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  governorate: string | null;
  postal_code: string | null;
  is_admin?: boolean;
  created_at: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_title: string;
  variant_name: string;
}

export interface Order {
  id: string;
  customer_id: string | null;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  total: number;
  shipping_address: string;
  payment_method?: "cod" | "instapay";
  guest_name?: string | null;
  guest_phone?: string | null;
  guest_email?: string | null;
  notes: string | null;
  coupon_code?: string | null;
  discount_amount?: number | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  items?: OrderItem[];
  customer?: Customer;
}

export interface ProductFilterState {
  categoryId?: string;
  categorySlug?: string;
  finishes?: string[];
  minPrice?: number;
  maxPrice?: number;
  isConcealed?: boolean;
  sortBy?: "featured" | "price_asc" | "price_desc" | "newest";
  searchQuery?: string;
}

/* ═══════════════════════════════════════════════════════════════
   Admin Dashboard & CMS Types
   ═══════════════════════════════════════════════════════════════ */

export interface AdminMetrics {
  totalRevenue: number;
  pendingOrdersCount: number;
  lowStockCount: number;
  activeProductsCount: number;
  totalCustomersCount: number;
  revenueTrend: number; // percentage e.g. +12.5%
  ordersTrend: number;
}

export interface VariantFormData {
  id?: string;
  finish_name: string;
  finish_code: string;
  hex_color: string;
  image_urls: string[];
  stock_quantity: number;
  price_override: number | null;
  is_default: boolean;
}

export interface ProductFormData {
  id?: string;
  title_en: string;
  title_ar: string;
  slug: string;
  sku: string;
  description_en: string;
  description_ar: string;
  base_price: number;
  discount_price: number | null;
  category_id: string | null;
  is_concealed: boolean;
  warranty_years: number;
  technical_drawing_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  variants: VariantFormData[];
}

export interface AdminOrderFilter {
  status?: OrderStatus | "all";
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
}

/* ═══════════════════════════════════════════════════════════════
   Coupons & Promo Codes Types
   ═══════════════════════════════════════════════════════════════ */

export interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_value: number;
  max_discount_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CouponFormData {
  id?: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_value: number;
  max_discount_amount: number | null;
  usage_limit: number | null;
  expires_at: string | null;
  is_active: boolean;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  error?: string;
}

/* ═══════════════════════════════════════════════════════════════
   Dynamic Site CMS & Policy Settings Types
   ═══════════════════════════════════════════════════════════════ */

export interface HeroSlide {
  id: number;
  tagline: string;
  title: string;
  ctaText: string;
  ctaHref: string;
  imageSrc: string;
}

export interface ServicePillar {
  id: string;
  titleAr: string;
  descriptionAr: string;
  iconName: string; // e.g. "Droplets", "Bath", "Wrench", "Truck", "ShieldCheck", "Sparkles"
}

export interface WarrantySection {
  title: string;
  content: string;
}

export interface WarrantyContent {
  titleAr: string;
  subtitleAr: string;
  durationAr: string;
  sections: WarrantySection[];
}

export interface PolicySection {
  title: string;
  subtitle?: string;
  content: string;
}

export interface PoliciesContent {
  returns: PolicySection;
  shipping: PolicySection;
  privacy: PolicySection;
  terms: PolicySection;
}

export interface AnnouncementBarContent {
  text: string;
  is_active: boolean;
  badge_text: string;
  link_url: string;
  free_shipping_threshold: number;
}

export interface StoreContactContent {
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterContent {
  about_text: string;
  phone_label: string;
  phone_display: string;
  phone_international: string;
  whatsapp_number: string;
  facebook_url: string;
  copyright_text: string;
  column_categories?: FooterColumn;
  column_services?: FooterColumn;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
  is_active: boolean;
}

export interface SiteSettings {
  announcement_bar: AnnouncementBarContent;
  hero_slides: HeroSlide[];
  service_pillars: ServicePillar[];
  warranty_content: WarrantyContent;
  policies_content: PoliciesContent;
  store_contact: StoreContactContent;
  footer_content?: FooterContent;
  nav_links?: NavLink[];
}

/* ═══════════════════════════════════════════════════════════════
   Customer Directory & CRM Types
   ═══════════════════════════════════════════════════════════════ */

export interface CustomerListItem {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  governorate: string | null;
  city: string | null;
  total_orders: number;
  lifetime_spent: number;
  last_order_date: string | null;
  created_at: string;
}
