"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  Share2,
  ShoppingBag,
  Check,
  ShieldCheck,
  Layers,
  Maximize2,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-context";
import { useFavorites } from "@/components/favorites/favorites-context";
import { ProductVisual } from "./product-visual";
import { ProductCard } from "./product-card";
import type { Product, ProductVariant } from "@/types/ecommerce";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts?: Product[];
}

/** Parse and clean the authentic database description */
function parseProductDetails(raw?: string) {
  if (!raw) {
    return {
      descriptionText: "",
      specItems: [] as { label: string; value: string }[],
    };
  }

  // Remove HTML tags and scraper signatures
  const sanitized = raw
    .replace(/<[^>]*>/g, "\n")
    .replace(/Faster\s*Grohe/gi, "")
    .replace(/فاستر\s*جروهي/gi, "")
    .replace(/&nbsp;/g, " ")
    .trim();

  const lines = sanitized
    .split("\n")
    .map((l) => l.trim().replace(/^[•\-\*]\s*/, ""))
    .filter(Boolean);

  const specItems: { label: string; value: string }[] = [];
  const narrativeLines: string[] = [];

  for (const line of lines) {
    if (line.includes(":") || line.includes("：")) {
      const [label, ...valParts] = line.split(/[:：]/);
      const cleanLabel = label.replace("المميزات الرئيسية", "").trim();
      const cleanVal = valParts.join(":").trim();
      if (cleanLabel && cleanVal && !cleanLabel.includes("Faster")) {
        specItems.push({ label: cleanLabel, value: cleanVal });
        continue;
      }
    }
    if (
      line.length > 5 &&
      !line.includes("المميزات الرئيسية") &&
      !line.includes("Faster")
    ) {
      narrativeLines.push(line);
    }
  }

  return {
    descriptionText: narrativeLines.join(" "),
    specItems,
  };
}

