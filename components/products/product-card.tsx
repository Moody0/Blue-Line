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
    return (
      <article
        className={cn(
          "group relative flex flex-col sm:flex-row items-stretch bg-white rounded-none border border-border-default/50 hover:border-[#1E6091]/40 hover:shadow-elevated transition-all duration-300 overflow-hidden font-alexandria",
          className
        )}
        dir="rtl"
      >
        {/* Product Image Box on Pure White */}
        <div className="relative sm:w-64 shrink-0 aspect-square sm:aspect-auto bg-white overflow-hidden border-b sm:border-b-0 sm:border-e border-border-default/60 flex items-center justify-center p-2">
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
                sizes="(max-width: 640px) 100vw, 260px"
                className="object-contain scale-110 transition-transform duration-500 ease-out group-hover:scale-118 p-1"
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
                      "w-3.5 h-3.5 rounded-full border border-black/25 transition-all cursor-pointer",
                      isSelected
                        ? "ring-2 ring-[#1E6091] ring-offset-1 scale-110 shadow-xs"
                        : "opacity-75 hover:opacity-100 hover:scale-105"
                    )}
                    style={{ backgroundColor: v.hex_color || "#D4D4D8" }}
                  />
                );
              })}
            </div>
          )}

          {/* Floating Action Buttons on Hover */}
          <div className="absolute top-3 end-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 z-20">
            <button
              type="button"
              onClick={toggleWishlist}
              aria-label="إضافة للمفضلة"
              className={cn(
                "w-8 h-8 rounded-full bg-white shadow-md border border-border-default flex items-center justify-center transition-all hover:scale-110 cursor-pointer",
                isWishlisted
                  ? "text-destructive bg-destructive/10 border-destructive/30"
                  : "text-text-secondary hover:text-brand-900"
              )}
            >
              <Heart size={15} className={isWishlisted ? "fill-current" : ""} />
            </button>
            <button
              type="button"
              onClick={handleQuickAdd}
              aria-label="إضافة سريعة للسلة"
              className={cn(
                "w-8 h-8 rounded-full bg-white shadow-md border border-border-default flex items-center justify-center transition-all hover:scale-110 cursor-pointer",
                isJustAdded
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "text-text-secondary hover:text-brand-900"
              )}
            >
              {isJustAdded ? <Check size={15} /> : <ShoppingBag size={15} />}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewOpen(true);
              }}
              aria-label="معاينة سريعة للمنتج"
              className="w-8 h-8 rounded-full bg-white shadow-md border border-border-default flex items-center justify-center text-text-secondary hover:text-brand-900 transition-all hover:scale-110 cursor-pointer"
            >
              <Eye size={15} />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-start">
          <div className="space-y-2">
            {/* 5-Star Rating matching Top Rated */}
            <div className="flex items-center gap-0.5 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={13}
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
              <h3 className="text-sm sm:text-base font-bold text-brand-900 group-hover/title:text-[#1E6091] transition-colors leading-snug">
                {product.title_ar}
              </h3>
            </Link>

            {/* Description */}
            <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
              {product.description_ar ||
                "خلاط فاخر بتصميم ألماني متميز مع طلاء فائق الجودة وضمان معتمد."}
            </p>
          </div>

          {/* Price Row & Add Button */}
          <div className="pt-3 border-t border-border-default flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-2.5">
              <span className="text-base sm:text-lg font-extrabold text-[#1E6091]">
                {formatPrice(effectivePrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-text-muted line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleQuickAdd}
              className="h-10 px-5 bg-brand-900 hover:bg-[#1E6091] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              {isJustAdded ? <Check size={15} /> : <ShoppingBag size={15} />}
              <span>{isJustAdded ? "تمت الإضافة" : "إضافة للسلة"}</span>
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
              className="object-contain scale-110 sm:scale-118 transition-transform duration-500 ease-out group-hover:scale-125 p-1"
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
                    "w-3.5 h-3.5 rounded-full border border-black/25 transition-all cursor-pointer",
                    isSelected
                      ? "ring-2 ring-[#1E6091] ring-offset-1 scale-110 shadow-xs"
                      : "opacity-75 hover:opacity-100 hover:scale-105"
                  )}
                  style={{ backgroundColor: v.hex_color || "#D4D4D8" }}
                />
              );
            })}
          </div>
        )}

        {/* Floating Action Buttons on Hover (Top-Right Stack) */}
        <div className="absolute top-3 end-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 z-20">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={toggleWishlist}
            aria-label="إضافة للمفضلة"
            className={cn(
              "w-9 h-9 rounded-full bg-white shadow-md border border-border-default flex items-center justify-center transition-all hover:scale-110 cursor-pointer",
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
              "w-9 h-9 rounded-full bg-white shadow-md border border-border-default flex items-center justify-center transition-all hover:scale-110 cursor-pointer",
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
            className="w-9 h-9 rounded-full bg-white shadow-md border border-border-default flex items-center justify-center text-text-secondary hover:text-brand-900 transition-all hover:scale-110 cursor-pointer"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Product Meta & Details Below Image in Arabic */}
      <div className="space-y-1.5 text-start">
        {/* 5-Star Rating */}
        <div className="flex items-center gap-0.5 text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={13}
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
