"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Truck, ArrowLeft, Tag, Check } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface OrderSummaryProps {
  subtotal: number;
  showCheckoutButton?: boolean;
  className?: string;
}

const FREE_SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING_FEE = 150;

export function OrderSummary({
  subtotal,
  showCheckoutButton = true,
  className,
}: OrderSummaryProps) {
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = subtotal > 0 ? (isFreeShipping ? 0 : STANDARD_SHIPPING_FEE) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    // Example luxury promo code: BLUELINE10 for 10% off
    if (promoCode.trim().toUpperCase() === "BLUELINE10") {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setAppliedPromo("BLUELINE10 (خصم ١٠٪)");
      setPromoCode("");
    } else {
      alert("رمز القسيمة غير صالح أو منتهي الصلاحية.");
    }
  };

  return (
    <div
      className={cn(
        "rounded-3xl bg-surface-50 border border-border-default p-6 space-y-6 self-start",
        className
      )}
    >
      <h3 className="text-base font-bold text-brand-900">ملخص الطلب</h3>

      {/* Breakdown */}
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between text-text-secondary">
          <span>المجموع الفرعي للمنتجات:</span>
          <span className="font-bold text-text-primary">{formatPrice(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-success">
            <span>خصم القسيمة ({appliedPromo}):</span>
            <span className="font-bold">-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Truck size={14} className="text-accent-600" />
            <span>الشحن والتوصيل المؤمن:</span>
          </span>
          <span>
            {isFreeShipping ? (
              <span className="text-success font-bold">شحن مجاني</span>
            ) : (
              <span className="font-bold text-text-primary">
                {formatPrice(shippingFee)}
              </span>
            )}
          </span>
        </div>

        <Separator />

        <div className="flex items-center justify-between text-sm pt-1">
          <span className="font-bold text-brand-900">المجموع الإجمالي:</span>
          <span className="text-lg font-extrabold text-brand-900">
            {formatPrice(grandTotal)}
          </span>
        </div>
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApplyPromo} className="flex gap-2">
        <div className="relative flex-1">
          <Tag
            size={14}
            className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <Input
            placeholder="كود الخصم (مثال: BLUELINE10)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="ps-8 text-xs bg-white border-border-default h-10 rounded-xl"
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          className="h-10 px-4 text-xs font-semibold rounded-xl shrink-0 border-border-strong hover:bg-brand-900 hover:text-white"
        >
          تطبيق
        </Button>
      </form>

      {/* Checkout Button */}
      {showCheckoutButton && subtotal > 0 && (
        <Link
          href="/checkout"
          className={cn(
            buttonVariants({ size: "lg" }),
            "w-full bg-brand-900 hover:bg-brand-800 text-white rounded-xl h-12 text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
          )}
        >
          <span>متابعة الشراء وإنهاء الطلب</span>
          <ArrowLeft size={16} />
        </Link>
      )}

      {/* Trust & Guarantee Box */}
      <div className="pt-2 border-t border-border-default space-y-2 text-[11px] text-text-muted">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-accent-600 shrink-0" />
          <span>ضمان أصلي شامل معتمد من الشركة</span>
        </div>
        <div className="flex items-center gap-2">
          <Check size={14} className="text-accent-600 shrink-0" />
          <span>إمكانية الاسترجاع والاستبدال خلال ١٤ يوماً</span>
        </div>
      </div>
    </div>
  );
}
