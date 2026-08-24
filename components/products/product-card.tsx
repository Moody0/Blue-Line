"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart, Eye, ShoppingBag, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";
import { useCart } from "@/components/cart/cart-context";
import { useFavorites } from "@/components/favorites/favorites-context";
import { ProductVisual } from "./product-visual";
import { QuickViewModal } from "./quick-view-modal";
import type { Product } from "@/types/ecommerce";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
  className?: string;
}

export function ProductCard({
  product,
  viewMode = "grid",
  className,
}: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isWishlisted = isFavorite(product.id);
  const [isJustAdded, setIsJustAdded] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { addItem } = useCart();

  const variants = product.variants ?? [];
  const defaultVariant = variants.find((v) => v.is_default) ?? variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    defaultVariant?.id ?? ""
  );

  const activeVariant =
    variants.find((v) => v.id === selectedVariantId) ?? defaultVariant;
  const primaryImage =
    activeVariant?.image_urls?.[0] ?? defaultVariant?.image_urls?.[0];

  const hasDiscount = Boolean(
    product.discount_price && product.discount_price < product.base_price
  );
  const discountPct = hasDiscount
    ? Math.round(
        ((product.base_price - (product.discount_price || 0)) /
          product.base_price) *
          100
      )
    : 0;

  const effectivePrice =
    activeVariant?.price_override ??
    product.discount_price ??
    product.base_price;
  const originalPrice = product.base_price;
  const rating = product.rating ?? 5;

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, defaultVariant?.id, 1);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 2000);
  };

  if (viewMode === "list") {
    const cleanDescription = (product.description_ar || "")
      .replace(/<[^>]*>?/gm, "")
      .trim();

    return (
      <article
        className={cn(
          "group relative flex flex-row items-stretch bg-white rounded-xl border border-border-default/60 hover:border-[#1E6091]/50 hover:shadow-md transition-all duration-300 overflow-hidden font-alexandria shadow-2xs",
          className
        )}
        dir="rtl"
      >
        {/* Product Image Box on Pure White */}
        <div className="relative w-28 sm:w-44 md:w-56 shrink-0 bg-white overflow-hidden border-e border-border-default/60 flex items-center justify-center p-2">
          <Link
            href={`/product/${product.slug}`}
            className="relative block w-full h-full overflow-hidden"
            aria-label={product.title_ar}
          >
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={product.title_ar}
                fill
                sizes="(max-width: 640px) 120px, 240px"
                className="object-contain p-1.5 transition-opacity duration-300"
              />
            ) : (
              <ProductVisual
                sku={product.sku}
                finishColor={defaultVariant?.hex_color || "#D4D4D8"}
                productType={product.product_type}
              />
            )}
          </Link>

          {/* Discount Badge on Top-Left */}
          {hasDiscount && (
            <span className="absolute top-2 start-2 bg-[#1E6091] text-white text-[10px] sm:text-[11px] font-bold px-1.5 py-0.2 rounded-xs z-10 shadow-2xs pointer-events-none">
              -{discountPct}٪
            </span>
          )}

          {/* Color Swatches (Desktop only in list view to keep mobile clean) */}
          {variants.length > 1 && (
            <div className="hidden sm:flex absolute bottom-2 start-2 items-center gap-1 z-20 pointer-events-auto bg-white/90 backdrop-blur-xs p-1 rounded-full border border-black/10 shadow-2xs">
              {variants.slice(0, 4).map((v) => {
                const isSelected =
                  v.id === (activeVariant?.id ?? defaultVariant?.id);
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariantId(v.id);
                    }}
                    onMouseEnter={() => setSelectedVariantId(v.id)}
                    title={v.finish_name}
                    aria-label={v.finish_name}
                    className={cn(
                      "w-3 h-3 rounded-full border border-black/25 transition-colors cursor-pointer",
                      isSelected
                        ? "ring-2 ring-[#1E6091] ring-offset-1 shadow-xs"
                        : "opacity-75 hover:opacity-100"
                    )}
                    style={{ backgroundColor: v.hex_color || "#D4D4D8" }}
                  />
                );
              })}
            </div>
          )}

          {/* Quick Action Buttons (Desktop only on hover) */}
          <div className="hidden sm:flex absolute top-2 end-2 flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <button
              type="button"
              onClick={toggleWishlist}
              aria-label="إضافة للمفضلة"
              className={cn(
                "w-7 h-7 rounded-full bg-white shadow-md border border-border-default flex items-center justify-center transition-colors hover:bg-surface-100 cursor-pointer",
                isWishlisted
                  ? "text-destructive bg-destructive/10 border-destructive/30"
                  : "text-text-secondary hover:text-brand-900"
              )}
            >
              <Heart size={14} className={isWishlisted ? "fill-current" : ""} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewOpen(true);
              }}
              aria-label="معاينة سريعة للمنتج"
              className="w-7 h-7 rounded-full bg-white shadow-md border border-border-default flex items-center justify-center text-text-secondary hover:text-brand-900 transition-colors hover:bg-surface-100 cursor-pointer"
            >
              <Eye size={14} />
            </button>
          </div>
        </div>

        {/* Product Details (Responsive & Compact on Mobile) */}
        <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2 text-start min-w-0">
          <div className="space-y-1.5">
            {/* Rating */}
            <div className="flex items-center gap-0.5 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  className={cn(
                    "shrink-0",
                    star <= rating
                      ? "fill-current text-amber-400"
                      : "text-surface-200 fill-surface-200"
                  )}
                />
              ))}
            </div>

            {/* Title */}
            <Link href={`/product/${product.slug}`} className="block group/title">
              <h3 className="text-xs sm:text-base font-bold text-brand-900 group-hover/title:text-[#1E6091] transition-colors leading-snug line-clamp-2">
                {product.title_ar}
              </h3>
            </Link>

            {/* Clean Description without raw HTML tags (Hidden on very small mobile to maximize space) */}
            {cleanDescription && (
              <p className="hidden sm:block text-xs text-text-secondary line-clamp-2 leading-relaxed font-normal">
                {cleanDescription}
              </p>
            )}
          </div>

          {/* Price Row & Add Button */}
          <div className="pt-2 border-t border-border-default/60 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base font-extrabold text-[#1E6091]">
                {formatPrice(effectivePrice)}
              </span>
              {hasDiscount && (
                <span className="text-[10px] sm:text-xs text-text-muted line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleQuickAdd}
              className="h-8 sm:h-9 px-3 sm:px-4 bg-brand-900 hover:bg-[#1E6091] text-white text-[11px] sm:text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              {isJustAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
              <span className="hidden xs:inline">
                {isJustAdded ? "تمت الإضافة" : "أضف للسلة"}
              </span>
            </button>
          </div>
        </div>
      </article>
    );
  }

  // Exact card design in Arabic for grid view
  return (
    <div
      className={cn(
        "group shrink-0 flex flex-col justify-between space-y-4 snap-start font-alexandria",
        className
      )}
      dir="rtl"
    >
      {/* Product Image Box on Pure White */}
      <div className="relative aspect-[1/1] w-full rounded-2xl bg-white overflow-hidden border border-border-default/80 shadow-xs transition-all duration-300">
        {/* Clickable Image Area */}
        <Link
          href={`/product/${product.slug}`}
          className="relative block w-full h-full overflow-hidden"
          aria-label={product.title_ar}
        >
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.title_ar}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-2 transition-opacity duration-300"
            />
          ) : (
            <ProductVisual
              sku={product.sku}
              finishColor={defaultVariant?.hex_color || "#D4D4D8"}
              productType={product.product_type}
            />
          )}
        </Link>

        {/* Discount Badge on Top-Left */}
        {hasDiscount && (
          <span className="absolute top-3 start-3 bg-[#1E6091] text-white text-[11px] font-bold px-2 py-0.5 z-10 shadow-2xs pointer-events-none">
            -{discountPct}٪
          </span>
        )}

        {/* Color Swatches on Bottom-Left if > 1 variant */}
        {variants.length > 1 && (
          <div className="absolute bottom-3 start-3 flex items-center gap-1.5 z-20 pointer-events-auto bg-white/90 backdrop-blur-xs p-1 rounded-full border border-black/10 shadow-2xs">
            {variants.map((v) => {
              const isSelected = v.id === (activeVariant?.id ?? defaultVariant?.id);
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariantId(v.id);
                  }}
                  onMouseEnter={() => setSelectedVariantId(v.id)}
                  title={v.finish_name}
                  aria-label={v.finish_name}
                  className={cn(
                    "w-3.5 h-3.5 rounded-full border border-black/25 transition-colors cursor-pointer",
                    isSelected
                      ? "ring-2 ring-[#1E6091] ring-offset-1 shadow-xs"
                      : "opacity-75 hover:opacity-100"
                  )}
                  style={{ backgroundColor: v.hex_color || "#D4D4D8" }}
                />
              );
            })}
          </div>
        )}

        {/* Floating Action Buttons on Hover (Top-Right Stack) */}
        <div className="absolute top-3 end-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={toggleWishlist}
            aria-label="إضافة للمفضلة"
            className={cn(
              "w-9 h-9 rounded-full bg-white shadow-md border border-border-default flex items-center justify-center transition-colors hover:bg-surface-100 cursor-pointer",
              isWishlisted
                ? "text-destructive bg-destructive/10 border-destructive/30"
                : "text-text-secondary hover:text-brand-900"
            )}
          >
            <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
          </button>

          {/* Quick Add / Cart Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label="إضافة سريعة للسلة"
            className={cn(
              "w-9 h-9 rounded-full bg-white shadow-md border border-border-default flex items-center justify-center transition-colors hover:bg-surface-100 cursor-pointer",
              isJustAdded
                ? "bg-emerald-600 text-white border-emerald-600"
                : "text-text-secondary hover:text-brand-900"
            )}
          >
            {isJustAdded ? <Check size={16} /> : <ShoppingBag size={16} />}
          </button>

          {/* Quick View Modal Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewOpen(true);
            }}
            aria-label="معاينة سريعة للمنتج"
            className="w-9 h-9 rounded-full bg-white shadow-md border border-border-default flex items-center justify-center text-text-secondary hover:text-brand-900 transition-colors hover:bg-surface-100 cursor-pointer"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Product Meta & Details Below Image in Arabic */}
      <div className="space-y-1.5 text-start">
        {/* Rating */}
        <div className="flex items-center gap-0.5 text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={12}
              className={cn(
                "shrink-0",
                star <= rating
                  ? "fill-current text-amber-400"
                  : "text-[#E2E8F0] fill-[#E2E8F0]"
              )}
            />
          ))}
        </div>

        {/* Title (2 lines clamp) in Arabic */}
        <Link
          href={`/product/${product.slug}`}
          className="block group/title"
        >
          <h3 className="text-xs sm:text-sm font-bold text-brand-900 group-hover/title:text-[#1E6091] transition-colors leading-snug line-clamp-2 min-h-[38px]">
            {product.title_ar}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2.5 pt-0.5">
          <span className="text-xs sm:text-base font-extrabold text-[#1E6091]">
            {formatPrice(effectivePrice)}
          </span>
          {hasDiscount && (
            <span className="text-[11px] sm:text-xs text-text-muted line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </div>
  );
}
