import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  PackageCheck,
  PhoneCall,
  ShieldCheck,
  ArrowLeft,
  MessageCircle,
  ShoppingBag,
  Truck,
  UserCheck,
  Copy,
} from "lucide-react";
import { getOrderByNumber } from "@/actions/orders";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Logo } from "@/components/layout/logo";

interface SuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { order } = await searchParams;
  const orderNumber = order || `BL-${Date.now().toString().slice(-8)}`;

  // Fetch real order record from database if available
  const orderData = await getOrderByNumber(orderNumber);

  const customerName = orderData?.guest_name || orderData?.customer?.full_name || "عميلنا العزيز";
  const customerPhone = orderData?.guest_phone || orderData?.customer?.phone || "";
  const totalAmount = orderData?.total || 0;
  const paymentMethodLabel =
    orderData?.payment_method === "instapay"
      ? "إنستاباي / فودافون كاش ومحافظ إلكترونية"
      : "الدفع عند الاستلام (نقداً عند المعاينة)";

  // Build prefilled WhatsApp message for customer service verification
  const whatsappMessage = encodeURIComponent(
    `مرحباً خدمة عملاء بلو لاين، أود تأكيد طلبي رقم: #${orderNumber}\nالاسم: ${customerName}\nالإجمالي: ${totalAmount ? formatPrice(totalAmount) : ""}`
  );
  const whatsappUrl = `https://wa.me/201203007686?text=${whatsappMessage}`;

  return (
    <div className="max-w-3xl mx-auto py-10 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-8 font-alexandria" dir="rtl">
      {/* ── 1. Top Celebration & Success Header ── */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/60 animate-in zoom-in-50 duration-300">
          <CheckCircle2 size={44} />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-extrabold text-[#1E6091] uppercase tracking-wider block">
            تم استلام وتأكيد طلبك بنجاح
          </span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-900 tracking-tight">
            شكراً لثقتك في بلو لاين للأدوات الصحية
          </h1>
          <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto leading-relaxed">
            تم تسجيل حجز موديلاتك بنجاح، وسيتواصل معك مهندس خدمة العملاء لتأكيد موعد التسليم والمعاينة.
          </p>
        </div>
      </div>

      {/* ── 2. Primary Action: WhatsApp Instant Verification CTA ── */}
      <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-[#25D366]" />
            <strong className="text-xs sm:text-sm font-extrabold text-brand-900">
              تأكيد أسرع ومتابعة حية عبر واتساب
            </strong>
          </div>
          <p className="text-[11px] sm:text-xs text-text-secondary leading-relaxed">
            اضغط للتواصل المباشر مع مسؤول الشحن وتأكيد تفاصيل الاستلام وإرسال إشعار الدفع فورياً.
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-sm hover:shadow shrink-0 w-full sm:w-auto cursor-pointer"
        >
          <MessageCircle size={16} />
          <span>تأكيد الطلب عبر واتساب</span>
        </a>
      </div>

      {/* ── 3. Detailed Order Summary Card ── */}
      <div className="rounded-3xl bg-white border border-border-default/90 p-6 sm:p-8 space-y-6 shadow-xs text-start">
        {/* Order Number & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border-default/60">
          <div>
            <span className="text-xs text-text-muted block">رقم الطلب المرجعي:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <strong className="text-lg sm:text-xl font-mono font-extrabold text-brand-900">
                #{orderNumber}
              </strong>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1E6091]/10 text-[#1E6091] text-xs font-bold">
            <PackageCheck size={15} />
            <span>تم التأكيد وجاري التجهيز</span>
          </div>
        </div>

        {/* Itemized Order Items (if DB items exist) */}
        {orderData?.items && orderData.items.length > 0 && (
          <div className="space-y-3 pb-6 border-b border-border-default/60">
            <h3 className="text-xs font-bold text-text-muted">المنتجات المطلوبة:</h3>
            <div className="divide-y divide-border-default/40">
              {orderData.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-brand-900 block">{item.product_title}</strong>
                    <span className="text-[11px] text-text-muted">
                      {item.variant_name} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-brand-900">
                    {formatPrice(item.total_price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial & Delivery Details Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2.5">
            <div>
              <span className="text-text-muted block text-[11px]">طريقة الدفع:</span>
              <strong className="text-brand-900 font-semibold">{paymentMethodLabel}</strong>
            </div>

            {orderData?.shipping_address && (
              <div>
                <span className="text-text-muted block text-[11px]">عنوان التوصيل:</span>
                <p className="text-brand-900 font-semibold leading-relaxed mt-0.5">
                  {orderData.shipping_address}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2.5 sm:border-s sm:border-border-default/60 sm:ps-6">
            {orderData?.subtotal ? (
              <>
                <div className="flex items-center justify-between text-text-muted">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono font-bold text-brand-900">{formatPrice(orderData.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-text-muted">
                  <span>مصاريف الشحن:</span>
                  <span className="font-mono font-bold text-brand-900">
                    {orderData.shipping_cost === 0 ? "شحن مجاني ✓" : formatPrice(orderData.shipping_cost)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border-default">
                  <strong className="text-sm font-extrabold text-brand-900">الإجمالي:</strong>
                  <strong className="text-base font-extrabold text-[#1E6091] font-mono">
                    {formatPrice(orderData.total)}
                  </strong>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between pt-2">
                <strong className="text-sm font-extrabold text-brand-900">حالة الفاتورة:</strong>
                <span className="text-emerald-700 font-bold">تم تسجيل الفاتورة بنجاح ✓</span>
              </div>
            )}
          </div>
        </div>

        {/* Guarantees Strip */}
        <div className="pt-4 border-t border-border-default/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <ShieldCheck size={17} className="text-[#1E6091] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-brand-900">شهادة الضمان المعتمد</p>
              <p className="text-text-muted text-[11px] mt-0.5">
                تصلك شهادة الضمان الألمانية الرسمية (5 سنوات) مع مندوب التسليم.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Truck size={17} className="text-[#1E6091] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-brand-900">المعاينة قبل الاستلام</p>
              <p className="text-text-muted text-[11px] mt-0.5">
                يحق لك فتح الشحنة وفحص الموديلات والتأكد من سلامتها التامة قبل السداد.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Bottom Action Buttons ── */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 bg-brand-900 hover:bg-[#1E6091] text-white rounded-xl px-6 py-3 text-xs font-bold transition-all shadow-xs"
        >
          <UserCheck size={15} />
          <span>متابعة الطلب في حسابي</span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white hover:bg-surface-50 text-brand-900 border border-border-default rounded-xl px-6 py-3 text-xs font-bold transition-all shadow-2xs"
        >
          <span>العودة للصفحة الرئيسية</span>
          <ArrowLeft size={14} />
        </Link>
      </div>
    </div>
  );
}
