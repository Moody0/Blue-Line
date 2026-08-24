"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowLeft, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import { useCart } from "./cart-context";
import { formatPrice } from "@/lib/formatters";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const FREE_SHIPPING_THRESHOLD = 5000;

export function CartDrawer() {
  const {
    items,
    cartCount,
    subtotal,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
  } = useCart();

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-full sm:max-w-md bg-white p-0 flex flex-col justify-between font-alexandria select-none"
        dir="rtl"
      >
        {/* Top Header with Close Button */}
        <div className="p-5 border-b border-border-default flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#1E6091]" />
            <h2 className="text-base font-extrabold text-brand-900">
              سلة المشتريات
            </h2>
            {cartCount > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-surface-100 text-brand-900">
                {cartCount} منتجات
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            aria-label="إغلاق السلة"
            className="w-9 h-9 rounded-full bg-surface-100 hover:bg-surface-200 text-text-secondary hover:text-brand-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          /* ── Minimal Luxury Empty State Matching Reference ── */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <h3 className="text-2xl font-extrabold text-brand-900 tracking-tight">
              سلة المشتريات فارغة
            </h3>

            <button
              type="button"
              onClick={closeDrawer}
              className="w-full max-w-xs h-12 bg-[#1E6091] hover:bg-brand-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              متابعة التسوق
            </button>

            <div className="space-y-1 text-xs pt-4">
              <p className="font-bold text-brand-900">هل لديك حساب معنا؟</p>
              <p className="text-text-muted">
                <Link
                  href="/auth/login"
                  onClick={closeDrawer}
                  className="text-[#1E6091] hover:underline font-bold"
                >
                  تسجيل الدخول
                </Link>{" "}
                لإتمام طلبك ومتابعة شحناتك بشكل أسرع.
              </p>
            </div>
          </div>
        ) : (
          /* ── Populated Cart Content ── */
          <>
            {/* Free Shipping Progress Indicator */}
            <div className="p-4 bg-surface-50 border-b border-border-default space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5 text-text-secondary">
                  <Truck size={15} className="text-[#1E6091]" />
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-bold">
                      تهانينا! لقد حصلت على توصيل مجاني 🎉
                    </span>
                  ) : (
                    <span>
                      أضف بقيمة{" "}
                      <strong className="text-brand-900 font-bold">
                        {formatPrice(remainingForFreeShipping)}
                      </strong>{" "}
                      للشحن المجاني
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-brand-900 font-mono">
                  {freeShippingProgress}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-200 overflow-hidden">
                <div
                  className="h-full bg-[#1E6091] transition-all duration-300 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 divide-y divide-border-default">
              {items.map((item) => {
                const product = item.product;
                if (!product) return null;

                const variant =
                  item.variant ??
                  product.variants?.find((v) => v.id === item.variant_id);

                const image =
                  variant?.image_urls?.[0] ||
                  product.variants?.[0]?.image_urls?.[0] ||
                  "/images/promo/shower-banner.jpg";

                const price =
                  variant?.price_override ??
                  product.discount_price ??
                  product.base_price;

                return (
                  <div key={item.id} className="py-4 flex gap-3.5 first:pt-0 last:pb-0">
                    {/* Thumbnail */}
                    <div className="relative w-18 h-18 shrink-0 bg-[#F8FAFC] rounded-xl overflow-hidden p-1 border border-border-default/50">
                      <Image
                        src={image}
                        alt={product.title_ar}
                        fill
                        sizes="72px"
                        className="object-contain p-1"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-brand-900 line-clamp-2 leading-snug">
                            {product.title_ar}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-text-muted hover:text-destructive p-1 transition-colors cursor-pointer"
                            aria-label="حذف المنتج"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        {variant?.finish_name && (
                          <span className="text-[11px] text-text-muted block">
                            اللون: {variant.finish_name}
                          </span>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-border-default rounded-lg bg-surface-50 h-8 px-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-full flex items-center justify-center text-text-secondary hover:text-brand-900 cursor-pointer font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-full flex items-center justify-center text-text-secondary hover:text-brand-900 cursor-pointer font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-extrabold text-brand-900">
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary & Checkout */}
            <div className="p-5 bg-surface-50 border-t border-border-default space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-text-secondary">المجموع الفرعي:</span>
                <span className="text-lg font-extrabold text-brand-900 font-mono">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full h-12 bg-brand-900 hover:bg-[#1E6091] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  إتمام الشراء الآن
                </Link>

                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full h-10 border border-border-default hover:bg-surface-100 text-brand-900 font-bold text-xs rounded-xl flex items-center justify-center transition-colors"
                >
                  عرض تفاصيل السلة
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
