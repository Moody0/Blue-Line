"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
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

  // Take top 4 categories for the grid showcase
  const displayCategories = categories.slice(0, 4);

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
    <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 font-alexandria" dir="rtl">
      {/* Centered Main Title */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-900 tracking-tight">
          تسوق حسب الفئة
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-text-muted">
          استكشف أرقى تشكيلات الأدوات الصحية والسباكة المعمارية الفاخرة
        </p>
      </div>

      {/* 4 Cards Container: 2-Columns Horizontal Carousel on Mobile & 4-Columns Grid on Desktop */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex lg:grid lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-smooth no-scrollbar pb-2 items-center justify-items-center"
        >
          {displayCategories.map((cat) => {
            const imageSrc =
              DEFAULT_CATEGORY_IMAGES[cat.slug] ||
              cat.image_url ||
              "/images/categories/faucet.jpg";

            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative block shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)] lg:w-full max-w-[326px] h-[280px] sm:h-[350px] overflow-hidden bg-surface-100 shadow-xs transition-all duration-300 hover:shadow-elevated snap-start"
              >
                {/* High Resolution Category Image */}
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={cat.name_ar}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 326px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
                </div>

                {/* Bottom Centered Floating Button */}
                <div className="absolute bottom-3 sm:bottom-4 inset-x-2 sm:inset-x-3 flex justify-center z-10">
                  <div className="w-full max-w-[280px] py-2.5 sm:py-3.5 px-2 sm:px-4 text-center bg-white text-brand-900 shadow-md border border-black/5 group-hover:bg-[#1E6091] group-hover:text-white transition-all duration-300">
                    <h3 className="text-xs sm:text-sm font-bold tracking-tight truncate">
                      {cat.name_ar}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Carousel Indicators */}
        <div className="flex lg:hidden items-center justify-center gap-3 pt-3">
          <button
            onClick={() => scrollToSlide(0)}
            aria-label="الشريحة الأولى"
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              activeSlide === 0 ? "w-6 bg-[#1E6091]" : "w-2 bg-border-strong"
            )}
          />
          <button
            onClick={() => scrollToSlide(1)}
            aria-label="الشريحة الثانية"
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              activeSlide === 1 ? "w-6 bg-[#1E6091]" : "w-2 bg-border-strong"
            )}
          />
        </div>
      </div>

      {/* Tier 2: 2 Wide Editorial Promotional Banners (Matching Exact Reference Design) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 pt-4">
        {/* Banner 1: Faucets (Warm Neutral Background) */}
        <div className="relative bg-[#F4F1EA] rounded-none overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 h-[220px] sm:h-[240px] flex items-center group">
          {/* Image Container on Left in RTL (End side) with seamless gradient */}
          <div className="absolute end-0 top-0 bottom-0 w-[50%] sm:w-[48%] overflow-hidden z-0 pointer-events-none">
            <Image
              src="/images/promo/faucet-banner.jpg"
              alt="خلاطات المغاسل وأحواض الحمام"
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Smooth gradient blend into #F4F1EA */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F4F1EA]/50 to-[#F4F1EA]" />
          </div>

          {/* Text Content Container (Start side in RTL) */}
          <div className="relative z-10 w-[58%] sm:w-[54%] p-6 sm:p-8 flex flex-col justify-center items-start text-start space-y-2.5">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-600 tracking-wider uppercase">
              خصم ٢٥٪ حصري
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C] leading-snug tracking-tight">
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

        {/* Banner 2: Pressure Shower (Cool Crisp Neutral Background) */}
        <div className="relative bg-[#ECEEF0] rounded-none overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 h-[220px] sm:h-[240px] flex items-center group">
          {/* Image Container on Left in RTL (End side) with seamless gradient */}
          <div className="absolute end-0 top-0 bottom-0 w-[50%] sm:w-[48%] overflow-hidden z-0 pointer-events-none">
            <Image
              src="/images/promo/shower-banner.jpg"
              alt="سماعات الشاور والدش المطري"
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Smooth gradient blend into #ECEEF0 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ECEEF0]/50 to-[#ECEEF0]" />
          </div>

          {/* Text Content Container (Start side in RTL) */}
          <div className="relative z-10 w-[58%] sm:w-[54%] p-6 sm:p-8 flex flex-col justify-center items-start text-start space-y-2.5">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-600 tracking-wider uppercase">
              خصم ٢٠٪ لفترة محدودة
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C] leading-snug tracking-tight">
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