export function ProductDetailView({
  product,
  relatedProducts = [],
}: ProductDetailViewProps) {
  const { addItem, openDrawer } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isWishlisted = isFavorite(product.id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isJustAdded, setIsJustAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const variants = product.variants ?? [];
  const defaultVariant = variants.find((v) => v.is_default) ?? variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    defaultVariant?.id ?? ""
  );

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

  // Authentic product images from database
  const galleryThumbnails = useMemo(() => {
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

  // Clean data-driven description and specifications
  const { descriptionText, specItems } = useMemo(() => {
    return parseProductDetails(product.description_ar);
  }, [product.description_ar]);

  const handleAddToCart = () => {
    addItem(product, selectedVariant?.id, quantity);
    setIsJustAdded(true);
    openDrawer();
    setTimeout(() => setIsJustAdded(false), 2000);
  };

  const router = useRouter();

  const handleBuyNow = () => {
    addItem(product, selectedVariant?.id, quantity, false);
    router.push("/checkout");
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Keyboard navigation for Lightbox
  const handlePrevImage = useCallback(() => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? galleryThumbnails.length - 1 : prev - 1
    );
  }, [galleryThumbnails.length]);

  const handleNextImage = useCallback(() => {
    setSelectedImageIndex((prev) =>
      prev === galleryThumbnails.length - 1 ? 0 : prev + 1
    );
  }, [galleryThumbnails.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        handleNextImage();
      } else if (e.key === "ArrowRight") {
        handlePrevImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, handleNextImage, handlePrevImage]);

  const currentImageSrc = galleryThumbnails[selectedImageIndex];
  const hasRealImage =
    typeof currentImageSrc === "string" && currentImageSrc !== "default";

  return (
    <div className="space-y-16 pb-12 font-alexandria" dir="rtl">
      {/* ── 1. Main Product Section (Clean 2-Column Desktop / Responsive Mobile) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
        {/* ── Image Gallery (Desktop & Mobile - Sticky on Desktop) ── */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 xl:top-28 self-start flex flex-col gap-4">
          {/* Main Visual Image Canvas (Clickable to Open Fullscreen Lightbox) */}
          <div
            onClick={() => setIsLightboxOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="تكبير وعرض صورة المنتج بالحجم الكامل"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsLightboxOpen(true);
              }
            }}
            className="relative aspect-[1/1] w-full bg-white border border-border-default/80 rounded-2xl flex items-center justify-center overflow-hidden group shadow-xs cursor-zoom-in transition-all hover:border-[#1E6091]/40"
          >
            {/* Top Badges */}
            <div className="absolute top-4 start-4 flex flex-col items-start gap-1.5 z-20 pointer-events-none">
              {hasDiscount && (
                <span className="w-fit self-start inline-block bg-[#1E6091] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  وفر {discountPct}٪
                </span>
              )}
              {product.brand && (
                <span className="w-fit self-start inline-block bg-brand-900 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  {product.brand}
                </span>
              )}
            </div>

            {/* Click to Expand Floating Icon Button */}
            <div className="absolute bottom-3.5 end-3.5 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs border border-border-default shadow-xs flex items-center justify-center text-brand-900 opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all">
              <Maximize2 size={16} />
            </div>

            {/* Primary Visual Image */}
            {hasRealImage ? (
              <Image
                src={currentImageSrc as string}
                alt={product.title_ar}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain scale-110 sm:scale-120 transition-transform duration-500 ease-out group-hover:scale-125 p-2"
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

          {/* Thumbnail Strip (Only rendered when multi-images exist in DB) */}
          {galleryThumbnails.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 px-1">
              {galleryThumbnails.map((thumb: string, idx: number) => {
                const isSelected = selectedImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(idx);
                    }}
                    aria-label={`صورة ${idx + 1}`}
                    className={cn(
                      "w-20 h-20 shrink-0 bg-[#F8FAFC] rounded-xl border flex items-center justify-center p-1 transition-all cursor-pointer overflow-hidden relative shadow-2xs",
                      isSelected
                        ? "border-[#1E6091] ring-2 ring-[#1E6091]/30 shadow-xs scale-105"
                        : "border-border-default/60 opacity-70 hover:opacity-100 hover:border-border-strong"
                    )}
                  >
                    <Image
                      src={thumb}
                      alt={`${product.title_ar} - صورة ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-contain mix-blend-multiply scale-110"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Product Information & Specifications ── */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header Metadata */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-accent-600">
                {product.category?.name_ar || "خلاطات مياه فاخرة"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full border border-border-default/80 flex items-center justify-center text-text-muted hover:text-brand-900 transition-colors"
                  aria-label="مشاركة الرابط"
                >
                  <Share2 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(product)}
                  className={cn(
                    "w-9 h-9 rounded-full border border-border-default/80 flex items-center justify-center transition-colors",
                    isWishlisted
                      ? "text-red-500 bg-red-50 border-red-200"
                      : "text-text-muted hover:text-brand-900"
                  )}
                  aria-label="إضافة للمفضلة"
                >
                  <Heart
                    size={16}
                    className={isWishlisted ? "fill-current" : ""}
                  />
                </button>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-900 leading-snug">
              {product.title_ar}
            </h1>

            <p className="text-xs font-mono text-text-muted">
              كود الموديل: {product.sku}
            </p>

            {copiedLink && (
              <span className="inline-block text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                تم نسخ رابط المنتج بنجاح ✓
              </span>
            )}
          </div>

          {/* Pricing Section (Clean, Open & High-End) */}
          <div className="space-y-1.5 py-1 text-start">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-900 tracking-tight">
                {formatPrice(effectivePrice)}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-sm font-medium text-text-muted line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    وفر {formatPrice(originalPrice - (product.discount_price || 0))}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Color & Finish Swatches */}
          {variants.length > 1 && (
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                <Layers size={14} className="text-[#1E6091]" />
                <span>اللون والتشطيب المختار:</span>
                <span className="text-[#1E6091] font-semibold">
                  {selectedVariant?.finish_name || "كروم لامع"}
                </span>
              </label>

              <div className="flex flex-wrap gap-2.5">
                {variants.map((v) => {
                  const isSelected = v.id === selectedVariantId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                        isSelected
                          ? "border-[#1E6091] bg-white ring-2 ring-[#1E6091]/20 shadow-xs text-brand-900"
                          : "border-border-default bg-white/70 hover:border-border-strong text-text-secondary"
                      )}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: v.hex_color || "#D4D4D8" }}
                      />
                      <span>{v.finish_name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-border-default rounded-xl bg-white h-12 px-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg hover:bg-surface-100 flex items-center justify-center text-text-secondary hover:text-brand-900 font-bold"
                  aria-label="تقليل الكمية"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-xs text-brand-900 font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-lg hover:bg-surface-100 flex items-center justify-center text-text-secondary hover:text-brand-900 font-bold"
                  aria-label="زيادة الكمية"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={cn(
                  "flex-1 h-12 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs",
                  isJustAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-[#1E6091] hover:bg-brand-900 text-white"
                )}
              >
                {isJustAdded ? (
                  <>
                    <Check size={16} />
                    <span>تمت الإضافة للسلة ✓</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>أضف إلى السلة</span>
                  </>
                )}
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full h-12 border-2 border-brand-900 hover:bg-brand-900 hover:text-white text-brand-900 font-bold text-xs rounded-xl flex items-center justify-center transition-all cursor-pointer"
            >
              شراء فوري الآن
            </button>
          </div>

          {/* Authentic Specifications & Details Table */}
          <div className="pt-6 border-t border-border-default space-y-4 text-start">
            <h3 className="text-sm font-extrabold text-brand-900">
              المواصفات الفنية والخصائص
            </h3>

            {descriptionText && (
              <p className="text-xs text-text-secondary leading-relaxed">
                {descriptionText}
              </p>
            )}

            {/* Clean Specifications Table */}
            <div className="border-t border-b border-border-default divide-y divide-border-default/60 text-xs">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-text-muted font-medium">العلامة التجارية</span>
                <span className="text-brand-900 font-semibold">
                  {product.brand ? `${product.brand} (أصلي ومعتمد)` : "منتج أصلي معتمد"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-text-muted font-medium">الضمان المعتمد</span>
                <span className="text-emerald-700 font-bold">
                  {product.warranty_years || 5} سنوات ضمان شامل
                </span>
              </div>

              {specItems.map((spec, idx) => (
                <div key={idx} className="flex items-center justify-between py-2.5">
                  <span className="text-text-muted font-medium">{spec.label}</span>
                  <span className="text-brand-900 font-semibold">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. "منتجات ذات صلة" Related Products Section (Real DB items) ── */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8 pt-10 border-t border-border-default">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-900 tracking-tight">
              منتجات ذات صلة
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-text-muted">
              منتجات وموديلات مكملة من نفس القسم
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((related) => (
              <ProductCard key={related.id} product={related} viewMode="grid" />
            ))}
          </div>
        </section>
      )}

      {/* ── 3. Interactive Fullscreen Image Lightbox Modal ── */}
      {isLightboxOpen && mounted && typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none font-alexandria"
            dir="rtl"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Bar with Title & Close Button */}
            <div
              className="flex items-center justify-between z-30 max-w-6xl mx-auto w-full text-white pb-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-0.5 text-start">
                <h3 className="text-sm sm:text-base font-bold truncate max-w-md">
                  {product.title_ar}
                </h3>
                {galleryThumbnails.length > 1 && (
                  <span className="text-xs text-white/60">
                    صورة {selectedImageIndex + 1} من {galleryThumbnails.length}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                aria-label="إغلاق العرض المكبر"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Stage with Zoomed Image and Nav Arrows */}
            <div
              className="relative flex-1 flex items-center justify-center my-auto w-full max-w-5xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous Image Arrow */}
              {galleryThumbnails.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="الصورة السابقة"
                  className="absolute start-2 sm:start-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronRight size={24} />
                </button>
              )}

              {/* Main Expanded Image Container */}
              <div className="relative w-full h-[65vh] sm:h-[75vh] flex items-center justify-center p-4">
                {hasRealImage ? (
                  <Image
                    src={currentImageSrc as string}
                    alt={product.title_ar}
                    fill
                    priority
                    sizes="100vw"
                    className="object-contain transition-transform duration-300 select-none scale-100 sm:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ProductVisual
                      sku={product.sku}
                      finishColor={selectedVariant?.hex_color || "#D4D4D8"}
                      productType={product.product_type}
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>

              {/* Next Image Arrow */}
              {galleryThumbnails.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="الصورة التالية"
                  className="absolute end-2 sm:end-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
            </div>

            {/* Bottom Thumbnails Strip for Multi-Images */}
            {galleryThumbnails.length > 1 && (
              <div
                className="z-30 flex items-center justify-center gap-3 overflow-x-auto no-scrollbar py-2 max-w-xl mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {galleryThumbnails.map((thumb: string, idx: number) => {
                  const isSelected = selectedImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      aria-label={`عرض صورة ${idx + 1}`}
                      className={cn(
                        "w-16 h-16 shrink-0 rounded-xl bg-white/10 border p-1 transition-all cursor-pointer overflow-hidden relative",
                        isSelected
                          ? "border-[#1E6091] ring-2 ring-[#1E6091] scale-105 bg-white"
                          : "border-white/20 opacity-60 hover:opacity-100"
                      )}
                    >
                      <Image
                        src={thumb}
                        alt={`صورة ${idx + 1}`}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
