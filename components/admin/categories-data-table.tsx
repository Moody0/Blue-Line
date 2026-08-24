"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { PlusCircle, Search, Edit2, Trash2, Layers, X, Check } from "lucide-react";
import type { AdminCategoryItem } from "@/actions/admin";
import { upsertCategory, deleteCategory } from "@/actions/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CategoriesDataTableProps {
  categories: AdminCategoryItem[];
}

export function CategoriesDataTable({
  categories: initialCategories,
}: CategoriesDataTableProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCategory, setEditingCategory] = useState<AdminCategoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form states
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(1);

  const filteredCategories = categories.filter(
    (c) =>
      c.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setNameAr("");
    setNameEn("");
    setSlug("");
    setImageUrl("");
    setSortOrder(categories.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: AdminCategoryItem) => {
    setEditingCategory(cat);
    setNameAr(cat.name_ar);
    setNameEn(cat.name_en);
    setSlug(cat.slug);
    setImageUrl(cat.image_url || "");
    setSortOrder(cat.sort_order || 1);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !nameEn.trim()) return;

    startTransition(async () => {
      const payload = {
        id: editingCategory?.id,
        name_ar: nameAr.trim(),
        name_en: nameEn.trim(),
        slug: slug.trim() || nameEn.trim().toLowerCase().replace(/\s+/g, "-"),
        image_url: imageUrl.trim() || null,
        sort_order: Number(sortOrder),
      };

      await upsertCategory(payload);

      setCategories((prev) => {
        if (editingCategory) {
          return prev.map((c) =>
            c.id === editingCategory.id
              ? {
                  ...c,
                  ...payload,
                  id: editingCategory.id,
                }
              : c
          );
        }
        const newCat: AdminCategoryItem = {
          ...payload,
          id: `cat-${Date.now()}`,
          parent_id: null,
          created_at: new Date().toISOString(),
          product_count: 0,
        };
        return [...prev, newCat];
      });

      setIsModalOpen(false);
    });
  };

  const handleDelete = (catId: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا القسم؟")) return;

    startTransition(async () => {
      await deleteCategory(catId);
      setCategories((prev) => prev.filter((c) => c.id !== catId));
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-900">
            إدارة الفئات والأقسام
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            إجمالي {categories.length} أقسام مصنفة للأدوات الصحية والسباكة
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 h-10 rounded-xl bg-brand-900 hover:bg-[#1E6091] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <PlusCircle size={15} />
          <span>إضافة قسم جديد</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-border-default flex items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <Input
            placeholder="بحث باسم القسم أو الرابط..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-9 h-10 text-xs bg-surface-50 border-border-default rounded-xl"
          />
        </div>

        <span className="text-xs text-text-muted font-medium">
          عرض {filteredCategories.length} قسم
        </span>
      </div>

      {/* Categories Table */}
      <div className="rounded-3xl bg-white border border-border-default overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-surface-50 border-b border-border-default text-text-muted font-bold">
                <th className="py-3.5 px-6 text-start">صورة القسم</th>
                <th className="py-3.5 px-6 text-start">اسم القسم (بالعربية)</th>
                <th className="py-3.5 px-6 text-start">الاسم بالإنجليزية</th>
                <th className="py-3.5 px-6 text-start">الرابط المباشر (Slug)</th>
                <th className="py-3.5 px-6 text-start">الترتيب</th>
                <th className="py-3.5 px-6 text-start">عدد المنتجات</th>
                <th className="py-3.5 px-6 text-end">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {filteredCategories.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-surface-50/70 transition-colors"
                >
                  {/* Image */}
                  <td className="py-3 px-6">
                    <div className="w-12 h-12 rounded-xl bg-surface-100 border border-border-default relative overflow-hidden flex items-center justify-center">
                      {cat.image_url ? (
                        <Image
                          src={cat.image_url}
                          alt={cat.name_ar}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Layers size={18} className="text-text-muted" />
                      )}
                    </div>
                  </td>

                  {/* Arabic Name */}
                  <td className="py-3 px-6 font-bold text-brand-900">
                    {cat.name_ar}
                  </td>

                  {/* English Name */}
                  <td className="py-3 px-6 font-semibold text-text-secondary">
                    {cat.name_en}
                  </td>

                  {/* Slug */}
                  <td className="py-3 px-6 font-mono text-[11px] text-text-muted">
                    /category/{cat.slug}
                  </td>

                  {/* Sort Order */}
                  <td className="py-3 px-6 font-mono font-bold text-brand-900">
                    {cat.sort_order || 1}
                  </td>

                  {/* Product Count */}
                  <td className="py-3 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-100 text-brand-900">
                      {cat.product_count || 0} منتج
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-6 text-end whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cat)}
                        className="w-8 h-8 rounded-lg bg-surface-100 hover:bg-[#1E6091] hover:text-white flex items-center justify-center text-text-secondary transition-colors cursor-pointer"
                        title="تعديل القسم"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id)}
                        className="w-8 h-8 rounded-lg bg-surface-100 hover:bg-rose-600 hover:text-white flex items-center justify-center text-text-secondary transition-colors cursor-pointer"
                        title="حذف القسم"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
          dir="rtl"
        >
          <div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-border-default overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-border-default flex items-center justify-between bg-surface-50">
              <h3 className="text-sm font-extrabold text-brand-900">
                {editingCategory ? "تعديل بيانات القسم" : "إضافة قسم جديد"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-border-default hover:bg-surface-100 flex items-center justify-center text-text-muted hover:text-brand-900 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-start text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-text-primary block">
                  اسم القسم بالعربية *
                </label>
                <Input
                  required
                  placeholder="مثال: خلاطات مغاسل وأحواض"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  className="h-10 text-xs rounded-xl bg-surface-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-text-primary block">
                  الاسم بالإنجليزية (English) *
                </label>
                <Input
                  required
                  placeholder="e.g. Basin Mixers"
                  value={nameEn}
                  onChange={(e) => {
                    setNameEn(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                    }
                  }}
                  dir="ltr"
                  className="h-10 text-xs rounded-xl bg-surface-50 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-text-primary block">
                  الرابط الدائم (Slug) *
                </label>
                <Input
                  required
                  placeholder="mixers-basins"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  dir="ltr"
                  className="h-10 text-xs rounded-xl bg-surface-50 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-text-primary block">
                  رابط صورة القسم (Image URL)
                </label>
                <Input
                  placeholder="/images/categories/faucet.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  dir="ltr"
                  className="h-10 text-xs rounded-xl bg-surface-50 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-text-primary block">
                  ترتيب الظهور في الموقع
                </label>
                <Input
                  type="number"
                  min={1}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="h-10 text-xs rounded-xl bg-surface-50 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-border-default flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 h-10 rounded-xl bg-surface-100 text-text-secondary font-semibold text-xs hover:bg-surface-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 h-10 rounded-xl bg-brand-900 hover:bg-[#1E6091] text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Check size={14} />
                  <span>{isPending ? "جاري الحفظ..." : "حفظ القسم"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
