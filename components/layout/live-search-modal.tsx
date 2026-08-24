"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, ArrowLeft, Loader2 } from "lucide-react";
import { searchCatalog } from "@/actions/catalog";
import { formatPrice } from "@/lib/formatters";
import type { Product } from "@/types/ecommerce";

interface LiveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SUGGESTIONS = [
  "خلاط بانيو دفن",
  "خلاط حوض جروهي",
  "شاور دفن يوروسمارت",
  "خلاط مطبخ سحب",
  "13262000",
  "13304000",
];

export function LiveSearchModal({ isOpen, onClose }: LiveSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchCatalog(query.trim());
        setResults(data.slice(0, 6));
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    });
  };

  const handleSuggestionClick = (text: string) => {
    setQuery(text);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-start items-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-alexandria"
      dir="rtl"
      onClick={onClose}
    >
      {/* Search Header Container */}
      <div
        className="w-full bg-white shadow-2xl border-b border-border-default transition-all duration-300 animate-in slide-in-from-top-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
          {/* Top Bar with Title and Close Button */}
          <div className="flex items-center justify-between">
            <div className="w-9" /> {/* Spacer */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-900 text-center tracking-tight">
              عن ماذا تبحث؟
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق البحث"
              className="w-9 h-9 rounded-full bg-surface-100 hover:bg-surface-200 text-text-secondary hover:text-brand-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Input Box */}
          <form onSubmit={handleSubmit} className="relative">
            <input
              ref={inputRef}
              type="search"
              placeholder="ابحث بالاسم، كود الموديل (SKU)، أو نوع المنتج..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-13 ps-5 pe-12 rounded-xl border-2 border-brand-900/40 bg-surface-50 focus:bg-white text-sm font-bold text-brand-900 placeholder:text-text-muted focus:border-brand-900 focus:outline-none transition-all shadow-xs"
            />
            <div className="absolute end-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {loading ? (
                <Loader2 size={18} className="animate-spin text-[#1E6091]" />
              ) : query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="مسح النص"
                  className="text-text-muted hover:text-brand-900 p-1 cursor-pointer"
                >
                  <X size={16} />
                </button>
              ) : (
                <Search size={20} className="text-text-muted" />
              )}
            </div>
          </form>

          {/* Search Dropdown / Live Results Body */}
          {query.trim() ? (
            <div className="space-y-4 pt-2 max-h-[60vh] overflow-y-auto divide-y divide-border-default">
              {/* Product Matches */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-text-muted tracking-wider">
                  المنتجات ({results.length})
                </p>

                {results.length === 0 && !loading ? (
                  <p className="text-xs text-text-secondary py-6 text-center">
                    لا توجد منتجات مطابقة لكلمة البحث &quot;{query}&quot;.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.map((prod) => {
                      const image =
                        prod.variants?.[0]?.image_urls?.[0] ||
                        "/images/promo/shower-banner.jpg";
                      const price = prod.discount_price ?? prod.base_price;
                      const hasDiscount = Boolean(
                        prod.discount_price &&
                          prod.discount_price < prod.base_price
                      );

                      return (
                        <Link
                          key={prod.id}
                          href={`/product/${prod.slug || prod.sku}`}
                          onClick={onClose}
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-border-default/60 hover:border-brand-900 bg-white hover:bg-surface-50 transition-all group"
                        >
                          <div className="relative w-16 h-16 shrink-0 bg-white rounded-xl overflow-hidden border border-border-default/60 shadow-2xs">
                            <Image
                              src={image}
                              alt={prod.title_ar}
                              fill
                              sizes="64px"
                              className="object-contain scale-115 group-hover:scale-125 transition-transform"
                            />
                          </div>

                          <div className="flex-1 min-w-0 space-y-0.5">
                            <span className="text-[10px] font-bold text-[#1E6091] block">
                              GROHE (SKU: {prod.sku})
                            </span>
                            <h4 className="text-xs font-bold text-brand-900 line-clamp-1 group-hover:text-[#1E6091] transition-colors">
                              {prod.title_ar}
                            </h4>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs font-extrabold text-brand-900">
                                {formatPrice(price)}
                              </span>
                              {hasDiscount && (
                                <span className="text-[10px] text-text-muted line-through font-medium">
                                  {formatPrice(prod.base_price)}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* View All Link */}
              {results.length > 0 && (
                <div className="pt-3 text-center">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#1E6091] hover:text-brand-900 transition-colors cursor-pointer py-1"
                  >
                    <span>عرض جميع النتائج لكلمة &quot;{query}&quot;</span>
                    <ArrowLeft size={14} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Default Suggestions */
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-bold text-text-muted tracking-wider">
                عمليات البحث الشائعة
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleSuggestionClick(sug)}
                    className="px-3.5 py-1.5 rounded-full bg-surface-100 hover:bg-brand-900 hover:text-white text-xs font-semibold text-text-secondary transition-all cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
