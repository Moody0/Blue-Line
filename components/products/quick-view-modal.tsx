"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Check, ShoppingBag, ArrowLeft, Star, Layers } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-context";
import { ProductVisual } from "./product-visual";
import type { Product, ProductVariant } from "@/types/ecommerce";

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

/** Helper to clean raw HTML description */
function cleanDescription(raw?: string): string {
  if (!raw) return "";
  return raw
    .replace(/<[^>]*>/g, " ")
    .replace(/Faster\s*Grohe/gi, "")
    .replace(/فاستر\s*جروهي/gi, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const { addItem, openDrawer } = useCart();
  const [mounted, setMounted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isJustAdded, setIsJustAdded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const variants = product.variants ?? [];
  const defaultVariant = variants.find((v) => v.is_default) ?? variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    defaultVariant?.id ?? ""
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSelectedVariantId(defaultVariant?.id ?? "");
      setSelectedImageIndex(0);
      setQuantity(1);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, defaultVariant]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const selectedVariant: ProductVariant | undefined = useMemo(() => {
    return variants.find((v) => v.id === selectedVariantId) ?? defaultVariant;
  }, [variants, selectedVariantId, defaultVariant]);

  const effectivePrice =
    selectedVariant?.price_override ??
    product.discount_price ??
    product.base_price;

  const originalPrice = product.base_price;
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

  const galleryImages = useMemo(() => {
    if (selectedVariant?.image_urls && selectedVariant.image_urls.length > 0) {
      return selectedVariant.image_urls;
    }
    const allVariantImages = variants
      .map((v) => v.image_urls?.[0])
      .filter(Boolean) as string[];
    if (allVariantImages.length > 1) {
      return allVariantImages;
    }
    return [selectedVariant?.image_urls?.[0] || "default"];
  }, [selectedVariant, variants]);

  const descriptionSnippet = useMemo(() => {
    return cleanDescription(product.description_ar);
  }, [product.description_ar]);

  const handleAddToCart = () => {
    addItem(product, selectedVariant?.id, quantity);
    setIsJustAdded(true);
    setTimeout(() => {
      setIsJustAdded(false);
      onClose();
      openDrawer();
    }, 600);
  };

  const router = useRouter();

  const handleBuyNow = () => {
    addItem(product, selectedVariant?.id, quantity, false);
    onClose();
    router.push("/checkout");
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-alexandria select-none"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-y-auto border border-border-default transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق المعاينة السريعة"
          className="absolute top-4 start-4 z-20 w-10 h-10 rounded-full bg-surface-100 hover:bg-surface-200 text-text-secondary hover:text-brand-900 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
        >
          <X size={18} />
        </button>

        {/* Modal 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 p-6 sm:p-8 pb-10 items-start">
          {/* ── 1. Left/Right Image Gallery Column ── */}
          <div className="space-y-4">
            {/* Main Visual Box (Full size fitting) */}
            <div className="relative aspect-[1/1] w-full bg-white rounded-2xl border border-border-default/80 flex items-center justify-center overflow-hidden shadow-xs">
              {/* Badges */}
              <div className="absolute top-3.5 end-3.5 flex flex-col items-start gap-1 z-10 pointer-events-none">
                {hasDiscount && (
                  <span className="w-fit self-start inline-block bg-[#1E6091] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                    وفر {discountPct}٪
                  </span>
                )}
                {product.brand && (
                  <span className="w-fit self-start inline-block bg-brand-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {product.brand}
                  </span>
                )}
              </div>

              {typeof galleryImages[selectedImageIndex] === "string" &&
              galleryImages[selectedImageIndex] !== "default" ? (
                <Image
                  src={galleryImages[selectedImageIndex] as string}
                  alt={product.title_ar}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-contain scale-110 sm:scale-120 transition-transform duration-300 p-2"
                />
              ) : (
                <ProductVisual
                  sku={product.sku}
                  finishColor={selectedVariant?.hex_color || "#D4D4D8"}
                  productType={product.product_type}
                  className="w-full h-full p-2"
                />
              )}
            </div>

            {/* Thumbnails (with comfortable padding so borders never cut off) */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2 px-1">
                {galleryImages.map((thumb: string, idx: number) => {
                  const isSelected = selectedImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      aria-label={`صورة ${idx + 1}`}
                      className={cn(
                        "w-18 h-18 shrink-0 bg-[#F8FAFC] rounded-xl border flex items-center justify-center p-1 transition-all cursor-pointer overflow-hidden relative shadow-2xs",
                        isSelected
                          ? "border-[#1E6091] ring-2 ring-[#1E6091]/30 scale-105"
                          : "border-border-default/70 opacity-70 hover:opacity-100 hover:border-brand-900"
                      )}
                    >
                      <Image
                        src={thumb}
                        alt={`${product.title_ar} - صورة ${idx + 1}`}
                        fill
                        sizes="72px"
                        className="object-contain mix-blend-multiply scale-110"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── 2. Product Details & Controls Column ── */}
          <div className="space-y-4 pt-1">
            {/* Category & Title */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#1E6091] block">
                {product.category?.name_ar || "أدوات صحية"}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-brand-900 leading-snug">
                {product.title_ar}
              </h3>
            </div>

            {/* Price Row */}
            <div className="flex flex-wrap items-baseline gap-2.5">
              <span className="text-xl sm:text-2xl font-extrabold text-brand-900">
                {formatPrice(effectivePrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xs text-text-muted line-through font-medium">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    وفر {formatPrice(originalPrice - (product.discount_price || 0))}
                  </span>
                </>
              )}
            </div>

            {/* Stock status */}
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-3 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                متوفر في المخزون
              </span>
            </div>

            {/* Description Snippet (if available) */}
            {descriptionSnippet && (
              <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                {descriptionSnippet}
              </p>
            )}

            {/* Real Variant Color Swatches (if available) */}
            {variants.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border-default/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-text-primary">
                    الطلاء واللون:{" "}
                    <span className="text-[#1E6091]">
                      {selectedVariant?.finish_name || "كروم لامع StarLight"}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2.5 pt-0.5">
                  {variants.map((v) => {
                    const isSelected = v.id === selectedVariant?.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={cn(
                          "w-8 h-8 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center shadow-2xs",
                          isSelected
                            ? "ring-2 ring-offset-2 ring-[#1E6091] scale-110"
                            : "opacity-80 hover:opacity-100 hover:scale-105"
                        )}
                        style={{ backgroundColor: v.hex_color || "#D4D4D8" }}
                        title={v.finish_name}
                      >
                        {isSelected && (
                          <Check
                            size={12}
                            className={
                              v.hex_color === "#FAFAFA" ||
                              v.hex_color === "#D4D4D8"
                                ? "text-black"
                                : "text-white"
                            }
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Purchasing Stepper & Buttons */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-stretch gap-2.5">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-border-default rounded-xl bg-surface-50 w-28 shrink-0 px-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="تقليل الكمية"
                    className="w-8 h-11 flex items-center justify-center text-text-secondary hover:text-brand-900 cursor-pointer font-bold text-base"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-xs font-bold font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="زيادة الكمية"
                    className="w-8 h-11 flex items-center justify-center text-text-secondary hover:text-brand-900 cursor-pointer font-bold text-base"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-11 bg-[#1E6091] hover:bg-brand-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow cursor-pointer"
                >
                  {isJustAdded ? (
                    <>
                      <Check size={16} />
                      <span>تمت الإضافة ✓</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>أضف إلى السلة</span>
                    </>
                  )}
                </button>
              </div>

              {/* Buy Now */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-11 border-2 border-brand-900 hover:bg-brand-900 hover:text-white text-brand-900 font-bold text-xs rounded-xl flex items-center justify-center transition-all cursor-pointer"
              >
                شراء فوري الآن
              </button>
            </div>

            {/* Metadata and Full Details Link */}
            <div className="pt-3 border-t border-border-default/60 flex items-center justify-between text-xs">
              <div className="text-text-muted text-[11px] space-y-0.5">
                <p>كود الموديل (SKU): <strong className="text-brand-900 font-mono">{product.sku}</strong></p>
                <p>العلامة التجارية: <strong className="text-brand-900">GROHE Germany</strong></p>
              </div>

              <Link
                href={`/product/${product.slug || product.sku}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1E6091] hover:underline"
              >
                <span>عرض التفاصيل الكاملة</span>
                <ArrowLeft size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
