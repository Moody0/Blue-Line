"use client";

import { useEffect } from "react";
import {
  X,
  Phone,
  MapPin,
  Calendar,
  MessageCircle,
  Package,
  CreditCard,
  FileText,
  Truck,
} from "lucide-react";
import type { Order, OrderStatus } from "@/types/ecommerce";
import { formatPrice, formatDate } from "@/lib/formatters";
import { OrderStatusBadge } from "./order-status-badge";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  isUpdating?: boolean;
}

const STATUS_OPTIONS: { value: OrderStatus; labelAr: string }[] = [
  { value: "pending", labelAr: "قيد المراجعة (Pending)" },
  { value: "confirmed", labelAr: "مؤكد (Confirmed)" },
  { value: "processing", labelAr: "جاري التجهيز (Processing)" },
  { value: "shipped", labelAr: "تم الشحن مع المندوب (Shipped)" },
  { value: "delivered", labelAr: "تم التوصيل بنجاح (Delivered)" },
  { value: "cancelled", labelAr: "تم الإلغاء (Cancelled)" },
];

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onStatusChange,
  isUpdating = false,
}: OrderDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const customerPhone =
    order.guest_phone || order.customer?.phone || "";
  const cleanPhone = customerPhone.replace(/[\s\-\(\)\+]/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith("0") ? "2" + cleanPhone : cleanPhone}?text=${encodeURIComponent(
        `مرحباً من متجر بلو لاين، بخصوص طلبك رقم ${order.order_number}`
      )}`
    : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-border-default flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-border-default flex items-center justify-between gap-4 bg-surface-50">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-text-muted">تفاصيل الطلب:</span>
              <span className="font-mono font-bold text-base text-brand-900">
                {order.order_number}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-text-muted flex items-center gap-1.5">
              <Calendar size={13} />
              <span>{formatDate(order.created_at)}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-border-default hover:bg-surface-100 flex items-center justify-center text-text-muted hover:text-brand-900 transition-colors"
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-start">
          {/* Quick Status Updater Bar */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="text-xs font-bold text-brand-900 flex items-center gap-2">
              <Truck size={15} className="text-[#1E6091]" />
              <span>تحديث وتغيير حالة الطلب:</span>
            </label>

            <select
              value={order.status}
              disabled={isUpdating}
              onChange={(e) =>
                onStatusChange(order.id, e.target.value as OrderStatus)
              }
              className="h-10 px-3 rounded-xl bg-white border border-border-default text-xs font-bold text-brand-900 focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/20 transition-all outline-none disabled:opacity-50 cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.labelAr}
                </option>
              ))}
            </select>
          </div>

          {/* Customer & Delivery Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Customer Details */}
            <div className="p-4 rounded-2xl bg-surface-50 border border-border-default space-y-2">
              <span className="font-bold text-brand-900 block">بيانات العميل:</span>
              <p className="font-semibold text-text-primary">
                {order.guest_name || order.customer?.full_name || "عميل غير مسجل"}
              </p>
              {customerPhone && (
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-text-muted" />
                  <span dir="ltr" className="font-mono font-semibold text-text-primary">
                    {customerPhone}
                  </span>
                </div>
              )}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 pt-1"
                >
                  <MessageCircle size={13} />
                  <span>مراسلة العميل عبر واتساب</span>
                </a>
              )}
            </div>

            {/* Delivery Address */}
            <div className="p-4 rounded-2xl bg-surface-50 border border-border-default space-y-2">
              <span className="font-bold text-brand-900 block flex items-center gap-1.5">
                <MapPin size={13} className="text-[#1E6091]" />
                <span>عنوان الشحن والتوصيل:</span>
              </span>
              <p className="text-text-secondary leading-relaxed">
                {order.shipping_address || "العنوان مسجل هاتفياً"}
              </p>
              {order.notes && (
                <div className="pt-2 border-t border-border-default">
                  <span className="text-[11px] font-bold text-text-muted block">
                    ملاحظات العميل:
                  </span>
                  <p className="text-[11px] text-text-secondary italic">
                    "{order.notes}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-brand-900">
              المنتجات المطلوبة ({order.items?.length || 0})
            </h4>

            <div className="border border-border-default rounded-2xl divide-y divide-border-default overflow-hidden text-xs">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 flex items-center justify-between bg-white hover:bg-surface-50 transition-colors"
                  >
                    <div>
                      <span className="font-bold text-brand-900 block sm:inline">
                        {item.product_title}
                      </span>
                      {item.variant_name && (
                        <span className="text-text-muted text-[11px] sm:ms-2 block sm:inline">
                          ({item.variant_name})
                        </span>
                      )}
                      <span className="text-text-muted font-mono font-bold ms-2">
                        × {item.quantity}
                      </span>
                    </div>

                    <div className="text-end">
                      <span className="font-extrabold text-brand-900">
                        {formatPrice(item.unit_price * item.quantity)}
                      </span>
                      <span className="text-[10px] text-text-muted block">
                        ({formatPrice(item.unit_price)} للقطعة)
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-text-muted text-xs">
                  لا توجد منتجات مسجلة لهذا الطلب
                </div>
              )}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="p-4 rounded-2xl bg-surface-50 border border-border-default space-y-2 text-xs">
            <div className="flex items-center justify-between text-text-secondary">
              <span>المجموع الفرعي:</span>
              <span className="font-semibold">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-text-secondary">
              <span>رسوم الشحن:</span>
              <span className="font-semibold">
                {order.shipping_cost > 0
                  ? formatPrice(order.shipping_cost)
                  : "شحن مجاني"}
              </span>
            </div>
            <div className="flex items-center justify-between text-text-secondary">
              <span>طريقة الدفع:</span>
              <span className="font-semibold">
                {order.payment_method === "instapay"
                  ? "إنستاباي / فودافون كاش"
                  : "الدفع عند الاستلام (نقداً)"}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border-default text-sm font-extrabold text-brand-900">
              <span>المجموع الإجمالي:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border-default bg-surface-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-10 rounded-xl bg-white border border-border-default text-text-secondary hover:text-brand-900 text-xs font-semibold transition-colors cursor-pointer"
          >
            إغلاق
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`/admin/orders/${order.id}/invoice`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <FileText size={14} className="text-[#1E6091]" />
              <span>طباعة الفاتورة</span>
            </a>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <MessageCircle size={15} />
                <span>مراسلة واتساب</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
