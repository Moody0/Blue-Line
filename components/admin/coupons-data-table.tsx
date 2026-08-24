"use client";

import { useState, useTransition } from "react";
import {
  Tag,
  Plus,
  Search,
  Check,
  Copy,
  Trash2,
  Edit2,
  Calendar,
  Percent,
  Coins,
  AlertCircle,
  Clock,
  Sparkles,
  X,
  Save,
  CheckCircle2,
} from "lucide-react";
import type { Coupon, CouponFormData } from "@/types/ecommerce";
import { formatPrice } from "@/lib/formatters";
import { upsertCoupon, toggleCouponStatus, deleteCoupon } from "@/actions/coupons";
import { Input } from "@/components/ui/input";

interface CouponsDataTableProps {
  initialCoupons: Coupon[];
}

export function CouponsDataTable({ initialCoupons }: CouponsDataTableProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "active" | "inactive" | "percentage" | "fixed">("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<CouponFormData>({
    code: "",
    discount_type: "percentage",
    discount_value: 10,
    min_order_value: 1000,
    max_discount_amount: null,
    usage_limit: null,
    expires_at: null,
    is_active: true,
  });

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // KPIs
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.is_active).length;
  const totalUsage = coupons.reduce((sum, c) => sum + (c.used_count || 0), 0);

  // Filtered List
  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.discount_value.toString().includes(searchQuery);

    if (!matchesSearch) return false;

    if (filterType === "active") return c.is_active;
    if (filterType === "inactive") return !c.is_active;
    if (filterType === "percentage") return c.discount_type === "percentage";
    if (filterType === "fixed") return c.discount_type === "fixed";
    return true;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleActive = (coupon: Coupon) => {
    const newStatus = !coupon.is_active;
    startTransition(async () => {
      const res = await toggleCouponStatus(coupon.id, newStatus);
      if (res.success) {
        setCoupons(coupons.map((c) => (c.id === coupon.id ? { ...c, is_active: newStatus } : c)));
        showSuccess(`تم ${newStatus ? "تفعيل" : "إيقاف"} الكوبون ${coupon.code}`);
      }
    });
  };

  const handleDelete = (coupon: Coupon) => {
    if (!confirm(`هل أنت متأكد من حذف الكوبون ${coupon.code}؟`)) return;

    startTransition(async () => {
      const res = await deleteCoupon(coupon.id);
      if (res.success) {
        setCoupons(coupons.filter((c) => c.id !== coupon.id));
        showSuccess(`تم حذف الكوبون ${coupon.code} بنجاح`);
      }
    });
  };

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: 10,
      min_order_value: 1000,
      max_discount_amount: null,
      usage_limit: null,
      expires_at: null,
      is_active: true,
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      id: coupon.id,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_value: coupon.min_order_value,
      max_discount_amount: coupon.max_discount_amount,
      usage_limit: coupon.usage_limit,
      expires_at: coupon.expires_at ? coupon.expires_at.split("T")[0] : null,
      is_active: coupon.is_active,
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const res = await upsertCoupon(formData);
      if (res.success) {
        setIsModalOpen(false);
        // Refresh local state
        const updatedCoupon: Coupon = {
          id: formData.id || `coup-${Date.now()}`,
          code: formData.code.trim().toUpperCase(),
          discount_type: formData.discount_type,
          discount_value: Number(formData.discount_value),
          min_order_value: Number(formData.min_order_value || 0),
          max_discount_amount: formData.max_discount_amount ? Number(formData.max_discount_amount) : null,
          usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
          used_count: editingCoupon ? editingCoupon.used_count : 0,
          expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
          is_active: formData.is_active,
          created_at: editingCoupon ? editingCoupon.created_at : new Date().toISOString(),
        };

        if (editingCoupon) {
          setCoupons(coupons.map((c) => (c.id === editingCoupon.id ? updatedCoupon : c)));
        } else {
          setCoupons([updatedCoupon, ...coupons]);
        }
        showSuccess(editingCoupon ? "تم تعديل الكوبون بنجاح!" : "تم إنشاء الكوبون بنجاح!");
      } else {
        setErrorMessage(res.error || "حدث خطأ أثناء الحفظ.");
      }
    });
  };

  return (
    <div className="space-y-6 pb-20 text-start font-alexandria">
      {/* ── 1. Page Header & Actions Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            إدارة كوبونات وقسائم الخصم
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إنشاء وإدارة أكواد الخصم الترويجية للحملات التسويقية ومبيعات الواتساب
          </p>
        </div>

        <div className="flex items-center gap-2">
          {actionSuccess && (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check size={14} className="text-emerald-600" />
              <span>{actionSuccess}</span>
            </div>
          )}

          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={15} />
            <span>إنشاء كوبون جديد</span>
          </button>
        </div>
      </div>

      {/* ── 2. KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E6091] flex items-center justify-center">
            <Tag size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">إجمالي الكوبونات</span>
            <span className="text-lg font-extrabold text-slate-900">{totalCoupons}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">كوبونات نشطة حالياً</span>
            <span className="text-lg font-extrabold text-slate-900">{activeCoupons}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">مرات الاستخدام المنفذة</span>
            <span className="text-lg font-extrabold text-slate-900">{totalUsage} عملية</span>
          </div>
        </div>
      </div>

      {/* ── 3. Search & Filter Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بكود الكوبون..."
            className="ps-9 h-9 text-xs rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              filterType === "all" ? "bg-[#0B192C] text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            الكل ({coupons.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("active")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              filterType === "active" ? "bg-[#0B192C] text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            النشطة ({activeCoupons})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("percentage")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              filterType === "percentage" ? "bg-[#0B192C] text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            نسبة مئوية %
          </button>
          <button
            type="button"
            onClick={() => setFilterType("fixed")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              filterType === "fixed" ? "bg-[#0B192C] text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            مبلغ ثابت (ج.م)
          </button>
        </div>
      </div>

      {/* ── 4. Coupons Data Table ── */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4 text-start">كود الكوبون</th>
                <th className="py-3.5 px-4 text-start">نوع وقيمة الخصم</th>
                <th className="py-3.5 px-4 text-start">الحد الأدنى للطلب</th>
                <th className="py-3.5 px-4 text-start">الاستخدام</th>
                <th className="py-3.5 px-4 text-start">تاريخ الانتهاء</th>
                <th className="py-3.5 px-4 text-center">الحالة</th>
                <th className="py-3.5 px-4 text-end">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    لا توجد كوبونات تطابق معايير البحث
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Code & Copy */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs select-all">
                          {coupon.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(coupon.code)}
                          className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                          title="نسخ الكود"
                        >
                          {copiedCode === coupon.code ? (
                            <Check size={13} className="text-emerald-600" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Discount Value */}
                    <td className="py-3.5 px-4">
                      {coupon.discount_type === "percentage" ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200/60">
                            <Percent size={12} />
                            <span>خصم {coupon.discount_value}%</span>
                          </span>
                          {coupon.max_discount_amount && (
                            <span className="text-[10px] text-slate-400 block font-bold">
                              بحد أقصى {formatPrice(coupon.max_discount_amount)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#1E6091] font-extrabold text-xs border border-blue-200/60">
                          <Coins size={12} />
                          <span>خصم {formatPrice(coupon.discount_value)}</span>
                        </span>
                      )}
                    </td>

                    {/* Min Order Value */}
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      {coupon.min_order_value > 0 ? (
                        <span>{formatPrice(coupon.min_order_value)}</span>
                      ) : (
                        <span className="text-slate-400 font-normal">بدون حد أدنى</span>
                      )}
                    </td>

                    {/* Usage Progress */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1 max-w-[120px]">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                          <span>{coupon.used_count}</span>
                          <span className="text-slate-400">/ {coupon.usage_limit || "∞"}</span>
                        </div>
                        {coupon.usage_limit && (
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#1E6091] rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.round((coupon.used_count / coupon.usage_limit) * 100)
                                )}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Expiry Date */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {coupon.expires_at ? (
                        <div className="flex items-center gap-1.5 font-bold">
                          <Calendar size={13} className="text-slate-400" />
                          <span>{new Date(coupon.expires_at).toLocaleDateString("ar-EG")}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-normal">مستمر (بدون انتهاء)</span>
                      )}
                    </td>

                    {/* Active Switch Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <div
                        onClick={() => handleToggleActive(coupon)}
                        className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer mx-auto ${
                          coupon.is_active ? "bg-emerald-600" : "bg-slate-200"
                        }`}
                      >
                        <div
                          className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform ${
                            coupon.is_active ? "-translate-x-4.5" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(coupon)}
                          className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="تعديل"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(coupon)}
                          className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. Create / Edit Coupon Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-200 text-start">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#1E6091] flex items-center justify-center font-bold">
                  <Tag size={16} />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {editingCoupon ? "تعديل بيانات الكوبون" : "إنشاء كوبون خصم جديد"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
              {/* Code */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">كود الكوبون (بالإنجليزية) *</label>
                <Input
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="مثال: WELCOME10 أو GROHE500"
                  className="h-10 text-xs font-mono font-extrabold bg-slate-50 uppercase"
                  dir="ltr"
                />
              </div>

              {/* Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">نوع الخصم *</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_type: e.target.value as "percentage" | "fixed",
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت بالجنيه (ج.م)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    قيمة الخصم {formData.discount_type === "percentage" ? "(%)" : "(ج.م)"} *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                    placeholder="10"
                    className="h-10 text-xs font-bold bg-slate-50"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Min Order & Max Cap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">الحد الأدنى للطلب (ج.م)</label>
                  <Input
                    type="number"
                    min="0"
                    step="50"
                    value={formData.min_order_value || ""}
                    onChange={(e) => setFormData({ ...formData, min_order_value: Number(e.target.value) })}
                    placeholder="1000"
                    className="h-10 text-xs font-bold bg-slate-50"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">الحد الأقصى للخصم (ج.م) — اختياري</label>
                  <Input
                    type="number"
                    min="0"
                    step="50"
                    value={formData.max_discount_amount ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_discount_amount: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="1500"
                    className="h-10 text-xs font-bold bg-slate-50"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Usage Limit & Expiry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">الحد الأقصى لمرات الاستخدام</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.usage_limit ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usage_limit: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="مثال: 100"
                    className="h-10 text-xs font-bold bg-slate-50"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">تاريخ انتهاء الصلاحية</label>
                  <Input
                    type="date"
                    value={formData.expires_at ?? ""}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value || null })}
                    className="h-10 text-xs bg-slate-50"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <label className="pt-2 flex items-center justify-between cursor-pointer select-none border-t border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">تفعيل الكوبون فوراً</span>
                  <span className="text-[11px] text-slate-400">يكون متاحاً للاستخدام بصفحة الدفع</span>
                </div>
                <div
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    formData.is_active ? "bg-emerald-600" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      formData.is_active ? "-translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Save size={15} />
                  <span>{isPending ? "جاري الحفظ..." : "حفظ الكوبون"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
