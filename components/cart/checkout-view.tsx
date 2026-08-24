"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  Banknote,
  Smartphone,
  Lock,
  ArrowLeft,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  Sparkles,
  Tag,
  Check,
  X,
} from "lucide-react";
import { useCart } from "./cart-context";
import { formatPrice } from "@/lib/formatters";
import { createOrder } from "@/actions/orders";
import { validateCouponCode } from "@/actions/coupons";
import { getCurrentUser, getCustomerProfile } from "@/actions/auth";
import { isValidPhoneNumber, isValidEmail } from "@/lib/validation";
import { EGYPT_GOVERNORATES, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import type { Coupon } from "@/types/ecommerce";

export function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, clearCart, isLoaded } = useCart();
  const [isPending, startTransition] = useTransition();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    governorate: "القاهرة",
    city: "",
    address: "",
    notes: "",
    paymentMethod: "cod" as "cod" | "instapay",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── Coupon State ──
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Auto-fetch profile if logged in
  useEffect(() => {
    async function loadCustomer() {
      const user = await getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
        const customer = await getCustomerProfile();
        if (customer) {
          setFormData((prev) => ({
            ...prev,
            fullName: customer.full_name || prev.fullName,
            email: customer.email || prev.email,
            phone: customer.phone || prev.phone,
            governorate: customer.governorate || prev.governorate,
            city: customer.city || prev.city,
            address: customer.address_line_1 || prev.address,
          }));
        }
      }
    }
    loadCustomer();
  }, []);

  // Calculate dynamic shipping cost based on governorate & subtotal
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const currentGovRate =
    EGYPT_GOVERNORATES.find((g) => g.name === formData.governorate)?.fee ?? 100;
  const shippingCost = subtotal > 0 ? (isFreeShipping ? 0 : currentGovRate) : 0;
  const grandTotal = Math.max(0, subtotal - couponDiscount) + shippingCost;

  // Handle Apply Coupon
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);

    if (!couponCodeInput.trim()) return;

    setIsApplyingCoupon(true);
    const result = await validateCouponCode(couponCodeInput.trim(), subtotal);
    setIsApplyingCoupon(false);

    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      setCouponDiscount(result.discountAmount);
      setCouponError(null);
    } else {
      setCouponError(result.error || "كود الخصم غير صالح.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCodeInput("");
    setCouponError(null);
  };

  // 1. If cart state is still initializing from storage, show skeleton
  if (!isLoaded) {
    return (
      <div className="max-w-[1480px] mx-auto py-12 px-4 sm:px-6 lg:px-8 font-alexandria animate-pulse" dir="rtl">
        <div className="h-8 w-48 bg-surface-200 rounded-xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-96 bg-surface-100 rounded-2xl" />
          <div className="lg:col-span-5 h-96 bg-surface-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  // 2. Empty state
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-5 font-alexandria" dir="rtl">
        <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto text-text-muted">
          <Truck size={28} />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-brand-900">سلة المشتريات فارغة</h1>
          <p className="text-xs text-text-muted">
            لم تقم بإضافة أي خلاطات أو أطقم صحية إلى سلتك بعد.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-900 text-white text-xs font-bold hover:bg-[#1E6091] transition-colors"
        >
          <span>تصفح تشكيلة المنتجات</span>
          <ArrowLeft size={14} />
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation checks
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setErrorMessage("يرجى إدخال الاسم بالكامل بشكل صحيح.");
      return;
    }

    if (!formData.phone.trim() || !isValidPhoneNumber(formData.phone.trim())) {
      setErrorMessage("رقم الهاتف غير صحيح، يرجى إدخال رقم هاتف صالح.");
      return;
    }

    if (formData.email.trim() && !isValidEmail(formData.email.trim())) {
      setErrorMessage("البريد الإلكتروني غير صحيح، يرجى إدخال بريد إلكتروني صالح.");
      return;
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      setErrorMessage("يرجى إدخال تفاصيل العنوان (الشارع، رقم العمارة / الشقة).");
      return;
    }

    startTransition(async () => {
      const result = await createOrder({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || `${formData.phone.trim()}@guest.blueline-eg.com`,
        governorate: formData.governorate,
        city: formData.city.trim() || formData.governorate,
        address: formData.address.trim(),
        notes: formData.notes.trim() || undefined,
        paymentMethod: formData.paymentMethod,
        items,
        subtotal,
        shippingCost,
        total: grandTotal,
        couponCode: appliedCoupon?.code || null,
        discountAmount: couponDiscount,
      });

      if (result.success) {
        clearCart();
        router.push(`/checkout/success?order=${encodeURIComponent(result.orderNumber)}`);
      } else {
        setErrorMessage(result.error || "حدث خطأ أثناء تسجيل الطلب، يرجى المحاولة مرة أخرى.");
      }
    });
  };

  return (
    <div className="max-w-[1480px] mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-alexandria" dir="rtl">
      {/* Guest Quick Sign-in Banner */}
      {!isAuthenticated && (
        <div className="mb-8 p-4 bg-surface-50 border border-border-default rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-text-secondary text-start">
            <User size={16} className="text-[#1E6091] shrink-0" />
            <span>
              هل لديك حساب معنا؟{" "}
              <strong className="text-brand-900">سجل الدخول لملء بياناتك وعناوينك تلقائياً</strong>
            </span>
          </div>
          <Link
            href="/auth/login?redirect=/checkout"
            className="text-xs font-bold text-[#1E6091] hover:underline bg-white px-4 py-2 rounded-xl border border-border-default/80 shrink-0"
          >
            تسجيل الدخول ←
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* ── Left Column: Checkout Form (7 cols) ── */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1 text-start">
            <h1 className="text-2xl font-extrabold text-brand-900 tracking-tight">
              إتمام الطلب وتأكيد الشحن
            </h1>
            <p className="text-xs text-text-muted">
              أدخل بيانات التوصيل واختر طريقة الدفع المناسبة لتأكيد حجز الموديلات
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold leading-relaxed flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Customer Contact Info */}
            <div className="bg-white rounded-2xl border border-border-default/90 p-5 sm:p-6 space-y-4 shadow-xs">
              <h2 className="text-sm font-extrabold text-brand-900 flex items-center gap-2 border-b border-border-default/60 pb-3">
                <User size={16} className="text-[#1E6091]" />
                <span>1. البيانات الشخصية وبيانات الاتصال</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1 text-start">
                  <label className="text-[11px] font-bold text-text-primary block">
                    الاسم بالكامل <span className="text-destructive">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User
                      size={15}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="مثال: كريم الشناوي"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full h-11 pr-10 pl-3.5 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1 text-start">
                  <label className="text-[11px] font-bold text-text-primary block">
                    رقم الهاتف للتأكيد والشحن <span className="text-destructive">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone
                      size={15}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                    />
                    <input
                      type="tel"
                      required
                      inputMode="tel"
                      placeholder="01012345678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-11 pr-10 pl-3.5 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 font-mono focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="sm:col-span-2 space-y-1 text-start">
                  <label className="text-[11px] font-bold text-text-primary block">
                    البريد الإلكتروني (اختياري لاستلام الفاتورة الرقمية)
                  </label>
                  <div className="relative flex items-center">
                    <Mail
                      size={15}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                    />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-11 pr-10 pl-3.5 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 font-mono focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Address */}
            <div className="bg-white rounded-2xl border border-border-default/90 p-5 sm:p-6 space-y-4 shadow-xs">
              <h2 className="text-sm font-extrabold text-brand-900 flex items-center gap-2 border-b border-border-default/60 pb-3">
                <MapPin size={16} className="text-[#1E6091]" />
                <span>2. عنوان التوصيل والشحن</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Governorate */}
                <div className="space-y-1 text-start">
                  <label className="text-[11px] font-bold text-text-primary block">
                    المحافظة <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={formData.governorate}
                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-50 border border-border-default text-xs font-semibold text-brand-900 focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none cursor-pointer"
                  >
                    {EGYPT_GOVERNORATES.map((gov) => (
                      <option key={gov.name} value={gov.name}>
                        {gov.name} {gov.fee === 0 ? "(شحن مجاني)" : `(${gov.fee} ج.م)`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div className="space-y-1 text-start">
                  <label className="text-[11px] font-bold text-text-primary block">
                    المدينة / الحي / المنطقة <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: التجمع الخامس، مدينة نصر، سموحة"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
                  />
                </div>

                {/* Detailed Street Address */}
                <div className="sm:col-span-2 space-y-1 text-start">
                  <label className="text-[11px] font-bold text-text-primary block">
                    العنوان بالتفصيل (اسم الشارع، رقم العمارة، الشقة / الفيلا) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شارع التسعين الشمالي، عمارة 45، الدور الثالث، شقة 6"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
                  />
                </div>

                {/* Order Notes */}
                <div className="sm:col-span-2 space-y-1 text-start">
                  <label className="text-[11px] font-bold text-text-primary block">
                    ملاحظات التوصيل أو مواعيد الاستلام المفضلة (اختياري)
                  </label>
                  <div className="relative">
                    <textarea
                      rows={2}
                      placeholder="مثال: يرجى الاتصال قبل الوصول بساعة، التسليم لمشرف الموقع..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full p-3 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Payment Method */}
            <div className="bg-white rounded-2xl border border-border-default/90 p-5 sm:p-6 space-y-4 shadow-xs">
              <h2 className="text-sm font-extrabold text-brand-900 flex items-center gap-2 border-b border-border-default/60 pb-3">
                <Banknote size={16} className="text-[#1E6091]" />
                <span>3. طريقة الدفع وتأكيد الحجز</span>
              </h2>

              <div className="space-y-3">
                {/* Option 1: Cash on Delivery */}
                <label
                  onClick={() => setFormData({ ...formData, paymentMethod: "cod" })}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                    formData.paymentMethod === "cod"
                      ? "border-[#1E6091] bg-[#1E6091]/5 ring-1 ring-[#1E6091]/20"
                      : "border-border-default hover:bg-surface-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={() => setFormData({ ...formData, paymentMethod: "cod" })}
                    className="mt-1 accent-[#1E6091]"
                  />
                  <div className="space-y-1 text-start">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-extrabold text-brand-900">
                        الدفع عند الاستلام (نقداً عند المعاينة)
                      </strong>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        الأكثر طلباً
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      ادفع نقداً لمندوب الشحن بعد فحص ومعاينة الموديلات والتأكد من سلامتها وشهادات الضمان.
                    </p>
                  </div>
                </label>

                {/* Option 2: InstaPay / Vodafone Cash */}
                <label
                  onClick={() => setFormData({ ...formData, paymentMethod: "instapay" })}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                    formData.paymentMethod === "instapay"
                      ? "border-[#1E6091] bg-[#1E6091]/5 ring-1 ring-[#1E6091]/20"
                      : "border-border-default hover:bg-surface-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="instapay"
                    checked={formData.paymentMethod === "instapay"}
                    onChange={() => setFormData({ ...formData, paymentMethod: "instapay" })}
                    className="mt-1 accent-[#1E6091]"
                  />
                  <div className="space-y-1 text-start">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-extrabold text-brand-900">
                        إنستاباي / فودافون كاش ومحافظ إلكترونية
                      </strong>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                        تحويل فوري
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      حول إجمالي الفاتورة فورياً عبر تطبيق InstaPay أو محفظة كاش، وسيتم تزويدك برقم التحويل لتأكيد الإشعار عبر واتساب.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Desktop Place Order Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-brand-900 hover:bg-[#1E6091] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>{isPending ? "جاري تسجيل وتأكيد الطلب..." : "تأكيد الطلب الآن"}</span>
              <ArrowLeft size={16} />
            </Button>
          </form>
        </div>

        {/* ── Right Column: Order Summary (5 cols) ── */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-border-default/90 p-5 sm:p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border-default/60 pb-3">
              <h2 className="text-sm font-extrabold text-brand-900">
                ملخص سلة الشراء ({items.length} منتجات)
              </h2>
              <Link href="/cart" className="text-[11px] font-bold text-[#1E6091] hover:underline">
                تعديل السلة
              </Link>
            </div>

            {/* Itemized List */}
            <div className="divide-y divide-border-default/50 max-h-[280px] overflow-y-auto pe-1 no-scrollbar space-y-3">
              {items.map((item) => {
                const unitPrice =
                  item.variant?.price_override ??
                  item.product?.discount_price ??
                  item.product?.base_price ??
                  0;
                const image =
                  item.variant?.image_urls?.[0] ||
                  item.product?.variants?.[0]?.image_urls?.[0];

                return (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl bg-white border border-border-default/60 shrink-0 overflow-hidden p-1 flex items-center justify-center">
                      {image ? (
                        <Image
                          src={image}
                          alt={item.product?.title_ar || "منتج"}
                          fill
                          sizes="56px"
                          className="object-contain scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-100 rounded" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-start">
                      <h3 className="text-xs font-bold text-brand-900 truncate">
                        {item.product?.title_ar}
                      </h3>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {item.variant?.finish_name || "اللون الافتراضي"} × {item.quantity}
                      </p>
                    </div>

                    <strong className="text-xs font-mono font-bold text-brand-900 shrink-0">
                      {formatPrice(unitPrice * item.quantity)}
                    </strong>
                  </div>
                );
              })}
            </div>

            {/* ── Coupon Code Box ── */}
            <div className="pt-4 border-t border-border-default/60 space-y-2 text-xs">
              <span className="font-bold text-slate-700 block text-start">
                كوبون وقسيمة الخصم
              </span>

              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag size={15} className="text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-mono font-extrabold block text-xs">{appliedCoupon.code}</span>
                      <span className="text-[10px] font-bold text-emerald-700">
                        وفرت {formatPrice(couponDiscount)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="w-6 h-6 rounded-md bg-white border border-emerald-200 text-emerald-600 hover:text-rose-600 hover:border-rose-200 flex items-center justify-center cursor-pointer transition-colors"
                    title="إزالة الكوبون"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="أدخل كود الخصم (e.g. WELCOME10)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 h-10 px-3 rounded-xl bg-surface-50 border border-border-default text-xs font-mono font-bold uppercase outline-none focus:bg-white focus:border-[#1E6091]"
                      dir="ltr"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponCodeInput.trim()}
                      className="px-4 h-10 rounded-xl bg-[#0B192C] hover:bg-[#1E6091] text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isApplyingCoupon ? "جاري الفحص..." : "تطبيق"}
                    </button>
                  </div>

                  {couponError && (
                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{couponError}</span>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-border-default/60 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-text-muted">
                <span>المجموع الفرعي:</span>
                <span className="font-mono font-bold text-brand-900">{formatPrice(subtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-bold">
                  <span>خصم الكوبون ({appliedCoupon?.code}):</span>
                  <span className="font-mono">- {formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-text-muted">
                <span>تكلفة الشحن ({formData.governorate}):</span>
                <span className="font-mono font-bold text-brand-900">
                  {isFreeShipping ? (
                    <span className="text-emerald-700 font-bold">شحن مجاني ✓</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>

              {isFreeShipping && (
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>تم تطبيق الشحن المجاني لتجاوز الطلب 5,000 ج.م!</span>
                </div>
              )}

              <div className="pt-3 border-t border-border-default flex items-center justify-between">
                <strong className="text-sm font-extrabold text-brand-900">الإجمالي النهائي:</strong>
                <strong className="text-lg font-extrabold text-[#1E6091] font-mono">
                  {formatPrice(grandTotal)}
                </strong>
              </div>
            </div>

            {/* Security Badges */}
            <div className="pt-3 border-t border-border-default/60 space-y-1.5 text-[11px] text-text-muted text-start">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                <span>ضمان شامل 5 سنوات على جميع الخلاطات الألمانية</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span>فحص ومعاينة المنتجات قبل سداد القيمة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
