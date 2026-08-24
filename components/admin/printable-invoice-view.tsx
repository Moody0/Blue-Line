"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Printer,
  ArrowRight,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  FileText,
  Truck,
  CheckCircle2,
} from "lucide-react";
import type { Order } from "@/types/ecommerce";
import { formatPrice, formatDate } from "@/lib/formatters";

interface PrintableInvoiceViewProps {
  order: Order;
}

export function PrintableInvoiceView({ order }: PrintableInvoiceViewProps) {
  const customerName = order.customer?.full_name || order.guest_name || "عميل بلو لاين الموقر";
  const customerPhone = order.customer?.phone || order.guest_phone || "-";
  const customerEmail = order.customer?.email || order.guest_email || "-";
  const items = order.items || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 font-alexandria text-start" dir="rtl">
      {/* ── Top Bar / Print Actions (Hidden on Print) ── */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <Link
          href={`/admin/orders/${order.id}`}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowRight size={15} />
          <span>العودة لتفاصيل الطلب</span>
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="px-6 h-10 rounded-xl bg-[#0B192C] hover:bg-[#1E6091] text-white text-xs font-extrabold flex items-center gap-2 shadow-md transition-colors cursor-pointer"
        >
          <Printer size={15} />
          <span>طباعة الفاتورة وبوليصة الشحن (A4 / PDF)</span>
        </button>
      </div>

      {/* ── A4 Sheet Page Container ── */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-md print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-full space-y-8">
        {/* ── Header: Logo & Company Info ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b-2 border-slate-900">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B192C] text-white flex items-center justify-center font-black text-base">
                BL
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 leading-none">
                  بلو لاين لأدوات السباكة
                </h1>
                <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">
                  BLUE LINE SANITARY WARE
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              متخصصون في خلاطات المياه المعمارية وأنظمة الدش والأدوات الصحية الألمانية
            </p>
          </div>

          <div className="text-start sm:text-end text-xs space-y-1 text-slate-600">
            <div className="font-extrabold text-sm text-slate-900">فاتورة تجارية / إذن تسليم</div>
            <div>
              رقم الفاتورة: <span className="font-mono font-bold text-[#1E6091]">{order.order_number}</span>
            </div>
            <div>
              التاريخ: <span className="font-mono">{formatDate(order.created_at)}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              س.ت: 492019 • ب.ض: 582-901-344
            </div>
          </div>
        </div>

        {/* ── Customer & Shipping Info Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/70 p-5 rounded-2xl border border-slate-200 text-xs">
          {/* Customer */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5 pb-1 border-b border-slate-200">
              <FileText size={13} className="text-[#1E6091]" />
              <span>بيانات العميل والمشتري</span>
            </h3>
            <div className="space-y-1 text-slate-700">
              <div>
                الاسم: <strong>{customerName}</strong>
              </div>
              <div className="flex items-center gap-1">
                الهاتف: <span className="font-mono font-bold" dir="ltr">{customerPhone}</span>
              </div>
              {customerEmail !== "-" && (
                <div className="font-mono text-slate-500">{customerEmail}</div>
              )}
            </div>
          </div>

          {/* Shipping & Delivery */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5 pb-1 border-b border-slate-200">
              <Truck size={13} className="text-[#1E6091]" />
              <span>عنوان التوصيل وطريقة الدفع</span>
            </h3>
            <div className="space-y-1 text-slate-700">
              <div>
                العنوان: <strong>{order.shipping_address}</strong>
              </div>
              <div>
                طريقة الدفع:{" "}
                <span className="font-bold text-slate-900">
                  {order.payment_method === "cod" ? "الدفع عند الاستلام (COD)" : "تحويل إلكتروني / InstaPay"}
                </span>
              </div>
              {order.notes && (
                <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                  ملاحظات: {order.notes}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Itemized Table ── */}
        <div className="space-y-3">
          <table className="w-full text-xs text-start border border-slate-200 rounded-2xl overflow-hidden">
            <thead className="bg-slate-900 text-white font-extrabold">
              <tr>
                <th className="py-3 px-4 text-start">#</th>
                <th className="py-3 px-4 text-start">البيان وصنف المنتج</th>
                <th className="py-3 px-4 text-center">اللون / التشطيب</th>
                <th className="py-3 px-4 text-center">الكمية</th>
                <th className="py-3 px-4 text-end">سعر الوحدة</th>
                <th className="py-3 px-4 text-end">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3 px-4 font-extrabold text-slate-900">{item.product_title}</td>
                  <td className="py-3 px-4 text-center text-slate-600 font-bold">{item.variant_name}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold">{item.quantity}</td>
                  <td className="py-3 px-4 text-end font-mono text-slate-600">{formatPrice(item.unit_price)}</td>
                  <td className="py-3 px-4 text-end font-mono font-bold text-slate-900">
                    {formatPrice(item.total_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Calculations & Total COD Collection Amount ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200">
          <div className="space-y-1.5 text-xs text-slate-500 max-w-sm">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ShieldCheck size={14} />
              <span>مشمول بضمان بلو لاين المعتمد ضد عيوب الصناعة والتسريب.</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              يرجى الاحتفاظ بهذه الفاتورة كوثيقة إثبات سريان الضمان الرسمي. يحق للعميل معاينة المنتجات بالكامل عند الاستلام.
            </p>
          </div>

          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>المجموع الفرعي:</span>
              <span className="font-mono font-bold">{formatPrice(order.subtotal)}</span>
            </div>

            {order.discount_amount && order.discount_amount > 0 ? (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>خصم الكوبون ({order.coupon_code || "عرض"}):</span>
                <span className="font-mono">- {formatPrice(order.discount_amount)}</span>
              </div>
            ) : null}

            <div className="flex justify-between text-slate-600">
              <span>مصاريف الشحن والتوصيل:</span>
              <span className="font-mono font-bold">
                {order.shipping_cost === 0 ? "شحن مجاني" : formatPrice(order.shipping_cost)}
              </span>
            </div>

            <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-center text-sm font-extrabold text-slate-900 bg-slate-50 p-2.5 rounded-xl">
              <span>المطلوب تحصيله:</span>
              <span className="font-mono text-base text-[#1E6091]">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* ── Courier Tear-off Slip (بوليصة استلام مندوب الشحن) ── */}
        <div className="pt-8 border-t-2 border-dashed border-slate-300 space-y-4">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>✂️ قص هنا — بوليصة تسليم شركة الشحن والتوزيع</span>
            <span>بوابة بلو لاين اللوجستية</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">المستلم</span>
              <strong className="text-slate-900">{customerName}</strong>
              <div className="font-mono text-slate-600" dir="ltr">{customerPhone}</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-bold">العنوان ومبلغ التحصيل (COD)</span>
              <div className="truncate text-slate-800">{order.shipping_address}</div>
              <div className="font-mono font-extrabold text-[#1E6091] text-sm mt-0.5">
                {formatPrice(order.total)}
              </div>
            </div>

            <div className="text-start sm:text-end space-y-4">
              <span className="text-[10px] text-slate-400 block font-bold">توقيع العميل بالاستلام والمعاينة:</span>
              <div className="border-b border-slate-400 w-36 sm:ms-auto pt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
