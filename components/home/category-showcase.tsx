"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import type { Category } from "@/types/ecommerce";

interface CategoryShowcaseProps {
  categories?: Category[];
}

// 6 Flagship Core Categories with verified real photography
const FLAGSHIP_CATEGORIES = [
  {
    slug: "mixers-basins",
    name_ar: "خلاطات أحواض",
    subtitle: "تصاميم معمارية فاخرة",
    image: "/images/categories/faucet.jpg",
  },
  {
    slug: "shower-bury",
    name_ar: "شاور وأنظمة دش",
    subtitle: "دش مطري وثرموستات ذكي",
    image: "/images/categories/shower.jpg",
  },
  {
    slug: "bathtub-mixers",
    name_ar: "خلاطات بانيو",
    subtitle: "خلاطات أرضية وحائطية",
    image: "/images/categories/basin.jpg",
  },
  {
    slug: "mixers-kitchens",
    name_ar: "خلاطات مطابخ",
    subtitle: "سحب احترافي ورشاش مرن",
    image: "/images/categories/toilet.jpg",
  },
  {
    slug: "burial-objects",
    name_ar: "أجسام وخزانات دفن",
    subtitle: "أنظمة سمارت وشاسيهات",
    image: "/images/categories/shower.jpg",
  },
  {
    slug: "bathroom-accessories",
    name_ar: "إكسسوارات حمام",
    subtitle: "أطقم ومحابس متكاملة",
    image: "/images/categories/basin.jpg",
  },
];

export function CategoryShowcase({ categories = [] }: CategoryShowcaseProps) {
  // Use flagship curated categories for the homepage showcase
  const displayItems = FLAGSHIP_CATEGORIES;

  return (
    <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-alexandria" dir="rtl">
      {/* Header with Title & Direct Link to Full Catalog */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-border-default/60 text-center sm:text-start">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-900 tracking-tight">
            تسوق حسب التشكيلات الأساسية
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-text-muted">
            أرقى حلول وخلاطات الأدوات الصحية والسباكة المعمارية
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#1E6091] hover:text-brand-900 bg-surface-50 hover:bg-surface-100 border border-border-default px-4 py-2 rounded-xl transition-all shadow-2xs group cursor-pointer"
        >
          <span>عرض جميع الأقسام والكتالوج ({categories.length > 0 ? categories.length : 16} قسماً)</span>
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-1 text-[#1E6091]"
          />
        </Link>
      </div>

      {/* 6 Flagship Categories Grid (Clean 6-cols on lg, 3-cols on sm/md, 2-cols on mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5">
        {displayItems.map((item) => (
          <Link
            key={item.slug}
            href={`/category/${item.slug}`}
            className="group relative block w-full h-[210px] sm:h-[250px] lg:h-[280px] overflow-hidden rounded-2xl bg-surface-100 shadow-xs hover:shadow-xl transition-all duration-300 border border-border-default/70"
          >
            {/* Real High-Resolution Category Photo */}
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.name_ar}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-opacity duration-300"
              />
              {/* Refined Bottom Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-3.5 inset-x-3.5 text-start z-10 space-y-0.5">
              <h3 className="text-xs sm:text-sm font-extrabold text-white leading-snug tracking-tight drop-shadow-xs group-hover:text-accent-300 transition-colors">
                {item.name_ar}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-white/75 font-medium leading-tight truncate">
                {item.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* 2 Photographic Feature Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-2">
        {/* Banner 1: Faucets */}
        <div className="relative rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 h-[210px] sm:h-[240px] flex items-center group border border-border-default/50">
          <Image
            src="/images/promo/faucet-banner.jpg"
            alt="خلاطات المغاسل وأحواض الحمام"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-left-top sm:object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F4F1EA]/70 to-[#F4F1EA]/95" />

          <div className="relative z-10 max-w-[65%] sm:max-w-[60%] p-5 sm:p-8 flex flex-col justify-center items-start text-start space-y-2">
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-sm tracking-wider">
              تشكيلات معتمدة
            </span>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#0B192C] leading-snug tracking-tight">
              خلاطات المغاسل وأحواض الحمام
            </h3>
            <div className="pt-1.5">
              <Link
                href="/category/mixers-basins"
                className="inline-flex items-center justify-center bg-[#1E6091] hover:bg-[#15486E] text-white font-bold py-2 px-6 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-2xs"
              >
                تصفح التشكيلة
              </Link>
            </div>
          </div>
        </div>

        {/* Banner 2: Pressure Shower */}
        <div className="relative rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 h-[210px] sm:h-[240px] flex items-center group border border-border-default/50">
          <Image
            src="/images/promo/shower-banner.jpg"
            alt="سماعات الشاور والدش المطري"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-left-top sm:object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ECEEF0]/70 to-[#ECEEF0]/95" />

          <div className="relative z-10 max-w-[65%] sm:max-w-[60%] p-5 sm:p-8 flex flex-col justify-center items-start text-start space-y-2">
            <span className="text-[11px] font-bold text-[#1E6091] bg-blue-100/80 px-2 py-0.5 rounded-sm tracking-wider">
              أنظمة سباكة ألمانية
            </span>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#0B192C] leading-snug tracking-tight">
              سماعات الشاور والدش المطري
            </h3>
            <div className="pt-1.5">
              <Link
                href="/category/shower-bury"
                className="inline-flex items-center justify-center bg-[#1E6091] hover:bg-[#15486E] text-white font-bold py-2 px-6 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-2xs"
              >
                تصفح التشكيلة
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
