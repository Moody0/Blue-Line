"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";
import type { Product } from "@/types/ecommerce";
import { ProductCard } from "@/components/products/product-card";

interface TopRatedProductsProps {
  products: Product[];
}

export function TopRatedProducts({ products }: TopRatedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Show max 8 top products
  const displayProducts = products.slice(0, 8);

  // Scroll smoothly in the requested screen direction
  const scrollInDirection = (direction: "right" | "left") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const firstCard = container.firstElementChild as HTMLElement | null;
    const secondCard = firstCard?.nextElementSibling as HTMLElement | null;

    if (!firstCard) return;

    let scrollAmount = firstCard.offsetWidth + 16;
    if (firstCard && secondCard) {
      scrollAmount = Math.abs(secondCard.offsetLeft - firstCard.offsetLeft) || (firstCard.offsetWidth + 16);
    }

    const delta = direction === "right" ? scrollAmount : -scrollAmount;
    container.scrollBy({
      left: delta,
      behavior: "smooth",
    });
  };

  return (
    <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 group/section relative cv-auto" dir="rtl">
      {/* Section Header with Centered Title Only */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-900 tracking-tight">
          المنتجات الأعلى تقييماً
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-text-muted">
          الموديلات الحائزة على أعلى تقييمات الجودة الهندسية والمطابقة المعمارية
        </p>
      </div>

      {/* Carousel Wrapper with Hover-Activated Navigation Arrows */}
      <div className="relative">
        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scrollInDirection("right")}
          aria-label="التمرير لليمين"
          className="absolute -start-3 sm:-start-5 top-[35%] -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-border-default shadow-elevated hover:bg-surface-50 text-brand-900 flex items-center justify-center transition-all duration-300 opacity-0 group-hover/section:opacity-100 hover:scale-110 z-20 cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>

        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scrollInDirection("left")}
          aria-label="التمرير لليسار"
          className="absolute -end-3 sm:-end-5 top-[35%] -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-border-default shadow-elevated hover:bg-surface-50 text-brand-900 flex items-center justify-center transition-all duration-300 opacity-0 group-hover/section:opacity-100 hover:scale-110 z-20 cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Responsive Horizontal Track: 4 cols on lg, 3 cols on md, 2 cols on mobile */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-4 pt-1 px-1"
        >
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]"
            />
          ))}
        </div>
      </div>

      {/* Centered Bottom CTA Button */}
      <div className="text-center pt-2">
        <Link
          href="/category/faucets"
          className="inline-flex items-center gap-2 bg-[#1E6091] hover:bg-brand-900 text-white font-bold py-3 px-10 text-xs tracking-wider shadow-xs hover:shadow-elevated transition-all duration-200 rounded-xl"
        >
          <span>عرض كافة المنتجات</span>
          <ArrowLeft size={15} />
        </Link>
      </div>
    </section>
  );
}
