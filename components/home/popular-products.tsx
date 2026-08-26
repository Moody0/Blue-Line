"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { Product } from "@/types/ecommerce";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/products/product-card";

interface PopularProductsProps {
  bestsellerProducts: Product[];
  featuredProducts: Product[];
  newArrivalProducts: Product[];
}

type TabType = "bestseller" | "featured" | "new";

const TABS: { id: TabType; labelAr: string }[] = [
  { id: "bestseller", labelAr: "الأكثر مبيعاً" },
  { id: "featured", labelAr: "المميزة" },
  { id: "new", labelAr: "وصل حديثاً" },
];

export function PopularProducts({
  bestsellerProducts = [],
  featuredProducts = [],
  newArrivalProducts = [],
}: PopularProductsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("bestseller");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Active products list based on selected tab
  const currentProducts =
    activeTab === "featured"
      ? featuredProducts.length > 0
        ? featuredProducts
        : bestsellerProducts
      : activeTab === "new"
      ? newArrivalProducts.length > 0
        ? newArrivalProducts
        : bestsellerProducts
      : bestsellerProducts;

  // Reset scroll position to beginning when tab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  // Scroll smoothly in requested direction
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
    <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 group/section relative cv-auto font-alexandria" dir="rtl">
      {/* Section Header with Centered Title & Active Filter Tabs */}
      <div className="text-center space-y-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-900 tracking-tight">
          المنتجات الأكثر طلباً
        </h2>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 pt-1 border-b border-border-default max-w-md mx-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 text-xs sm:text-sm font-bold tracking-wider transition-all relative cursor-pointer",
                activeTab === tab.id
                  ? "text-[#1E6091] after:absolute after:bottom-0 after:inset-x-0 after:h-[2px] after:bg-[#1E6091]"
                  : "text-text-muted hover:text-brand-900"
              )}
            >
              {tab.labelAr}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel Wrapper with Navigation Arrows */}
      <div className="relative">
        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scrollInDirection("right")}
          aria-label="التمرير لليمين"
          className="absolute -start-3 sm:-start-5 top-[35%] -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-border-default shadow-elevated hover:bg-surface-50 text-brand-900 flex items-center justify-center transition-colors duration-300 opacity-0 group-hover/section:opacity-100 z-20 cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>

        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scrollInDirection("left")}
          aria-label="التمرير لليسار"
          className="absolute -end-3 sm:-end-5 top-[35%] -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-border-default shadow-elevated hover:bg-surface-50 text-brand-900 flex items-center justify-center transition-colors duration-300 opacity-0 group-hover/section:opacity-100 z-20 cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Responsive Horizontal Track with Key for Smooth Animation */}
        <div
          key={activeTab}
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-4 pt-1 px-1 transition-opacity duration-300"
        >
          {currentProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={`${activeTab}-${product.id}`}
              product={product}
              className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
