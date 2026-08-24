"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, Layers } from "lucide-react";
import { NAV_CATEGORIES } from "@/lib/constants";
import type { Category } from "@/types/ecommerce";

interface CategoryShowcaseProps {
  categories?: Category[];
}

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  "shower-bury": "/images/categories/shower.jpg",
  "mixers-basins": "/images/categories/faucet.jpg",
  "bathtub-mixers": "/images/categories/basin.jpg",
  "mixers-kitchens": "/images/categories/toilet.jpg",
  "burial-objects": "/images/categories/shower.jpg",
  "bathroom-accessories": "/images/categories/basin.jpg",
};

export function CategoryShowcase({ categories = [] }: CategoryShowcaseProps) {
  // Show all available categories (from backend DB or NAV_CATEGORIES fallback)
  const displayCategories =
    categories.length > 0
      ? categories
      : NAV_CATEGORIES.map((c, i) => ({
          id: `cat-${i}`,
          name_ar: c.nameAr,
          name_en: c.nameEn,
          slug: c.slug,
          created_at: new Date().toISOString(),
        }));

  return (
    <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-alexandria" dir="rtl">
      {/* Header with Title & "View All Products" Link */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-border-default/60 text-center sm:text-start">
        <div className="space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-900 tracking-tight">
              تسوق حسب الفئة والأقسام
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1E6091]/10 text-[#1E6091] text-xs font-black">
              {displayCategories.length} فئات
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-text-muted">
            استكشف أرقى تشكيلات الأدوات الصحية والسباكة المعمارية الألمانية المعتمدة
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#1E6091] hover:text-brand-900 bg-surface-50 hover:bg-surface-100 border border-border-default px-4 py-2 rounded-xl transition-all shadow-2xs group cursor-pointer"
        >
          <span>عرض جميع المنتجات والتشكيلات</span>
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-1 text-[#1E6091]"
          />
        </Link>
      </div>

      {/* ── Mobile View: Smooth Horizontal Swipe Carousel (Prevents 8-row scroll fatigue) ── */}
      <div className="sm:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-3.5 pb-2 scrollbar-none overscroll-contain">
        {displayCategories.map((cat, idx) => {
          const imageSrc =
            DEFAULT_CATEGORY_IMAGES[cat.slug] ||
            (cat as any).image_url ||
            "/images/categories/faucet.jpg";

          return (
            <Link
              key={cat.id || `${cat.slug}-${idx}`}
              href={`/category/${cat.slug}`}
              className="group relative block w-[150px] h-[190px] shrink-0 snap-start overflow-hidden rounded-2xl bg-surface-100 shadow-sm border border-border-default/70"
            >
              <Image
                src={imageSrc}
                alt={cat.name_ar}
                fill
                sizes="150px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Bottom Content */}
              <div className="absolute bottom-3 inset-x-3 text-start space-y-0.5">
                <h3 className="text-xs font-extrabold text-white leading-tight line-clamp-2 drop-shadow-xs">
                  {cat.name_ar}
                </h3>
                <span className="inline-flex items-center gap-0.5 text-[10px] text-white/80 font-bold">
                  <span>تصفح</span>
                  <ChevronLeft size={11} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Desktop & Tablet View: Perfectly Balanced Symmetrical 4-Column Grid ── */}
      <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {displayCategories.map((cat, idx) => {
          const imageSrc =
            DEFAULT_CATEGORY_IMAGES[cat.slug] ||
            (cat as any).image_url ||
            "/images/categories/faucet.jpg";

          return (
            <Link
              key={cat.id || `${cat.slug}-${idx}`}
              href={`/category/${cat.slug}`}
              className="group relative block w-full h-[220px] lg:h-[240px] overflow-hidden rounded-2xl bg-surface-100 shadow-xs hover:shadow-xl transition-all duration-300 border border-border-default/60"
            >
              {/* High-Resolution Image */}
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={cat.name_ar}
                  fill
                  sizes="(max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                {/* Modern Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
              </div>

              {/* Bottom Text Content */}
              <div className="absolute bottom-4 inset-x-4 text-start z-10 space-y-1">
                <h3 className="text-sm lg:text-base font-extrabold text-white leading-snug tracking-tight drop-shadow-xs group-hover:text-accent-300 transition-colors">
                  {cat.name_ar}
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-white/80 group-hover:text-white transition-colors">
                  <span>استكشف المجموعة</span>
                  <ChevronLeft
                    size={13}
                    className="transition-transform duration-300 group-hover:-translate-x-1"
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Tier 2: 2 Full-Bleed Photographic Promotional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 pt-4">
        {/* Banner 1: Faucets */}
        <div className="relative rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 h-[220px] sm:h-[250px] flex items-center group border border-border-default/50">
          <Image
            src="/images/promo/faucet-banner.jpg"
            alt="خلاطات المغاسل وأحواض الحمام"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-left-top sm:object-left transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F4F1EA]/70 to-[#F4F1EA]/95" />

          <div className="relative z-10 max-w-[65%] sm:max-w-[60%] p-6 sm:p-8 md:p-10 flex flex-col justify-center items-start text-start space-y-2.5">
            <span className="text-[11px] sm:text-xs font-extrabold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-sm tracking-wider uppercase">
              خصم ٢٥٪ حصري
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-[25px] font-extrabold text-[#0B192C] leading-snug tracking-tight">
              خلاطات المغاسل وأحواض الحمام
            </h3>
            <div className="pt-2">
              <Link
                href="/category/mixers-basins"
                className="inline-flex items-center justify-center bg-[#1E6091] hover:bg-[#15486E] text-white font-bold py-2.5 px-7 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm hover:scale-105"
              >
                تسوق الآن
              </Link>
            </div>
          </div>
        </div>

        {/* Banner 2: Pressure Shower */}
        <div className="relative rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 h-[220px] sm:h-[250px] flex items-center group border border-border-default/50">
          <Image
            src="/images/promo/shower-banner.jpg"
            alt="سماعات الشاور والدش المطري"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-left-top sm:object-left transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ECEEF0]/70 to-[#ECEEF0]/95" />

          <div className="relative z-10 max-w-[65%] sm:max-w-[60%] p-6 sm:p-8 md:p-10 flex flex-col justify-center items-start text-start space-y-2.5">
            <span className="text-[11px] sm:text-xs font-extrabold text-[#1E6091] bg-blue-100/80 px-2 py-0.5 rounded-sm tracking-wider uppercase">
              خصم ٢٠٪ لفترة محدودة
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-[25px] font-extrabold text-[#0B192C] leading-snug tracking-tight">
              سماعات الشاور والدش المطري
            </h3>
            <div className="pt-2">
              <Link
                href="/category/shower-bury"
                className="inline-flex items-center justify-center bg-[#1E6091] hover:bg-[#15486E] text-white font-bold py-2.5 px-7 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm hover:scale-105"
              >
                تسوق الآن
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
