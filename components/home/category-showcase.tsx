"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

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

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const progress = Math.abs(scrollLeft) / (maxScroll || 1);
    setActiveSlide(progress > 0.3 ? 1 : 0);
  };

  const scrollToSlide = (slideIndex: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth;
    const targetScroll = slideIndex === 0 ? 0 : -scrollAmount;
    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
    setActiveSlide(slideIndex);
  };

  return (
    <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 font-alexandria" dir="rtl">
      {/* Header with Title & "View All Products" Link */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-border-default/60 text-center sm:text-start">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-900 tracking-tight">
            تسوق حسب الفئة والأقسام
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-text-muted">
            استكشف أرقى تشكيلات الأدوات الصحية والسباكة المعمارية الفاخرة
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

      {/* Categories Grid (Responsive: 6 columns on lg, 3 on md, 2 on mobile) */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5"
        >
          {displayCategories.map((cat) => {
            const imageSrc =
              DEFAULT_CATEGORY_IMAGES[cat.slug] ||
              (cat as any).image_url ||
              "/images/categories/faucet.jpg";

            return (
              <Link
                key={cat.id || cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative block w-full h-[220px] sm:h-[260px] lg:h-[290px] overflow-hidden bg-surface-100 shadow-xs transition-all duration-300 hover:shadow-elevated rounded-xl border border-border-default/60"
              >
                {/* High Resolution Category Image */}
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={cat.name_ar}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                </div>

                {/* Bottom Floating Title Pill */}
                <div className="absolute bottom-3 inset-x-2.5 flex justify-center z-10">
                  <div className="w-full py-2 px-2 text-center bg-white/95 backdrop-blur-xs text-brand-900 shadow-sm border border-black/5 rounded-lg group-hover:bg-[#1E6091] group-hover:text-white transition-all duration-300">
                    <h3 className="text-xs font-bold tracking-tight truncate">
                      {cat.name_ar}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tier 2: 2 Full-Bleed Photographic Promotional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 pt-4">
        {/* Banner 1: Faucets */}
        <div className="relative rounded-none overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 h-[220px] sm:h-[250px] flex items-center group">
          <Image
            src="/images/promo/faucet-banner.jpg"
            alt="خلاطات المغاسل وأحواض الحمام"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-left-top sm:object-left transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F4F1EA]/60 to-[#F4F1EA]/95" />

          <div className="relative z-10 max-w-[65%] sm:max-w-[60%] p-6 sm:p-8 md:p-10 flex flex-col justify-center items-start text-start space-y-2.5">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-700 tracking-wider uppercase">
              خصم ٢٥٪ حصري
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-[25px] font-extrabold text-[#0B192C] leading-snug tracking-tight">
              خلاطات المغاسل وأحواض الحمام
            </h3>
            <div className="pt-2">
              <Link
                href="/category/mixers-basins"
                className="inline-flex items-center justify-center bg-[#1E6091] hover:bg-[#15486E] text-white font-bold py-2.5 px-7 text-xs uppercase tracking-wider transition-colors shadow-2xs"
              >
                تسوق الآن
              </Link>
            </div>
          </div>
        </div>

        {/* Banner 2: Pressure Shower */}
        <div className="relative rounded-none overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 h-[220px] sm:h-[250px] flex items-center group">
          <Image
            src="/images/promo/shower-banner.jpg"
            alt="سماعات الشاور والدش المطري"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-left-top sm:object-left transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ECEEF0]/60 to-[#ECEEF0]/95" />

          <div className="relative z-10 max-w-[65%] sm:max-w-[60%] p-6 sm:p-8 md:p-10 flex flex-col justify-center items-start text-start space-y-2.5">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-700 tracking-wider uppercase">
              خصم ٢٠٪ لفترة محدودة
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-[25px] font-extrabold text-[#0B192C] leading-snug tracking-tight">
              سماعات الشاور والدش المطري
            </h3>
            <div className="pt-2">
              <Link
                href="/category/shower-bury"
                className="inline-flex items-center justify-center bg-[#1E6091] hover:bg-[#15486E] text-white font-bold py-2.5 px-7 text-xs uppercase tracking-wider transition-colors shadow-2xs"
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
