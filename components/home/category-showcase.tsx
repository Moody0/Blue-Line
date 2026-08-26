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
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-900 tracking-tight">
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
    </section>
  );
}
