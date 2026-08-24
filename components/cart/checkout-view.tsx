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
  ChevronDown,
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
    country: "مصر",
    firstName: "",
    lastName: "",
    address: "", // رقم المنزل واسم الشارع / الحي
    city: "", // المدينة
    governorate: "القاهرة", // المنطقة
    phone: "",
    email: "",
    createAccount: false,
    shipToDifferentAddress: false,
    diffRecipientName: "",
    diffAddress: "",
    diffGovernorate: "القاهرة",
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
          const names = (customer.full_name || "").split(" ");
          const first = names[0] || "";
          const last = names.slice(1).join(" ") || "";
          setFormData((prev) => ({
            ...prev,
            firstName: first || prev.firstName,
            lastName: last || prev.lastName,
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
    if (!formData.firstName.trim()) {
      setErrorMessage("يرجى إدخال الاسم الأول.");
      return;
    }

    if (!formData.lastName.trim()) {
      setErrorMessage("يرجى إدخال الاسم الأخير.");
      return;
    }

    if (!formData.address.trim() || formData.address.trim().length < 4) {
      setErrorMessage("يرجى إدخال عنوان الشارع / الحي (رقم المنزل واسم الشارع).");
      return;
    }

    if (!formData.city.trim()) {
      setErrorMessage("يرجى إدخال اسم المدينة.");
      return;
    }

    if (!formData.phone.trim() || !isValidPhoneNumber(formData.phone.trim())) {
      setErrorMessage("رقم الهاتف غير صحيح، يرجى إدخال رقم هاتف محمول صالح.");
      return;
    }

    if (!formData.email.trim() || !isValidEmail(formData.email.trim())) {
      setErrorMessage("البريد الإلكتروني غير صحيح، يرجى إدخال بريد إلكتروني صالح.");
      return;
    }

    const fullCustomerName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    const deliveryAddress = formData.shipToDifferentAddress && formData.diffAddress.trim()
      ? `${formData.diffGovernorate} — ${formData.diffAddress.trim()} (المستلم: ${formData.diffRecipientName.trim() || fullCustomerName})`
      : `${formData.governorate} — ${formData.city.trim()}، ${formData.address.trim()}`;

    startTransition(async () => {
      const result = await createOrder({
        fullName: fullCustomerName,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        governorate: formData.governorate,
        city: formData.city.trim(),
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
          {/* Error Alert */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold leading-relaxed flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Section: تفاصيل الفاتورة (Billing Details Form Matching Reference) */}
            <div className="bg-white rounded-2xl border border-border-default/90 p-6 sm:p-8 space-y-5 shadow-xs text-start">
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-900 tracking-tight pb-2 border-b border-border-default/60">
                تفاصيل الفاتورة
              </h2>

              <div className="space-y-4">
                {/* 1. الدولة / المنطقة * */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-900 block">
                    الدولة / المنطقة <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      disabled
                      value={formData.country}
                      className="w-full h-11 px-3.5 rounded-xl bg-surface-50 border border-border-default text-xs font-bold text-brand-900 outline-none appearance-none cursor-not-allowed opacity-90"
                    >
                      <option value="مصر">مصر</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute start-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                    />
                  </div>
                </div>

                {/* 2. الاسم الأول * & الاسم الأخير * (Grid 2 cols) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-900 block">
                      الاسم الأول <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder=""
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-900 block">
                      الاسم الأخير <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder=""
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* 3. عنوان الشارع / الحي * */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-900 block">
                    عنوان الشارع / الحي <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="رقم المنزل واسم الشارع / الحي"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
                  />
                </div>

                {/* 4. المدينة * */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-900 block">
                    المدينة <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder=""
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
                  />
                </div>

                {/* 5. المنطقة * (Governorate selection) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-900 block">
                    المنطقة <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.governorate}
                      onChange={(e) =>
                        setFormData({ ...formData, governorate: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl bg-surface-50 border border-border-default text-xs font-semibold text-brand-900 focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none appearance-none cursor-pointer"
                    >
                      {EGYPT_GOVERNORATES.map((gov) => (
                        <option key={gov.name} value={gov.name}>
                          {gov.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute start-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                    />
                  </div>
                </div>

                {/* 6. الهاتف * */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-900 block">
                    الهاتف <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    inputMode="tel"
                    placeholder=""
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 font-mono focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
                  />
                </div>

                {/* 7. البريد الإلكتروني * */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-900 block">
                    البريد الإلكتروني <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder=""
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 font-mono focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none"
                  />
                </div>

                {/* Checkboxes: Create Account & Ship to Different Address */}
                <div className="pt-3 space-y-2.5 border-t border-border-default/60">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-brand-900 select-none">
                    <input
                      type="checkbox"
                      checked={formData.createAccount}
                      onChange={(e) =>
                        setFormData({ ...formData, createAccount: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-border-default text-[#1E6091] focus:ring-[#1E6091] cursor-pointer"
                    />
                    <span>هل تودّ إنشاء حساب جديد؟</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-brand-900 select-none">
                    <input
                      type="checkbox"
                      checked={formData.shipToDifferentAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipToDifferentAddress: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-border-default text-[#1E6091] focus:ring-[#1E6091] cursor-pointer"
                    />
                    <span>هل تودّ الشحن لعنوان مختلف؟</span>
                  </label>

                  {/* Expanded Different Address Fields if Checked */}
                  {formData.shipToDifferentAddress && (
                    <div className="p-4 bg-surface-50 rounded-xl border border-border-default/80 space-y-3 mt-2 animate-in fade-in duration-200">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-900 block">
                          اسم المستلم
                        </label>
                        <input
                          type="text"
                          placeholder="اسم الشخص المستلم للشحنة"
                          value={formData.diffRecipientName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              diffRecipientName: e.target.value,
                            })
                          }
                          className="w-full h-10 px-3 rounded-lg bg-white border border-border-default text-xs text-brand-900 focus:border-[#1E6091] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-900 block">
                          عنوان الشحن المختلف
                        </label>
                        <input
                          type="text"
                          placeholder="الشارع، رقم العمارة / الفيلا"
                          value={formData.diffAddress}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              diffAddress: e.target.value,
                            })
                          }
                          className="w-full h-10 px-3 rounded-lg bg-white border border-border-default text-xs text-brand-900 focus:border-[#1E6091] outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 8. ملاحظات الطلب (اختياري) */}
                <div className="pt-2 space-y-1.5">
                  <label className="text-xs font-bold text-text-muted block">
                    ملاحظات الطلب <span className="font-normal">(اختياري)</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="ملاحظات حول الطلب، مثال: ملحوظة خاصة بتسليم الطلب."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full p-3.5 rounded-xl bg-surface-50 border border-border-default text-xs text-brand-900 focus:bg-white focus:border-[#1E6091] focus:ring-2 focus:ring-[#1E6091]/15 transition-all outline-none resize-y"
                  />
                </div>
              </div>
            </div>

            {/* Section: Payment Method */}
            <div className="bg-white rounded-2xl border border-border-default/90 p-5 sm:p-6 space-y-4 shadow-xs text-start">
              <h2 className="text-sm font-extrabold text-brand-900 flex items-center gap-2 border-b border-border-default/60 pb-3">
                <Banknote size={16} className="text-[#1E6091]" />
                <span>طريقة الدفع وتأكيد الحجز</span>
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

                {/* Option 2: InstaPay */}
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
                    <strong className="text-xs font-extrabold text-brand-900">
                      تحويل إنستاباي / محفظة إلكترونية (InstaPay / Wallets)
                    </strong>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      سيصلك رقم حساب التحويل وتأكيد الحجز الفوري مع خدمة العملاء على واتساب بعد إتمام الطلب مباشرة.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* ── Right Column: Order Summary & Coupon (5 cols) ── */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="bg-white rounded-2xl border border-border-default/90 p-5 sm:p-6 space-y-5 shadow-xs text-start">
            <h2 className="text-sm font-extrabold text-brand-900 border-b border-border-default/60 pb-3 flex items-center justify-between">
              <span>ملخص طلبك ({items.length} منتجات)</span>
              <span className="text-xs font-bold text-[#1E6091]">بلو لاين الأصلية</span>
            </h2>

            {/* Item Previews list */}
            <div className="divide-y divide-border-default/40 max-h-64 overflow-y-auto overscroll-contain pr-1">
              {items.map((item) => {
                const title = item.product?.title_ar || "منتج بلو لاين";
                const finishName = item.variant?.finish_name || "كروم لامع";
                const price =
                  item.variant?.price_override ??
                  item.product?.discount_price ??
                  item.product?.base_price ??
                  0;
                const image =
                  item.variant?.image_urls?.[0] ||
                  item.product?.variants?.[0]?.image_urls?.[0] ||
                  "/images/categories/faucet.jpg";

                return (
                  <div key={`${item.product_id}-${item.variant_id}`} className="py-3 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg bg-surface-50 border border-border-default/60 overflow-hidden shrink-0">
                      <Image src={image} alt={title} fill className="object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-brand-900 truncate">{title}</h4>
                      <p className="text-[10px] text-text-muted">
                        {finishName} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brand-900">
                      {formatPrice(price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ── Coupon Input Box ── */}
            <div className="pt-2 border-t border-border-default/60">
              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag size={15} className="text-emerald-700" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-emerald-800 tracking-wider font-mono">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-full font-bold">
                          تم تطبيق الخصم
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-700">
                        وفرت {formatPrice(couponDiscount)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="p-1 text-emerald-700 hover:text-destructive transition-colors cursor-pointer"
                    title="إلغاء الكوبون"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        placeholder="هل لديك كود خصم؟"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        className="w-full h-10 pr-9 pl-3 rounded-xl bg-surface-50 border border-border-default text-xs font-bold uppercase tracking-wider text-brand-900 focus:bg-white focus:border-[#1E6091] outline-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isApplyingCoupon || !couponCodeInput.trim()}
                      className="h-10 px-4 bg-[#1E6091] hover:bg-brand-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      {isApplyingCoupon ? "جاري التحقق..." : "تطبيق"}
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-destructive font-semibold px-1">{couponError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-border-default/60 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-brand-900">{formatPrice(subtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>خصم الكوبون ({appliedCoupon?.code}):</span>
                  <span>- {formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-text-secondary">
                <span>الشحن والتوصيل ({formData.governorate}):</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-700 font-bold">شحن مجاني 🎉</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-border-default flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-brand-900">الإجمالي النهائي:</span>
                <span className="text-xl font-black text-[#1E6091] font-mono">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            {/* Submit Order Button */}
            <Button
              type="submit"
              form="checkout-form"
              disabled={isPending}
              className="w-full h-12 rounded-xl bg-brand-900 hover:bg-[#1E6091] text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPending ? (
                <span>جاري تأكيد وحفظ الطلب...</span>
              ) : (
                <>
                  <Lock size={15} />
                  <span>تأكيد الطلب الآن ({formatPrice(grandTotal)})</span>
                </>
              )}
            </Button>

            {/* Security Trust Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-default/60 text-[10px] text-text-muted font-semibold text-center">
              <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-surface-50">
                <ShieldCheck size={14} className="text-[#1E6091]" />
                <span>ضمان الوكيل المعتمد</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-surface-50">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>معاينة قبل الاستلام</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
