"use client";

import Link from "next/link";
import { Heart, ShoppingBag, ArrowLeft, Trash2, ArrowRight } from "lucide-react";
import { useFavorites } from "./favorites-context";
import { useCart } from "@/components/cart/cart-context";
import { ProductCard } from "@/components/products/product-card";
import { NAV_CATEGORIES } from "@/lib/constants";

export function FavoritesView() {
  const { favorites, favoritesCount, isLoaded, clearFavorites } = useFavorites();
  const { addItem, openDrawer } = useCart();

  const handleAddAllToCart = () => {
    favorites.forEach((product) => {
      addItem(product, undefined, 1, false);
    });
    openDrawer();
  };

  // If favorites are still loading from storage, show clean skeleton
  if (!isLoaded) {
    return (
      <div className="space-y-8 animate-pulse font-alexandria" dir="rtl">
        <div className="h-8 w-48 bg-surface-200 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] bg-surface-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Refined Luxury Empty State
  if (favorites.length === 0) {
    return (
      <div className="py-12 sm:py-16 font-alexandria select-none" dir="rtl">
        <div className="max-w-xl mx-auto bg-white border border-border-default/90 rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-6">
          {/* Central Heart Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-surface-100 border border-border-default flex items-center justify-center mx-auto text-text-muted">
            <Heart size={32} className="text-text-muted/60" strokeWidth={1.8} />
          </div>

          {/* Heading & Explanation */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-brand-900 tracking-tight text-center">
              قائمة المفضلة فارغة حالياً
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed text-center max-w-md mx-auto">
              لم تقم بحفظ أي منتجات بعد. اضغط على أيقونة القلب على أي قطعة لحفظها هنا ومقارنة الأسعار والمواصفات بسهولة.
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="flex justify-center pt-1">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-brand-900 hover:bg-[#1E6091] text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>استكشف جميع المنتجات</span>
              <ArrowLeft size={14} />
            </Link>
          </div>

          {/* Divider */}
          <div className="relative pt-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-default/60" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-text-muted text-[11px] font-semibold">
                أو تصفح الأقسام الأكثر طلباً
              </span>
            </div>
          </div>

          {/* Quick Category Discovery Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-3.5 py-1.5 rounded-full bg-surface-50 border border-border-default text-xs font-bold text-brand-900 hover:border-[#1E6091] hover:bg-white hover:text-[#1E6091] transition-all shadow-2xs"
              >
                {cat.nameAr}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Populated Favorites State
  return (
    <div className="space-y-8 font-alexandria select-none" dir="rtl">
      {/* Header Bar with Counter & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-default">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-900 tracking-tight">
              المنتجات المفضلة
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1E6091] text-white text-xs font-bold font-mono shadow-2xs">
              {favoritesCount}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-muted">
            القطع والتصميمات التي قمت بحفظها للمقارنة أو الشراء اللاحق
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddAllToCart}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-900 hover:bg-[#1E6091] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <ShoppingBag size={15} />
            <span>إضافة الكل إلى السلة</span>
          </button>

          <button
            type="button"
            onClick={clearFavorites}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border-default text-xs font-semibold text-text-muted hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
            aria-label="تفريغ المفضلة"
          >
            <Trash2 size={14} />
            <span>مسح الكل</span>
          </button>
        </div>
      </div>

      {/* Grid of Saved Favorite Products */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} viewMode="grid" />
        ))}
      </div>
    </div>
  );
}
