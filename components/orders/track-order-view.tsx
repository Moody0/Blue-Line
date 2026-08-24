"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  Package,
  Phone,
  Clock,
  CheckCircle2,
  PackageCheck,
  Truck,
  XCircle,
  MessageCircle,
  ArrowLeft,
  Calendar,
  MapPin,
  CreditCard,
  Layers,
} from "lucide-react";
import { trackOrder } from "@/actions/orders";
import { formatPrice, formatDate } from "@/lib/formatters";
import { CONTACT } from "@/lib/constants";
import type { Order, OrderStatus } from "@/types/ecommerce";

const STEPS: { status: OrderStatus; label: string; description: string }[] = [
  {
    status: "confirmed",
    label: "تم التأكيد",
    description: "تم استلام ومراجعة بيانات طلبك بنجاح",
  },
  {
    status: "processing",
    label: "جاري التجهيز",
    description: "يتم فحص وتغليف المنتجات في المستودع",
  },
  {
    status: "shipped",
    label: "تم الشحن",
    description: "الشحنة مع مندوب التوصيل في طريقها إليك",
  },
  {
    status: "delivered",
    label: "تم التوصيل",
    description: "تم تسليم الطلب واستلام المبلغ بنجاح",
  },
];

function getStepIndex(status: OrderStatus): number {
  switch (status) {
    case "pending":
    case "confirmed":
      return 0;
    case "processing":
      return 1;
    case "shipped":
      return 2;
    case "delivered":
      return 3;
    case "cancelled":
      return -1;
    default:
      return 0;
  }
}

export function TrackOrderView() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [resultOrder, setResultOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setResultOrder(null);

    startTransition(async () => {
      const res = await trackOrder(orderNumber, phone);
      if (res.error) {
        setErrorMessage(res.error);
      } else if (res.order) {
        setResultOrder(res.order);
      }
    });
  };

  const currentStep = resultOrder ? getStepIndex(resultOrder.status as OrderStatus) : 0;
  const isCancelled = resultOrder?.status === "cancelled";

  const whatsappMessage = resultOrder
    ? encodeURIComponent(`مرحباً بلو لاين، أستفسر عن حالة طلبي رقم: ${resultOrder.order_number}`)
    : "";
  const whatsappUrl = `${CONTACT.whatsappUrl}?text=${whatsappMessage}`;

  return (
    <div className="space-y-8 text-start">
      {/* ── Lookup Form Card ── */}
      <div className="border border-border-default rounded-2xl p-6 sm:p-8 bg-white space-y-6">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-brand-900">
            بيانات الاستعلام عن الطلب
          </h2>
          <p className="text-xs text-text-muted">
            أدخل رقم الطلب المسجل (مثل BL-20260824-1234) ورقم هاتفك المحمول
          </p>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Order Number */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-primary block">
                رقم الطلب
              </label>
              <div className="relative flex items-center">
                <Package
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="BL-20260824-XXXX"
                  dir="ltr"
                  className="w-full h-11 pr-10 pl-3.5 rounded-xl bg-surface-50 border border-border-default text-xs font-mono text-brand-900 focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-primary block">
                رقم الهاتف المحمول
              </label>
              <div className="relative flex items-center">
                <Phone
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01012345678"
                  dir="ltr"
                  className="w-full h-11 pr-10 pl-3.5 rounded-xl bg-surface-50 border border-border-default text-xs font-mono text-brand-900 focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto px-8 h-11 bg-brand-900 hover:bg-[#1E6091] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Search size={14} />
              <span>{isPending ? "جاري البحث عن الشحنة..." : "تتبع حالة الطلب"}</span>
            </button>
          </div>
        </form>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs space-y-2">
            <p className="font-semibold">{errorMessage}</p>
            <div className="text-[11px]">
              هل تحتاج لمساعدة؟{" "}
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline text-rose-900"
              >
                تواصل مع خدمة العملاء عبر واتساب
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ── Order Status Result View ── */}
      {resultOrder && (
        <div className="border border-border-default rounded-2xl p-6 sm:p-8 bg-white space-y-8 animate-in fade-in duration-300">
          {/* Header Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-border-default">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-muted">رقم الشحنة:</span>
                <span className="font-mono font-bold text-sm text-brand-900">
                  {resultOrder.order_number}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Calendar size={13} />
                <span>تاريخ الطلب: {formatDate(resultOrder.created_at)}</span>
              </div>
            </div>

            <div>
              {isCancelled ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 border border-rose-200 text-rose-700">
                  <XCircle size={13} />
                  <span>تم إلغاء الطلب</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
                  <CheckCircle2 size={13} />
                  <span>
                    {STEPS[currentStep]?.label || "قيد المتابعة"}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Clean Stepper Progress */}
          {!isCancelled && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-brand-900">
                مسار وتتبع الشحنة
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {STEPS.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div
                      key={step.status}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent
                          ? "bg-surface-50 border-brand-900"
                          : isDone
                          ? "bg-white border-emerald-200"
                          : "bg-surface-50/50 border-border-default/60 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                            isDone
                              ? "bg-emerald-600 text-white"
                              : "bg-surface-200 text-text-muted"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            isCurrent ? "text-brand-900" : isDone ? "text-emerald-800" : "text-text-muted"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Purchased Items List */}
          {resultOrder.items && resultOrder.items.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-brand-900">
                محتويات الطلب ({resultOrder.items.length} منتجات)
              </h3>
              <div className="border border-border-default rounded-xl divide-y divide-border-default/60 overflow-hidden text-xs">
                {resultOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-brand-900">
                        {item.product_title}
                      </span>
                      {item.variant_name && (
                        <span className="text-text-muted text-[11px] ms-2">
                          ({item.variant_name})
                        </span>
                      )}
                      <span className="text-text-muted font-mono font-semibold ms-2">
                        × {item.quantity}
                      </span>
                    </div>
                    <span className="font-semibold text-brand-900">
                      {formatPrice(item.unit_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery & Financial Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Delivery Info */}
            <div className="p-4 rounded-xl bg-surface-50 border border-border-default/60 space-y-2">
              <span className="font-bold text-brand-900 block flex items-center gap-1.5">
                <MapPin size={13} className="text-[#1E6091]" />
                <span>عنوان التوصيل:</span>
              </span>
              <p className="text-text-secondary leading-relaxed">
                {resultOrder.shipping_address || "تم تسجيل العنوان مع خدمة العملاء"}
              </p>
            </div>

            {/* Financial Info */}
            <div className="p-4 rounded-xl bg-surface-50 border border-border-default/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">طريقة الدفع:</span>
                <span className="font-semibold text-brand-900">
                  {resultOrder.payment_method === "instapay"
                    ? "إنستاباي / فودافون كاش"
                    : "الدفع عند الاستلام (نقداً)"}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-border-default">
                <span className="font-bold text-brand-900">إجمالي المبلغ:</span>
                <span className="text-sm font-extrabold text-brand-900">
                  {formatPrice(resultOrder.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-border-default">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors"
            >
              <MessageCircle size={15} />
              <span>استفسار عن الشحنة عبر واتساب</span>
            </a>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-900 hover:text-[#1E6091] transition-colors"
            >
              <span>متابعة التسوق</span>
              <ArrowLeft size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
