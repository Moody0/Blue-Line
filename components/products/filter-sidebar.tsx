"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Check,
  FolderTree,
  Search,
} from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { NAV_CATEGORIES } from "@/lib/constants";
import type { Category } from "@/types/ecommerce";

export interface FilterState {
  inStockOnly?: boolean;
  outOfStockOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  selectedColors?: string[];
  selectedProductTypes?: string[];
  selectedBrands?: string[];
  selectedMaterials?: string[];
}

interface FilterSidebarProps {
  categories?: Category[];
  activeCategorySlug?: string;
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
  onClearFilters: () => void;
  highestPrice?: number;
  productTypeCounts?: Record<string, number>;
  brandCounts?: Record<string, number>;
  materialCounts?: Record<string, number>;
  stockCounts?: { inStock: number; outOfStock: number };
  className?: string;
}

export function FilterSidebar({
  categories = [],
  activeCategorySlug,
  filterState,
  onFilterChange,
  onClearFilters,
  highestPrice = 10000,
  productTypeCounts = {},
  brandCounts = {},
  materialCounts = {},
  stockCounts = { inStock: 10, outOfStock: 0 },
  className,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    availability: true,
    price: true,
    color: true,
    brand: true,
  });

  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const activeCategoryRef = useRef<HTMLAnchorElement>(null);

  // Auto-scroll active category into visible area
  useEffect(() => {
    if (activeCategoryRef.current) {
      activeCategoryRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeCategorySlug]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleStock = (type: "inStock" | "outOfStock") => {
    if (type === "inStock") {
      onFilterChange({
        ...filterState,
        inStockOnly: !filterState.inStockOnly,
      });
    } else {
      onFilterChange({
        ...filterState,
        outOfStockOnly: !filterState.outOfStockOnly,
      });
    }
  };

  const toggleColor = (hex: string) => {
    const current = filterState.selectedColors || [];
    const next = current.includes(hex)
      ? current.filter((c) => c !== hex)
      : [...current, hex];
    onFilterChange({ ...filterState, selectedColors: next });
  };

  const toggleBrand = (brand: string) => {
    const current = filterState.selectedBrands || [];
    const next = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    onFilterChange({ ...filterState, selectedBrands: next });
  };

  const hasActiveFilters =
    filterState.inStockOnly ||
    filterState.outOfStockOnly ||
    filterState.minPrice !== undefined ||
    filterState.maxPrice !== undefined ||
    (filterState.selectedColors && filterState.selectedColors.length > 0) ||
    (filterState.selectedBrands && filterState.selectedBrands.length > 0);

  const availableColors = [
    { nameAr: "كروم لامع StarLight", hex: "#D4D4D8" },
    { nameAr: "أسود مطفي Phantom Black", hex: "#18181B" },
    { nameAr: "ذهبي لامع Cool Sunrise", hex: "#EAB308" },
    { nameAr: "جرافيت مصقول Hard Graphite", hex: "#3F3F46" },
    { nameAr: "غروب دافئ Warm Sunset", hex: "#B45309" },
    { nameAr: "نيكل مصقول SuperSteel", hex: "#71717A" },
    { nameAr: "أبيض ناصع Moon White", hex: "#FAFAFA" },
  ];

  // Resolve complete categories list
  const allCategoryList = useMemo(() => {
    if (categories.length > 0) return categories;
    return NAV_CATEGORIES.map((c, i) => ({
      id: `cat-${i}`,
      name_ar: c.nameAr,
      name_en: c.nameEn,
      slug: c.slug,
      created_at: new Date().toISOString(),
    }));
  }, [categories]);

  // Filter categories by search if typed
  const filteredCategoriesList = useMemo(() => {
    if (!categorySearchQuery.trim()) return allCategoryList;
    const q = categorySearchQuery.trim().toLowerCase();
    return allCategoryList.filter(
      (c) =>
        c.name_ar.toLowerCase().includes(q) ||
        c.name_en?.toLowerCase().includes(q)
    );
  }, [allCategoryList, categorySearchQuery]);

  const isAllProductsActive =
    !activeCategorySlug ||
    activeCategorySlug === "all" ||
    activeCategorySlug === "products";

  return (
    <aside
      className={cn(
        "w-full lg:w-64 shrink-0 space-y-5 text-start font-alexandria select-none lg:max-h-[calc(100vh-6.5rem)] lg:overflow-y-auto lg:overscroll-contain no-scrollbar pe-1.5",
        className
      )}
      dir="rtl"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-default sticky top-0 bg-white/95 backdrop-blur-xs z-10">
        <h2 className="text-sm sm:text-base font-extrabold text-brand-900 tracking-tight">
          تصفية المنتجات
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs text-text-muted hover:text-brand-900 flex items-center gap-1 transition-colors cursor-pointer font-bold"
          >
            <RotateCcw size={12} />
            <span>إعادة ضبط</span>
          </button>
        )}
      </div>

      {/* 0. أقسام وتصنيفات المتجر (Compact Scrollable Categories) */}
      <div className="space-y-2.5 pb-4 border-b border-border-default">
        <button
          type="button"
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-brand-900 hover:text-[#1E6091] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FolderTree size={15} className="text-[#1E6091]" />
            <span>أقسام المتجر ({allCategoryList.length})</span>
          </div>
          {openSections.categories ? (
            <ChevronUp size={15} />
          ) : (
            <ChevronDown size={15} />
          )}
        </button>

        {openSections.categories && (
          <div className="space-y-2 pt-1 text-xs">
            {/* Quick Filter Search if > 6 categories */}
            {allCategoryList.length > 6 && (
              <div className="relative">
                <Search
                  size={13}
                  className="absolute start-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="ابحث في الأقسام..."
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  className="w-full h-8 ps-7 pe-2.5 text-[11px] bg-surface-50 border border-border-default rounded-lg focus:outline-none focus:border-[#1E6091]"
                />
              </div>
            )}

            {/* Scrollable Categories Box (Max 180px height to prevent pushing filters off-screen) */}
            <div className="max-h-44 overflow-y-auto overscroll-contain space-y-1 pe-1">
              {/* All Products Option */}
              <Link
                href="/products"
                ref={isAllProductsActive ? activeCategoryRef : undefined}
                className={cn(
                  "flex items-center justify-between py-1.5 px-2.5 rounded-lg font-bold transition-colors text-xs",
                  isAllProductsActive
                    ? "bg-[#1E6091] text-white shadow-2xs"
                    : "text-text-secondary hover:text-brand-900 hover:bg-surface-50"
                )}
              >
                <span>جميع المنتجات والتشكيلات</span>
                {isAllProductsActive && (
                  <Check size={13} className="text-white" />
                )}
              </Link>

              {/* Individual Categories */}
              {filteredCategoriesList.map((cat) => {
                const isActive = activeCategorySlug === cat.slug;
                return (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    ref={isActive ? activeCategoryRef : undefined}
                    className={cn(
                      "flex items-center justify-between py-1.5 px-2.5 rounded-lg transition-colors text-[11px]",
                      isActive
                        ? "bg-[#1E6091] text-white font-bold shadow-2xs"
                        : "text-text-secondary hover:text-brand-900 hover:bg-surface-50 font-medium"
                    )}
                  >
                    <span className="truncate">{cat.name_ar}</span>
                    {isActive && (
                      <Check size={13} className="text-white shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 1. حالة التوفر (Availability) */}
      <div className="space-y-2.5 pb-4 border-b border-border-default">
        <button
          type="button"
          onClick={() => toggleSection("availability")}
          className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-brand-900 hover:text-[#1E6091] transition-colors cursor-pointer"
        >
          <span>حالة التوفر</span>
          {openSections.availability ? (
            <ChevronUp size={15} />
          ) : (
            <ChevronDown size={15} />
          )}
        </button>

        {openSections.availability && (
          <div className="space-y-2 pt-1 text-xs text-text-secondary">
            <label className="flex items-center gap-2.5 cursor-pointer hover:text-brand-900 transition-colors">
              <input
                type="checkbox"
                checked={!!filterState.inStockOnly}
                onChange={() => toggleStock("inStock")}
                className="w-4 h-4 rounded-md border-border-default text-[#1E6091] focus:ring-[#1E6091] cursor-pointer"
              />
              <span className="font-medium">
                متوفر في المخزون ({stockCounts.inStock})
              </span>
            </label>
            {stockCounts.outOfStock > 0 && (
              <label className="flex items-center gap-2.5 cursor-pointer text-text-muted hover:text-brand-900 transition-colors">
                <input
                  type="checkbox"
                  checked={!!filterState.outOfStockOnly}
                  onChange={() => toggleStock("outOfStock")}
                  className="w-4 h-4 rounded-md border-border-default text-[#1E6091] focus:ring-[#1E6091] cursor-pointer"
                />
                <span className="font-medium">
                  غير متوفر ({stockCounts.outOfStock})
                </span>
              </label>
            )}
          </div>
        )}
      </div>

      {/* 2. نطاق السعر (Price Range) */}
      <div className="space-y-2.5 pb-4 border-b border-border-default">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-brand-900 hover:text-[#1E6091] transition-colors cursor-pointer"
        >
          <span>نطاق السعر</span>
          {openSections.price ? (
            <ChevronUp size={15} />
          ) : (
            <ChevronDown size={15} />
          )}
        </button>

        {openSections.price && (
          <div className="space-y-2.5 pt-1">
            <p className="text-[11px] text-text-muted">
              أعلى سعر متاح:{" "}
              <span className="font-bold text-brand-900">
                {formatPrice(highestPrice)}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="من"
                value={filterState.minPrice ?? ""}
                onChange={(e) =>
                  onFilterChange({
                    ...filterState,
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full h-8 px-2 text-xs bg-surface-50 border border-border-default rounded-lg focus:outline-none focus:border-[#1E6091]"
              />
              <span className="text-text-muted text-xs">-</span>
              <input
                type="number"
                placeholder="إلى"
                value={filterState.maxPrice ?? ""}
                onChange={(e) =>
                  onFilterChange({
                    ...filterState,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full h-8 px-2 text-xs bg-surface-50 border border-border-default rounded-lg focus:outline-none focus:border-[#1E6091]"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. الطلاء ولون التشطيب (Finish Swatches) */}
      <div className="space-y-2.5 pb-4 border-b border-border-default">
        <button
          type="button"
          onClick={() => toggleSection("color")}
          className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-brand-900 hover:text-[#1E6091] transition-colors cursor-pointer"
        >
          <span>الطلاء ولون التشطيب</span>
          {openSections.color ? (
            <ChevronUp size={15} />
          ) : (
            <ChevronDown size={15} />
          )}
        </button>

        {openSections.color && (
          <div className="p-1.5 flex flex-wrap gap-2.5 items-center">
            {availableColors.map((color) => {
              const isSelected = filterState.selectedColors?.includes(color.hex);
              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => toggleColor(color.hex)}
                  title={color.nameAr}
                  aria-label={color.nameAr}
                  className={cn(
                    "relative w-7 h-7 rounded-full border border-black/20 flex items-center justify-center transition-all cursor-pointer shrink-0",
                    isSelected
                      ? "ring-2 ring-[#1E6091] ring-offset-2 ring-offset-white shadow-sm"
                      : "hover:scale-105 opacity-85 hover:opacity-100"
                  )}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <Check
                      size={13}
                      className={
                        color.hex === "#FAFAFA" || color.hex === "#D4D4D8"
                          ? "text-black font-bold"
                          : "text-white font-bold"
                      }
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. العلامة التجارية (Brand) */}
      <div className="space-y-2.5 pb-6">
        <button
          type="button"
          onClick={() => toggleSection("brand")}
          className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-brand-900 hover:text-[#1E6091] transition-colors cursor-pointer"
        >
          <span>العلامة التجارية</span>
          {openSections.brand ? (
            <ChevronUp size={15} />
          ) : (
            <ChevronDown size={15} />
          )}
        </button>

        {openSections.brand && (
          <div className="space-y-2 pt-1 text-xs text-text-secondary">
            {["GROHE Germany (جروهي ألمانيا)"].map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2.5 cursor-pointer hover:text-brand-900 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filterState.selectedBrands?.includes("GROHE") ?? true}
                  onChange={() => toggleBrand("GROHE")}
                  className="w-4 h-4 rounded-md border-border-default text-[#1E6091] focus:ring-[#1E6091] cursor-pointer"
                />
                <span className="font-medium">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
