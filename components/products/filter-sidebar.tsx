"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, RotateCcw, Check } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
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
    availability: true,
    price: true,
    color: true,
    brand: true,
  });

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

  return (
    <aside
      className={cn(
        "w-full lg:w-64 shrink-0 space-y-5 text-start font-alexandria select-none",
        className
      )}
      dir="rtl"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-default">
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

      {/* 1. حالة التوفر (Availability) */}
      <div className="space-y-3 pb-4 border-b border-border-default">
        <button
          type="button"
          onClick={() => toggleSection("availability")}
          className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-brand-900 hover:text-accent-600 transition-colors cursor-pointer"
        >
          <span>حالة التوفر</span>
          {openSections.availability ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.availability && (
          <div className="space-y-2 pt-1 text-xs text-text-secondary">
            <label className="flex items-center gap-2.5 cursor-pointer hover:text-brand-900 transition-colors">
              <input
                type="checkbox"
                checked={!!filterState.inStockOnly}
                onChange={() => toggleStock("inStock")}
                className="w-4 h-4 rounded-md border-border-default text-accent-600 focus:ring-accent-600 cursor-pointer"
              />
              <span className="font-medium">متوفر في المخزون ({stockCounts.inStock})</span>
            </label>
            {stockCounts.outOfStock > 0 && (
              <label className="flex items-center gap-2.5 cursor-pointer text-text-muted hover:text-brand-900 transition-colors">
                <input
                  type="checkbox"
                  checked={!!filterState.outOfStockOnly}
                  onChange={() => toggleStock("outOfStock")}
                  className="w-4 h-4 rounded-md border-border-default text-accent-600 focus:ring-accent-600 cursor-pointer"
                />
                <span className="font-medium">غير متوفر ({stockCounts.outOfStock})</span>
              </label>
            )}
          </div>
        )}
      </div>

      {/* 2. نطاق السعر (Price Range) */}
      <div className="space-y-3 pb-4 border-b border-border-default">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-brand-900 hover:text-accent-600 transition-colors cursor-pointer"
        >
          <span>نطاق السعر</span>
          {openSections.price ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.price && (
          <div className="space-y-3 pt-1">
            <p className="text-[11px] text-text-muted">
              أعلى سعر متاح: <span className="font-bold text-brand-900">{formatPrice(highestPrice)}</span>
            </p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
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
                  className="w-full px-3 h-9 text-xs rounded-xl border border-border-default bg-surface-50 focus:bg-white focus:outline-none focus:border-accent-600 font-medium"
                />
              </div>
              <span className="text-text-muted text-xs font-bold">-</span>
              <div className="relative flex-1">
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
                  className="w-full px-3 h-9 text-xs rounded-xl border border-border-default bg-surface-50 focus:bg-white focus:outline-none focus:border-accent-600 font-medium"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. ألوان وتشطيبات PVD (Color Swatches) */}
      <div className="space-y-3 pb-4 border-b border-border-default">
        <button
          type="button"
          onClick={() => toggleSection("color")}
          className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-brand-900 hover:text-accent-600 transition-colors cursor-pointer"
        >
          <span>الطلاء ولون التشطيب</span>
          {openSections.color ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.color && (
          <div className="flex flex-wrap gap-2.5 pt-1">
            {availableColors.map((c) => {
              const isSelected = filterState.selectedColors?.includes(c.hex);
              return (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => toggleColor(c.hex)}
                  title={c.nameAr}
                  className={cn(
                    "w-7 h-7 rounded-full border border-black/15 flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-2xs",
                    isSelected && "ring-2 ring-[#1E6091] ring-offset-2 scale-110"
                  )}
                  style={{ backgroundColor: c.hex }}
                >
                  {isSelected && (
                    <Check
                      size={13}
                      className={
                        c.hex === "#FAFAFA" || c.hex === "#D4D4D8"
                          ? "text-black"
                          : "text-white"
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
      <div className="space-y-3 pb-2">
        <button
          type="button"
          onClick={() => toggleSection("brand")}
          className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-brand-900 hover:text-accent-600 transition-colors cursor-pointer"
        >
          <span>العلامة التجارية</span>
          {openSections.brand ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.brand && (
          <div className="space-y-2 pt-1 text-xs text-text-secondary">
            <label className="flex items-center gap-2.5 cursor-pointer hover:text-brand-900 transition-colors">
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="w-4 h-4 rounded-md border-border-default text-accent-600 focus:ring-accent-600 cursor-pointer"
              />
              <span className="font-bold text-brand-900">
                GROHE Germany (جروهي ألمانيا)
              </span>
            </label>
          </div>
        )}
      </div>
    </aside>
  );
}
