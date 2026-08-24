"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Package,
  Layers,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
} from "lucide-react";
import type { Product } from "@/types/ecommerce";
import { formatPrice } from "@/lib/formatters";
import { deleteProduct } from "@/actions/admin";
import { Input } from "@/components/ui/input";

interface ProductsDataTableProps {
  products: Product[];
}

type TabType = "all" | "in_stock" | "low_stock" | "featured" | "inactive";
type SortType = "newest" | "price_asc" | "price_desc" | "stock_asc" | "stock_desc";

const ITEMS_PER_PAGE = 12;

export function ProductsDataTable({ products: initialProducts }: ProductsDataTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Metrics summary
  const totalCount = products.length;
  const activeCount = products.filter((p) => p.is_active).length;
  const lowStockCount = products.filter((p) => {
    const totalStock = (p.variants || []).reduce((sum, v) => sum + Number(v.stock_quantity || 0), 0);
    return totalStock < 10;
  }).length;

  // Extract unique category names
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category?.name_ar) set.add(p.category.name_ar);
    });
    return Array.from(set);
  }, [products]);

  // Filter & Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.title_ar?.toLowerCase().includes(q) ||
        product.title_en?.toLowerCase().includes(q) ||
        product.sku?.toLowerCase().includes(q) ||
        product.brand?.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "all" || product.category?.name_ar === selectedCategory;

      const variants = product.variants || [];
      const totalStock = variants.reduce((sum, v) => sum + Number(v.stock_quantity || 0), 0);

      let matchesTab = true;
      if (activeTab === "in_stock") matchesTab = totalStock >= 10;
      if (activeTab === "low_stock") matchesTab = totalStock < 10;
      if (activeTab === "featured") matchesTab = Boolean(product.is_featured);
      if (activeTab === "inactive") matchesTab = !product.is_active;

      return matchesSearch && matchesCategory && matchesTab;
    });

    // Sorting
    result.sort((a, b) => {
      const priceA = a.discount_price ?? a.base_price;
      const priceB = b.discount_price ?? b.base_price;
      const stockA = (a.variants || []).reduce((sum, v) => sum + Number(v.stock_quantity || 0), 0);
      const stockB = (b.variants || []).reduce((sum, v) => sum + Number(v.stock_quantity || 0), 0);

      if (sortBy === "price_asc") return priceA - priceB;
      if (sortBy === "price_desc") return priceB - priceA;
      if (sortBy === "stock_asc") return stockA - stockB;
      if (sortBy === "stock_desc") return stockB - stockA;
      return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
    });

    return result;
  }, [products, searchQuery, selectedCategory, activeTab, sortBy]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  const handleDelete = (productId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج وجميع تشطيباته؟")) return;

    startTransition(async () => {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    });
  };

  return (
    <div className="space-y-6 text-start font-alexandria">
      {/* ── 1. Header & Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            إدارة كتالوج المنتجات
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إجمالي {totalCount} موديل مسجل • {activeCount} نشط بالمتجر
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle size={15} />
          <span>إضافة منتج جديد</span>
        </Link>
      </div>

      {/* ── 2. Top Summary Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
            إجمالي الموديلات
          </span>
          <span className="text-xl font-black text-slate-900 block">
            {totalCount}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
            المنتجات النشطة
          </span>
          <span className="text-xl font-black text-emerald-600 block">
            {activeCount}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
            نواقص المخزون
          </span>
          <span className="text-xl font-black text-rose-600 block">
            {lowStockCount}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
            الأقسام المفعلة
          </span>
          <span className="text-xl font-black text-slate-900 block">
            {categories.length || 6}
          </span>
        </div>
      </div>

      {/* ── 3. Filter Tabs (Zad Land Style) ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <button
          type="button"
          onClick={() => {
            setActiveTab("all");
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-xl transition-colors shrink-0 cursor-pointer ${
            activeTab === "all"
              ? "bg-[#0B192C] text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          كافة المنتجات ({totalCount})
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("in_stock");
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-xl transition-colors shrink-0 cursor-pointer ${
            activeTab === "in_stock"
              ? "bg-[#0B192C] text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          متوفر بالمخزن ({totalCount - lowStockCount})
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("low_stock");
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-xl transition-colors shrink-0 cursor-pointer ${
            activeTab === "low_stock"
              ? "bg-rose-600 text-white shadow-xs"
              : "bg-white border border-slate-200 text-rose-600 hover:bg-rose-50"
          }`}
        >
          نواقص المخزون ({lowStockCount})
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("featured");
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-xl transition-colors shrink-0 cursor-pointer ${
            activeTab === "featured"
              ? "bg-[#0B192C] text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          المميز بالرئيسية
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("inactive");
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-xl transition-colors shrink-0 cursor-pointer ${
            activeTab === "inactive"
              ? "bg-[#0B192C] text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          موقوف ({totalCount - activeCount})
        </button>
      </div>

      {/* ── 4. Search & Controls Bar ── */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search
              size={15}
              className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="بحث بالاسم، كود SKU، أو الماركة..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="ps-9 h-10 text-xs bg-slate-50 border-slate-200 rounded-xl"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:border-[#1E6091] outline-none cursor-pointer"
          >
            <option value="all">كافة الأقسام</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown & Result Count */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold hidden sm:inline">
              الترتيب:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="newest">الأحدث أولاً</option>
              <option value="price_asc">السعر: الأقل أولاً</option>
              <option value="price_desc">السعر: الأعلى أولاً</option>
              <option value="stock_asc">المخزون: الأقل أولاً</option>
              <option value="stock_desc">المخزون: الأكثر أولاً</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            {filteredAndSortedProducts.length} نتيجة
          </span>
        </div>
      </div>

      {/* ── 5. Clean Products Table ── */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
        {paginatedProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Package size={36} className="mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">لا توجد منتجات تطابق هذه الفلاتر</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold">
                  <th className="py-3.5 px-5 text-start">المنتج وكود الموديل</th>
                  <th className="py-3.5 px-5 text-start">القسم</th>
                  <th className="py-3.5 px-5 text-start">السعر (ج.م)</th>
                  <th className="py-3.5 px-5 text-start">التشطيبات والمخزون</th>
                  <th className="py-3.5 px-5 text-start">الحالة</th>
                  <th className="py-3.5 px-5 text-end">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedProducts.map((product) => {
                  const variants = product.variants || [];
                  const totalStock = variants.reduce(
                    (sum, v) => sum + Number(v.stock_quantity || 0),
                    0
                  );
                  const firstImage =
                    variants[0]?.image_urls?.[0] || "/images/categories/faucet.jpg";

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Product Thumbnail & Title */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 relative overflow-hidden shrink-0 flex items-center justify-center">
                            {firstImage && !firstImage.startsWith("default") ? (
                              <Image
                                src={firstImage}
                                alt={product.title_ar}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <Package size={18} className="text-slate-400" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="font-bold text-slate-900 hover:text-[#1E6091] transition-colors block truncate max-w-xs sm:max-w-md"
                            >
                              {product.title_ar}
                            </Link>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[11px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                                SKU: {product.sku}
                              </span>
                              {product.brand && (
                                <span className="text-[11px] text-slate-400">
                                  {product.brand}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700">
                          {product.category?.name_ar || "عام"}
                        </span>
                      </td>

                      {/* Price in Alexandria Font */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 text-sm block">
                            {formatPrice(product.discount_price ?? product.base_price)}
                          </span>
                          {product.discount_price && (
                            <span className="text-[10px] text-slate-400 line-through block">
                              {formatPrice(product.base_price)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Finishes & Stock Quantity */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1">
                            {variants.slice(0, 5).map((v, i) => (
                              <span
                                key={i}
                                title={`${v.finish_name} (${v.stock_quantity} قطعة)`}
                                className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block shadow-2xs"
                                style={{ backgroundColor: v.hex_color || "#D4D4D8" }}
                              />
                            ))}
                            {variants.length > 5 && (
                              <span className="text-[10px] text-slate-400 font-bold">
                                +{variants.length - 5}
                              </span>
                            )}
                          </div>
                          <div>
                            {totalStock === 0 ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                نفد المخزون
                              </span>
                            ) : totalStock < 10 ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                مخزون منخفض ({totalStock} قطعة)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                متوفر ({totalStock} قطعة)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status Badges */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {product.is_active ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              نشط
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                              موقوف
                            </span>
                          )}
                          {product.is_featured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              مميز
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-end whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
                            title="عرض في المتجر"
                          >
                            <ExternalLink size={13} />
                          </Link>

                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-[#1E6091] text-slate-500 hover:text-white flex items-center justify-center transition-colors"
                            title="تعديل"
                          >
                            <Edit2 size={13} />
                          </Link>

                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleDelete(product.id)}
                            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-rose-600 text-slate-500 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── 6. Pagination Footer ── */}
        {filteredAndSortedProducts.length > ITEMS_PER_PAGE && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-medium">
              عرض {Math.min(filteredAndSortedProducts.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} إلى{" "}
              {Math.min(filteredAndSortedProducts.length, currentPage * ITEMS_PER_PAGE)} من أصل{" "}
              {filteredAndSortedProducts.length} منتج
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronRight size={14} />
                <span>السابق</span>
              </button>

              <span className="px-3 py-1.5 font-mono font-bold text-slate-700">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>التالي</span>
                <ChevronLeft size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
