"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { FilterSidebar, type FilterState } from "./filter-sidebar";
import { ProductCard } from "./product-card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";
import type { Category, Product } from "@/types/ecommerce";

interface CategoryCatalogViewProps {
  category: Category | null;
  categories: Category[];
  initialProducts: Product[];
}

const COLOR_NAMES: Record<string, string> = {
  "#D4D4D8": "كروم لامع",
  "#18181B": "أسود مطفي",
  "#EAB308": "ذهبي لامع",
  "#3F3F46": "جرافيت مصقول",
  "#B45309": "روز جولد",
  "#71717A": "نيكل SuperSteel",
};

const INITIAL_PAGE_SIZE = 12;

export function CategoryCatalogView({
  category,
  categories,
  initialProducts,
}: CategoryCatalogViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);
  const [sortBy, setSortBy] = useState<
    "best_selling" | "price_asc" | "price_desc" | "discount" | "newest"
  >("best_selling");

  const [filterState, setFilterState] = useState<FilterState>({});

  // Reset pagination when filters or sort change
  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE);
  }, [filterState, sortBy]);

  const clearFilters = () => {
    setFilterState({});
  };

  // Remove individual active filter
  const removeFilter = (key: keyof FilterState, value?: string) => {
    setFilterState((prev) => {
      const updated = { ...prev };
      if (key === "selectedColors" && value) {
        updated.selectedColors = (prev.selectedColors || []).filter(
          (c) => c !== value
        );
        if (updated.selectedColors.length === 0) delete updated.selectedColors;
      } else if (key === "selectedBrands" && value) {
        updated.selectedBrands = (prev.selectedBrands || []).filter(
          (b) => b !== value
        );
        if (updated.selectedBrands.length === 0) delete updated.selectedBrands;
      } else if (key === "minPrice" || key === "maxPrice") {
        delete updated.minPrice;
        delete updated.maxPrice;
      } else {
        delete updated[key];
      }
      return updated;
    });
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

    // Brands
    if (filterState.selectedBrands && filterState.selectedBrands.length > 0) {
      list = list.filter((p) =>
        filterState.selectedBrands!.some(
          (b) =>
            p.title_ar.toLowerCase().includes(b.toLowerCase()) ||
            p.title_en?.toLowerCase().includes(b.toLowerCase())
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

  // Paginated slice
  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;
  const progressPct = Math.min(
    100,
    Math.round((displayedProducts.length / (filteredProducts.length || 1)) * 100)
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + INITIAL_PAGE_SIZE);
  };

  // Determine active filter badges
  const hasActiveFilters =
    Boolean(filterState.inStockOnly) ||
    Boolean(filterState.outOfStockOnly) ||
    filterState.minPrice !== undefined ||
    filterState.maxPrice !== undefined ||
    Boolean(filterState.selectedColors && filterState.selectedColors.length > 0) ||
    Boolean(filterState.selectedBrands && filterState.selectedBrands.length > 0);

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
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#1E6091]" />
            )}
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
            <label
              htmlFor="catalog-sort"
              className="text-text-muted font-bold hidden md:inline"
            >
              الترتيب:
            </label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 px-3 pe-7 rounded-xl bg-surface-50 border border-border-default text-xs font-bold text-brand-900 focus:outline-none focus:border-[#1E6091] cursor-pointer shadow-2xs"
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

      {/* Feature 1: Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-surface-50/80 rounded-xl border border-border-default/70 animate-in fade-in duration-200">
          <span className="text-xs font-bold text-text-muted ps-1">
            الفلاتر النشطة:
          </span>

          {filterState.inStockOnly && (
            <button
              type="button"
              onClick={() => removeFilter("inStockOnly")}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-border-default rounded-full text-xs font-semibold text-brand-900 hover:border-destructive hover:text-destructive transition-colors group shadow-2xs cursor-pointer"
            >
              <span>متوفر في المخزون</span>
              <X size={12} className="text-text-muted group-hover:text-destructive" />
            </button>
          )}

          {filterState.outOfStockOnly && (
            <button
              type="button"
              onClick={() => removeFilter("outOfStockOnly")}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-border-default rounded-full text-xs font-semibold text-brand-900 hover:border-destructive hover:text-destructive transition-colors group shadow-2xs cursor-pointer"
            >
              <span>غير متوفر</span>
              <X size={12} className="text-text-muted group-hover:text-destructive" />
            </button>
          )}

          {(filterState.minPrice !== undefined ||
            filterState.maxPrice !== undefined) && (
            <button
              type="button"
              onClick={() => removeFilter("minPrice")}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-border-default rounded-full text-xs font-semibold text-brand-900 hover:border-destructive hover:text-destructive transition-colors group shadow-2xs cursor-pointer"
            >
              <span>
                السعر: {formatPrice(filterState.minPrice || 0)} -{" "}
                {formatPrice(filterState.maxPrice || highestPrice)}
              </span>
              <X size={12} className="text-text-muted group-hover:text-destructive" />
            </button>
          )}

          {filterState.selectedColors?.map((hex) => (
            <button
              key={hex}
              type="button"
              onClick={() => removeFilter("selectedColors", hex)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-border-default rounded-full text-xs font-semibold text-brand-900 hover:border-destructive hover:text-destructive transition-colors group shadow-2xs cursor-pointer"
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/20"
                style={{ backgroundColor: hex }}
              />
              <span>{COLOR_NAMES[hex] || "لون مخصص"}</span>
              <X size={12} className="text-text-muted group-hover:text-destructive" />
            </button>
          ))}

          {filterState.selectedBrands?.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => removeFilter("selectedBrands", brand)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-border-default rounded-full text-xs font-semibold text-brand-900 hover:border-destructive hover:text-destructive transition-colors group shadow-2xs cursor-pointer"
            >
              <span>علامة: {brand}</span>
              <X size={12} className="text-text-muted group-hover:text-destructive" />
            </button>
          ))}

          <button
            type="button"
            onClick={clearFilters}
            className="ms-auto inline-flex items-center gap-1 text-xs font-bold text-destructive hover:underline pe-1 cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>مسح الكل</span>
          </button>
        </div>
      )}

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
          className="hidden lg:block sticky top-24"
        />

        {/* Product Listing Area */}
        <div className="flex-1 w-full min-w-0 space-y-10">
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
          ) : (
            <>
              {/* Product Grid / List Display */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode="grid"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode="list"
                    />
                  ))}
                </div>
              )}

              {/* Feature 2: Progressive Load More & Visual Progress Bar */}
              {filteredProducts.length > INITIAL_PAGE_SIZE && (
                <div className="pt-8 pb-4 flex flex-col items-center justify-center space-y-4 border-t border-border-default/70">
                  {/* Progress Text */}
                  <p className="text-xs font-medium text-text-muted">
                    تم عرض{" "}
                    <span className="font-bold text-brand-900 font-mono">
                      {displayedProducts.length}
                    </span>{" "}
                    من أصل{" "}
                    <span className="font-bold text-brand-900 font-mono">
                      {filteredProducts.length}
                    </span>{" "}
                    منتج متوفر
                  </p>

                  {/* Slim Luxury Progress Bar */}
                  <div className="w-full max-w-xs h-1.5 bg-surface-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1E6091] rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  {/* Load More Button */}
                  {hasMore ? (
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-3 bg-white hover:bg-surface-50 text-brand-900 font-bold text-xs uppercase tracking-wider rounded-xl border border-border-strong hover:border-[#1E6091] shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                    >
                      <span>عرض المزيد من المنتجات</span>
                      <ChevronDown
                        size={15}
                        className="text-[#1E6091] group-hover:translate-y-0.5 transition-transform"
                      />
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-xs text-text-muted font-medium pt-1">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span>تم عرض كافة التشكيلات المتوفرة</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet Drawer */}
      <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] rounded-t-3xl p-6 font-alexandria overflow-y-auto"
          dir="rtl"
        >
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
