"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Save,
  Plus,
  Trash2,
  ArrowRight,
  Package,
  Layers,
  FileText,
  AlertCircle,
  Sparkles,
  Eye,
  Check,
  Percent,
  ShieldCheck,
  FileDown,
} from "lucide-react";
import type {
  Product,
  Category,
  ProductFormData,
  VariantFormData,
} from "@/types/ecommerce";
import { FINISHES } from "@/lib/constants";
import { formatPrice } from "@/lib/formatters";
import { upsertProduct } from "@/actions/admin";
import { Input } from "@/components/ui/input";

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
}

function stripHtmlTags(str: string): string {
  if (!str) return "";
  return str
    .replace(/<\/p>/gi, "\n")
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<[^>]+>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initial Form State
  const [formData, setFormData] = useState<ProductFormData>({
    id: product?.id,
    title_ar: product?.title_ar || "",
    title_en: product?.title_en || "",
    slug: product?.slug || "",
    sku: product?.sku || "",
    category_id: product?.category_id || (categories[0]?.id ?? null),
    base_price: product?.base_price || 0,
    discount_price: product?.discount_price || null,
    warranty_years: product?.warranty_years || 5,
    is_concealed: product?.is_concealed || false,
    is_featured: product?.is_featured || false,
    is_active: product?.is_active ?? true,
    description_ar: stripHtmlTags(product?.description_ar || ""),
    description_en: stripHtmlTags(product?.description_en || ""),
    technical_drawing_url: product?.technical_drawing_url || "",
    variants: product?.variants?.map((v) => ({
      id: v.id,
      finish_name: v.finish_name,
      finish_code: v.finish_code,
      hex_color: v.hex_color,
      image_urls: v.image_urls || [],
      stock_quantity: v.stock_quantity,
      price_override: v.price_override,
      is_default: v.is_default,
    })) || [
      {
        finish_name: "كروم لامع (Chrome)",
        finish_code: "CHR",
        hex_color: "#D4D4D8",
        image_urls: [],
        stock_quantity: 25,
        price_override: null,
        is_default: true,
      },
    ],
  });

  // Calculate discount percentage
  const discountSavings =
    formData.discount_price && formData.base_price > formData.discount_price
      ? formData.base_price - formData.discount_price
      : 0;
  const discountPercent =
    discountSavings > 0
      ? Math.round((discountSavings / formData.base_price) * 100)
      : 0;

  // Selected category object
  const selectedCategoryObj = categories.find((c) => c.id === formData.category_id);

  // Default variant for preview
  const defaultVariant =
    formData.variants.find((v) => v.is_default) || formData.variants[0];

  // Variant Helpers
  const addVariantFromPreset = (preset: (typeof FINISHES)[number]) => {
    if (formData.variants.some((v) => v.finish_code === preset.code)) return;

    const newVariant: VariantFormData = {
      finish_name: `${preset.nameAr} (${preset.name})`,
      finish_code: preset.code,
      hex_color: preset.hex,
      image_urls: [],
      stock_quantity: 15,
      price_override: null,
      is_default: formData.variants.length === 0,
    };

    setFormData({
      ...formData,
      variants: [...formData.variants, newVariant],
    });
  };

  const addCustomVariant = () => {
    const newVariant: VariantFormData = {
      finish_name: "تشطيب مخصص",
      finish_code: `CUS-${formData.variants.length + 1}`,
      hex_color: "#71717A",
      image_urls: [],
      stock_quantity: 10,
      price_override: null,
      is_default: formData.variants.length === 0,
    };

    setFormData({
      ...formData,
      variants: [...formData.variants, newVariant],
    });
  };

  const updateVariant = (index: number, patch: Partial<VariantFormData>) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], ...patch };
    setFormData({ ...formData, variants: updated });
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 1) {
      alert("يجب أن يحتوي المنتج على تشطيب ومخزون واحد على الأقل.");
      return;
    }
    const updated = formData.variants.filter((_, i) => i !== index);
    if (!updated.some((v) => v.is_default) && updated.length > 0) {
      updated[0].is_default = true;
    }
    setFormData({ ...formData, variants: updated });
  };

  const setDefaultVariant = (index: number) => {
    const updated = formData.variants.map((v, i) => ({
      ...v,
      is_default: i === index,
    }));
    setFormData({ ...formData, variants: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.title_ar.trim()) {
      setErrorMessage("يرجى إدخال اسم المنتج باللغة العربية.");
      return;
    }

    if (formData.base_price <= 0) {
      setErrorMessage("يرجى إدخال سعر أساسي صحيح أكبر من الصفر.");
      return;
    }

    startTransition(async () => {
      const result = await upsertProduct(formData);
      if (result.success) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setErrorMessage(result.error || "حدث خطأ أثناء حفظ بيانات المنتج.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20 text-start font-alexandria">
      {/* ── 1. Page Header & Actions Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1.5">
            <Link
              href="/admin/products"
              className="hover:text-[#1E6091] transition-colors flex items-center gap-1"
            >
              <span>المنتجات</span>
              <ArrowRight size={13} />
            </Link>
            <span>/</span>
            <span className="text-slate-800">
              {product ? "تعديل المنتج" : "إضافة منتج جديد"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {product ? product.title_ar : "إضافة منتج جديد"}
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            أدخل تفاصيل ومواصفات المنتج، الأسعار، وتشطيبات PVD المتاحة.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/admin/products"
            className="px-4 h-10 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} />
            <span>{isPending ? "جاري الحفظ..." : "حفظ المنتج"}</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── 2. Two-Column Balanced Workspace ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column: Details & Variants (Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Basic Information */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-5 shadow-2xs">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Package size={16} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  البيانات الأساسية للمنتج
                </h2>
                <p className="text-[11px] text-slate-400">
                  الاسم بالعربية والإنجليزية والرابط والوصف الفني
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Arabic Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  اسم المنتج (باللغة العربية) *
                </label>
                <Input
                  required
                  placeholder="مثال: خلاط حوض جروهي يوروكيوب أحادي الذراع كروم"
                  value={formData.title_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, title_ar: e.target.value })
                  }
                  className="rounded-xl h-11 text-xs bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>

              {/* English Title & Auto Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    اسم المنتج (باللغة الإنجليزية) *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Grohe Eurocube Basin Mixer Chrome"
                    value={formData.title_en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title_en: e.target.value,
                        slug:
                          formData.slug ||
                          e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      })
                    }
                    className="rounded-xl h-11 text-xs bg-slate-50 border-slate-200 focus:bg-white"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    الرابط المباشر (Slug)
                  </label>
                  <Input
                    required
                    placeholder="grohe-eurocube-basin-mixer"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="rounded-xl h-11 text-xs bg-slate-50 border-slate-200 font-mono text-slate-600 focus:bg-white"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Arabic Technical Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  الوصف والمواصفات الفنية (عربي)
                </label>
                <textarea
                  rows={4}
                  placeholder="وصف تقني للمنتج، قلب سيراميكي ألماني، ضغط المياه الموصى به، مقاومة الجير والترسبات..."
                  value={formData.description_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, description_ar: e.target.value })
                  }
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs leading-relaxed outline-none focus:border-[#1E6091] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Pricing & Discounts */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  ج.م
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    التسعير والعروض الترويجية
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    السعر الأساسي وسعر العرض المخفض بالجنيه المصري
                  </p>
                </div>
              </div>

              {discountPercent > 0 && (
                <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  وفر {formatPrice(discountSavings)} ({discountPercent}% خصم)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Base Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  السعر الأساسي (ج.م) *
                </label>
                <div className="flex rounded-xl bg-slate-50 border border-slate-200 overflow-hidden focus-within:border-[#1E6091] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1E6091]/15 transition-all">
                  <span className="px-3.5 flex items-center justify-center bg-slate-100/80 text-slate-600 font-bold text-xs border-e border-slate-200 select-none">
                    ج.م
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="50"
                    required
                    placeholder="4500"
                    value={formData.base_price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        base_price: Number(e.target.value),
                      })
                    }
                    className="w-full h-11 px-3.5 bg-transparent text-xs font-bold text-slate-900 outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Discount Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  سعر العرض المخفض (ج.م) — اختياري
                </label>
                <div className="flex rounded-xl bg-slate-50 border border-slate-200 overflow-hidden focus-within:border-[#1E6091] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1E6091]/15 transition-all">
                  <span className="px-3.5 flex items-center justify-center bg-slate-100/80 text-slate-600 font-bold text-xs border-e border-slate-200 select-none">
                    ج.م
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    placeholder="3850"
                    value={formData.discount_price ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_price: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                    className="w-full h-11 px-3.5 bg-transparent text-xs font-bold text-slate-900 outline-none"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: PVD Finishes & Variant Manager */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    تشكيلات وتشطيبات المنتج (PVD Variants)
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    إدارة الألوان المتاحة، صور كل تشطيب، والمخزون
                  </p>
                </div>
              </div>

              {/* Quick Preset Swatches */}
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">
                  إضافة:
                </span>
                {FINISHES.map((finish) => (
                  <button
                    key={finish.code}
                    type="button"
                    onClick={() => addVariantFromPreset(finish)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                    title={finish.nameAr}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block"
                      style={{ backgroundColor: finish.hex }}
                    />
                    <span>{finish.nameAr}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Variants Repeater Table */}
            <div className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border transition-all ${
                    variant.is_default
                      ? "bg-slate-50/80 border-slate-300 shadow-2xs"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {/* Swatch & Name (Span 4) */}
                    <div className="sm:col-span-4 flex items-center gap-2.5">
                      <input
                        type="color"
                        value={variant.hex_color}
                        onChange={(e) =>
                          updateVariant(index, { hex_color: e.target.value })
                        }
                        className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0.5 shrink-0 bg-white"
                        title="اختر لون التشطيب"
                      />
                      <Input
                        value={variant.finish_name}
                        onChange={(e) =>
                          updateVariant(index, { finish_name: e.target.value })
                        }
                        placeholder="اسم التشطيب (e.g. كروم لامع)"
                        className="h-10 text-xs font-bold bg-white"
                      />
                    </div>

                    {/* Finish Code (Span 2) */}
                    <div className="sm:col-span-2">
                      <Input
                        value={variant.finish_code}
                        onChange={(e) =>
                          updateVariant(index, {
                            finish_code: e.target.value.toUpperCase(),
                          })
                        }
                        placeholder="الكود (CHR)"
                        className="h-10 text-xs font-mono font-bold bg-white text-center"
                        dir="ltr"
                      />
                    </div>

                    {/* Stock (Span 2) */}
                    <div className="sm:col-span-2">
                      <Input
                        type="number"
                        min="0"
                        value={variant.stock_quantity}
                        onChange={(e) =>
                          updateVariant(index, {
                            stock_quantity: Number(e.target.value),
                          })
                        }
                        placeholder="الكمية"
                        className="h-10 text-xs font-bold bg-white text-center"
                        dir="ltr"
                      />
                    </div>

                    {/* Price Override (Span 2) */}
                    <div className="sm:col-span-2">
                      <Input
                        type="number"
                        min="0"
                        step="50"
                        value={variant.price_override ?? ""}
                        onChange={(e) =>
                          updateVariant(index, {
                            price_override: e.target.value
                              ? Number(e.target.value)
                              : null,
                          })
                        }
                        placeholder="سعر خاص"
                        className="h-10 text-xs bg-white text-center"
                        dir="ltr"
                      />
                    </div>

                    {/* Default & Delete Controls (Span 2) */}
                    <div className="sm:col-span-2 flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDefaultVariant(index)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                          variant.is_default
                            ? "bg-[#0B192C] text-white border-[#0B192C]"
                            : "border-slate-200 text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        {variant.is_default ? "الأساسي" : "تعيين"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                        title="حذف التشطيب"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Image URL Input per Variant */}
                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 shrink-0">
                      رابط صورة التشطيب:
                    </span>
                    <Input
                      placeholder="https://.../product-chrome.jpg"
                      value={variant.image_urls?.[0] || ""}
                      onChange={(e) =>
                        updateVariant(index, {
                          image_urls: e.target.value.trim() ? [e.target.value.trim()] : [],
                        })
                      }
                      className="h-8 text-xs font-mono bg-white flex-1"
                      dir="ltr"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addCustomVariant}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>إضافة تشطيب ولون مخصص آخر</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Column: Organization, Switches & Live Preview (Span 4) */}
        <div className="lg:col-span-4 space-y-6 sticky top-0">
          {/* Card 1: Publishing & Visibility (Clean Toggle Switches) */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 space-y-4 shadow-2xs">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              حالة النشر والظهور
            </h3>

            <div className="space-y-3.5 divide-y divide-slate-100 text-xs">
              {/* Active Switch */}
              <label className="pt-2 first:pt-0 flex items-center justify-between cursor-pointer select-none">
                <div>
                  <span className="font-bold text-slate-900 block">
                    متاح للبيع (Active)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    يظهر بالمتجر ومتاح للإضافة للسلة
                  </span>
                </div>
                <div
                  onClick={() =>
                    setFormData({ ...formData, is_active: !formData.is_active })
                  }
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

              {/* Featured Switch */}
              <label className="pt-3.5 flex items-center justify-between cursor-pointer select-none">
                <div>
                  <span className="font-bold text-slate-900 block">
                    منتج مميز (Featured)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    يظهر في واجهة الصفحة الرئيسية
                  </span>
                </div>
                <div
                  onClick={() =>
                    setFormData({ ...formData, is_featured: !formData.is_featured })
                  }
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    formData.is_featured ? "bg-amber-500" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      formData.is_featured ? "-translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>

              {/* Concealed Switch */}
              <label className="pt-3.5 flex items-center justify-between cursor-pointer select-none">
                <div>
                  <span className="font-bold text-slate-900 block">
                    تركيب دفن مخفي (Concealed)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    يتطلب علبة دفن داخل الحائط
                  </span>
                </div>
                <div
                  onClick={() =>
                    setFormData({
                      ...formData,
                      is_concealed: !formData.is_concealed,
                    })
                  }
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    formData.is_concealed ? "bg-[#1E6091]" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      formData.is_concealed ? "-translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Card 2: Organization & Specs */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 space-y-4 shadow-2xs">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              التصنيف والمواصفات
            </h3>

            <div className="space-y-3 text-xs">
              {/* Category Dropdown */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  القسم الرئيسي *
                </label>
                <select
                  value={formData.category_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-[#1E6091] cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_ar}
                    </option>
                  ))}
                </select>
              </div>

              {/* SKU */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  كود الصنف (SKU) *
                </label>
                <Input
                  required
                  placeholder="BL-FAU-102"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  className="rounded-xl h-10 text-xs font-mono font-bold bg-slate-50"
                  dir="ltr"
                />
              </div>

              {/* Warranty */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  مدة الضمان (سنوات)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.warranty_years}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      warranty_years: Number(e.target.value),
                    })
                  }
                  className="rounded-xl h-10 text-xs font-bold bg-slate-50"
                  dir="ltr"
                />
              </div>

              {/* PDF URL */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  رابط المخطط الهندسي PDF
                </label>
                <Input
                  placeholder="https://.../drawing.pdf"
                  value={formData.technical_drawing_url || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      technical_drawing_url: e.target.value,
                    })
                  }
                  className="rounded-xl h-10 text-xs font-mono bg-slate-50"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Live Storefront Card Preview */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye size={13} />
                <span>معاينة حية للبطاقة</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Live Store
              </span>
            </div>

            {/* Mini Card Preview */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2.5">
              <div className="w-full h-36 bg-slate-50 rounded-lg relative overflow-hidden flex items-center justify-center border border-slate-100">
                {defaultVariant?.image_urls?.[0] ? (
                  <Image
                    src={defaultVariant.image_urls[0]}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Package size={32} className="text-slate-300" />
                )}
              </div>

              <div className="space-y-1">
                <span className="inline-block text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {selectedCategoryObj?.name_ar || "القسم"}
                </span>
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {formData.title_ar || "اسم المنتج سيظهر هنا"}
                </h4>
              </div>

              {/* Swatches Preview */}
              <div className="flex items-center gap-1">
                {formData.variants.map((v, i) => (
                  <span
                    key={i}
                    className="w-3 h-3 rounded-full border border-slate-300 inline-block shadow-2xs"
                    style={{ backgroundColor: v.hex_color }}
                  />
                ))}
              </div>

              {/* Price Preview */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs font-extrabold text-slate-900">
                  {formData.discount_price ? (
                    <div className="flex items-center gap-1.5">
                      <span>{formatPrice(formData.discount_price)}</span>
                      <span className="text-[10px] text-slate-400 line-through">
                        {formatPrice(formData.base_price)}
                      </span>
                    </div>
                  ) : (
                    <span>{formatPrice(formData.base_price || 0)}</span>
                  )}
                </div>

                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  {formData.sku || "BL-SKU"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
