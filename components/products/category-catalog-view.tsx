"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { LayoutGrid, List, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { FilterSidebar, type FilterState } from "./filter-sidebar";
import { ProductCard } from "./product-card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types/ecommerce";

interface CategoryCatalogViewProps {
  category: Category | null;
  categories: Category[];
  initialProducts: Product[];
}

export function CategoryCatalogView({
  category,
  categories,
  initialProducts,
}: CategoryCatalogViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    "best_selling" | "price_asc" | "price_desc" | "discount" | "newest"
  >("best_selling");

  const [filterState, setFilterState] = useState<FilterState>({});

  const clearFilters = () => {
    setFilterState({});
  };

  // Compute facet counts dynamically
  const { stockCounts, highestPrice } = useMemo(() => {
    let inStock = 0;
    let outOfStock = 0;
    let maxP = 0;

    for (const p of initialProducts) {
      if (p.in_stock !== false) {
        inStock++;
      } else {
        outOfStock++;
      }
      const price = p.discount_price ?? p.base_price;
      if (price > maxP) maxP = price;
    }

    return {
      stockCounts: { inStock, outOfStock },
      highestPrice: Math.max(1000, maxP),
    };
  }, [initialProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Availability
    if (filterState.inStockOnly) {
      list = list.filter((p) => p.in_stock !== false);
    }
    if (filterState.outOfStockOnly) {
      list = list.filter((p) => p.in_stock === false);
    }

    // Price range
    if (filterState.minPrice !== undefined) {
      list = list.filter(
        (p) => (p.discount_price ?? p.base_price) >= filterState.minPrice!
      );
    }
    if (filterState.maxPrice !== undefined) {
      list = list.filter(
        (p) => (p.discount_price ?? p.base_price) <= filterState.maxPrice!
      );
    }

    // Colors / Finishes
    if (filterState.selectedColors && filterState.selectedColors.length > 0) {
      list = list.filter((p) =>
        p.variants?.some((v) =>
          filterState.selectedColors!.includes(v.hex_color)
        )
      );
    }

    // Sorting
    if (sortBy === "price_asc") {
      list.sort(
        (a, b) =>
          (a.discount_price ?? a.base_price) -
          (b.discount_price ?? b.base_price)
      );
    } else if (sortBy === "price_desc") {
      list.sort(
        (a, b) =>
          (b.discount_price ?? b.base_price) -
          (a.discount_price ?? a.base_price)
      );
    } else if (sortBy === "discount") {
      list.sort((a, b) => {
        const discA = a.discount_price ? a.base_price - a.discount_price : 0;
        const discB = b.discount_price ? b.base_price - b.discount_price : 0;
        return discB - discA;
      });
    } else if (sortBy === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return list;
  }, [initialProducts, filterState, sortBy]);

  return (
    <div className="space-y-6 sm:space-y-8 font-alexandria select-none" dir="rtl">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-default">
        {/* Mobile: Filter & Sort Trigger Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-50 hover:bg-surface-100 border border-border-default rounded-xl text-xs font-bold text-brand-900 transition-colors cursor-pointer shadow-2xs"
          >
            <SlidersHorizontal size={14} className="text-[#1E6091]" />
            <span>تصفية وترتيب</span>
          </button>
        </div>

        {/* Desktop: Breadcrumbs Info */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-text-muted">
          <Link href="/" className="hover:text-brand-900 transition-colors">
            الرئيسية
          </Link>
          <span className="text-border-strong text-[10px]">/</span>
          <span className="text-brand-900 font-bold">
            {category?.name_ar || "المنتجات"}
          </span>
        </div>

        {/* End side: Sort Selector + Count + Grid/List View Switcher */}
        <div className="flex items-center gap-3 sm:gap-4 ms-auto text-xs">
          {/* Products Count */}
          <div className="text-text-muted font-medium hidden sm:block">
            <span className="font-bold text-brand-900 font-mono">
              {filteredProducts.length}
            </span>{" "}
            منتج متاح
          </div>

          {/* Sort Selector Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="catalog-sort" className="text-text-muted font-bold hidden md:inline">
              الترتيب:
            </label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 px-3 pe-7 rounded-xl bg-surface-50 border border-border-default text-xs font-bold text-brand-900 focus:outline-none focus:border-accent-600 cursor-pointer shadow-2xs"
            >
              <option value="best_selling">الأكثر طلباً ومبيعاً</option>
              <option value="price_asc">السعر: من الأقل للأعلى</option>
              <option value="price_desc">السعر: من الأعلى للأقل</option>
              <option value="discount">أعلى نسبة خصم</option>
              <option value="newest">الأحدث إضافة</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 border-s border-border-default ps-2 sm:ps-3">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="عرض شبكي"
              className={cn(
                "p-1.5 rounded-lg transition-colors cursor-pointer",
                viewMode === "grid"
                  ? "bg-brand-900 text-white shadow-2xs"
                  : "text-text-muted hover:text-brand-900 hover:bg-surface-100"
              )}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="عرض قائمة"
              className={cn(
                "p-1.5 rounded-lg transition-colors cursor-pointer",
                viewMode === "list"
                  ? "bg-brand-900 text-white shadow-2xs"
                  : "text-text-muted hover:text-brand-900 hover:bg-surface-100"
              )}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Catalog Workspace: Filter Sidebar + Products Grid */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
        {/* Desktop Filter Sidebar (RTL Right side) */}
        <FilterSidebar
          categories={categories}
          activeCategorySlug={category?.slug}
          filterState={filterState}
          onFilterChange={setFilterState}
          onClearFilters={clearFilters}
          highestPrice={highestPrice}
          stockCounts={stockCounts}
          className="hidden lg:block"
        />

        {/* Product Listing Area */}
        <div className="flex-1 w-full min-w-0">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-[#F8FAFC] border border-border-default/60 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-brand-900">
                لا توجد منتجات تطابق خيارات التصفية
              </h3>
              <p className="text-xs text-text-muted max-w-md mx-auto">
                يرجى تجربة تقليل معايير التصفية أو مسح الفلاتر لعرض جميع الموديلات المتاحة.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 text-white text-xs font-bold rounded-xl hover:bg-[#1E6091] transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>إعادة ضبط الفلاتر</span>
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode="list"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet Drawer */}
      <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] rounded-t-3xl p-6 font-alexandria overflow-y-auto" dir="rtl">
          <SheetHeader className="pb-4 border-b border-border-default text-start">
            <SheetTitle className="text-base font-bold text-brand-900">
              تصفية وترتيب المنتجات
            </SheetTitle>
          </SheetHeader>

          <div className="py-4">
            <FilterSidebar
              categories={categories}
              activeCategorySlug={category?.slug}
              filterState={filterState}
              onFilterChange={setFilterState}
              onClearFilters={clearFilters}
              highestPrice={highestPrice}
              stockCounts={stockCounts}
            />
          </div>

          <div className="pt-4 border-t border-border-default flex gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="flex-1 h-11 bg-brand-900 text-white text-xs font-bold rounded-xl flex items-center justify-center hover:bg-[#1E6091] transition-colors cursor-pointer"
            >
              تطبيق الفلاتر ({filteredProducts.length} منتج)
            </button>
            <button
              type="button"
              onClick={() => {
                clearFilters();
                setMobileFilterOpen(false);
              }}
              className="px-4 h-11 border border-border-default text-text-secondary text-xs font-bold rounded-xl hover:bg-surface-100 transition-colors"
            >
              إعادة ضبط
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
