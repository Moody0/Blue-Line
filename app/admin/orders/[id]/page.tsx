import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  User,
  Phone,
  MapPin,
  FileText,
  Calendar,
  DollarSign,
  Package,
  ShieldCheck,
} from "lucide-react";
import { getAdminOrderById } from "@/actions/admin";
import { formatPrice, formatDate } from "@/lib/formatters";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { OrderTimeline } from "@/components/admin/order-timeline";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AdminOrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    return { title: "الطلب غير موجود | Blue Line Admin" };
  }

  return {
    title: `تفاصيل الطلب ${order.order_number} | Blue Line Admin`,
  };
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  const items = order.items || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Status Change */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-default">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-accent-600 mb-1">
            <Link
              href="/admin/orders"
              className="hover:underline flex items-center gap-1"
            >
              <span>الطلبات والمبيعات</span>
              <ArrowRight size={13} />
            </Link>
            <span>/</span>
            <span className="font-mono">{order.order_number}</span>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-900 font-mono">
              {order.order_number}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/orders/${order.id}/invoice`}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-2xs transition-colors"
          >
            <FileText size={14} className="text-[#1E6091]" />
            <span>طباعة الفاتورة وبوليصة الشحن</span>
          </Link>

          <OrderStatusUpdater
            orderId={order.id}
            currentStatus={order.status}
          />
        </div>
      </div>

      {/* Visual Timeline */}
      <OrderTimeline status={order.status} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Itemized Order Line Items (Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl bg-white border border-border-default p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-sm font-bold text-brand-900 flex items-center gap-2">
              <Package size={16} className="text-accent-600" />
              <span>المنتجات والتشطيبات المطلوبة ({items.length})</span>
            </h2>

            <div className="divide-y divide-border-default">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-brand-900">
                      {item.product_title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-100 font-semibold text-text-secondary">
                        <span className="w-2 h-2 rounded-full bg-accent-600" />
                        <span>{item.variant_name}</span>
                      </span>
                      <span>×</span>
                      <span className="font-bold text-brand-900">
                        {item.quantity} قطعة
                      </span>
                    </div>
                  </div>

                  <div className="text-start sm:text-end space-y-0.5">
                    <p className="font-bold text-sm text-brand-900">
                      {formatPrice(item.total_price)}
                    </p>
                    <p className="text-[11px] text-text-muted">
                      {formatPrice(item.unit_price)} للقطعة
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Financial Totals */}
            <div className="space-y-2 text-xs pt-2">
              <div className="flex items-center justify-between text-text-secondary">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-text-primary">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span>الشحن والتوصيل:</span>
                <span>
                  {order.shipping_cost === 0 ? (
                    <strong className="text-success font-bold">مجاني</strong>
                  ) : (
                    formatPrice(order.shipping_cost)
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-base font-extrabold text-brand-900 pt-3 border-t border-border-default">
                <span>المجموع الإجمالي المطلوب:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Information (Span 4) */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="rounded-3xl bg-white border border-border-default p-6 space-y-5 shadow-xs">
            <h3 className="text-sm font-bold text-brand-900 flex items-center gap-2">
              <User size={16} className="text-accent-600" />
              <span>بيانات العميل والشحن</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-2.5">
                <Calendar size={15} className="text-text-muted shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text-muted">تاريخ الطلب</p>
                  <p className="font-bold text-brand-900 mt-0.5">
                    {formatDate(order.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-text-muted shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text-muted">عنوان التوصيل</p>
                  <p className="font-bold text-text-primary leading-relaxed mt-0.5">
                    {order.shipping_address}
                  </p>
                </div>
              </div>

              {order.notes && (
                <div className="flex items-start gap-2.5 pt-2 border-t border-border-default">
                  <FileText
                    size={15}
                    className="text-text-muted shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-text-muted">
                      ملاحظات خاصة بالتسليم
                    </p>
                    <p className="text-text-secondary leading-relaxed mt-0.5 italic">
                      "{order.notes}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border-default">
              <div className="p-3 rounded-2xl bg-surface-50 border border-border-default flex items-center gap-2 text-xs text-text-muted">
                <ShieldCheck size={16} className="text-accent-600 shrink-0" />
                <span>شهادة الضمان الرسمي مدرجة مع الشحنة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
