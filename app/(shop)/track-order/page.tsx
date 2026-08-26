import type { Metadata } from "next";
import Link from "next/link";
import { TrackOrderView } from "@/components/orders/track-order-view";

export const metadata: Metadata = {
  title: "تتبع حالة الطلب | بلو لاين لأدوات السباكة",
  description:
    "استعلم عن حالة ومسار شحنتك وموعد التوصيل عبر إدخال رقم الطلب ورقم هاتفك لدى متجر بلو لاين.",
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-[70vh] py-8 sm:py-14 font-alexandria" dir="rtl">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 space-y-8 text-start">
        {/* Breadcrumbs */}
        <nav aria-label="مسار التصفح" className="flex items-center gap-2 text-xs text-text-muted">
          <Link href="/" className="hover:text-brand-900 transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-brand-900 font-bold">تتبع حالة الطلب</span>
        </nav>

        {/* Page Header */}
        <div className="space-y-2 pb-6 border-b border-border-default">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-900 tracking-tight">
            تتبع حالة الطلب والشحنة
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            استعلم فورياً عن مسار شحنتك وحالة التجهيز والتوصيل بإدخال رقم الطلب ورقم هاتفك المسجل.
          </p>
        </div>

        {/* Interactive Lookup & Results */}
        <TrackOrderView />
      </div>
    </div>
  );
}
