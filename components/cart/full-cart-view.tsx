"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { useCart } from "./cart-context";
import { CartItemRow } from "./cart-item-row";
import { OrderSummary } from "./order-summary";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FullCartView() {
  const { items, cartCount, subtotal, updateQuantity, removeItem, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-surface-100 flex items-center justify-center mx-auto text-text-muted">
          <ShoppingBag size={36} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-brand-900">
            سلة المشتريات فارغة
          </h1>
          <p className="text-sm text-text-secondary">
            لم تقم بإضافة أي منتجات إلى سلة مشترياتك بعد. تصفح تشكيلاتنا المعمارية واختر ما يناسب حمامك.
          </p>
        </div>
        <Link
          href="/category/faucets"
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-brand-900 hover:bg-brand-800 text-white rounded-xl px-8"
          )}
        >
          استكشف المنتجات الآن
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-default">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-900">
            سلة المشتريات
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            لديك {cartCount} قطعة في سلة مشترياتك
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-xs text-text-muted hover:text-destructive flex items-center gap-1.5"
          >
            <Trash2 size={14} />
            <span>إفراغ السلة</span>
          </Button>

          <Link
            href="/category/faucets"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "text-xs font-semibold rounded-xl"
            )}
          >
            متابعة التسوق
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item Rows (Span 8) */}
        <div className="lg:col-span-8 space-y-3">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        {/* Order Summary Sidebar (Span 4) */}
        <div className="lg:col-span-4 sticky top-24">
          <OrderSummary subtotal={subtotal} showCheckoutButton={true} />
        </div>
      </div>
    </div>
  );
}
