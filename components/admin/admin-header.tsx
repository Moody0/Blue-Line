"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Globe } from "lucide-react";

export function AdminHeader() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/admin") return "نظرة عامة ومؤشرات الأداء";
    if (pathname.startsWith("/admin/products/new")) return "إضافة منتج جديد";
    if (pathname.startsWith("/admin/products")) return "إدارة كتالوج المنتجات";
    if (pathname.startsWith("/admin/categories")) return "إدارة الفئات والأقسام";
    if (pathname.startsWith("/admin/content")) return "إدارة المحتوى والصفحات (CMS)";
    if (pathname.startsWith("/admin/coupons")) return "كوبونات وقسائم الخصم";
    if (pathname.startsWith("/admin/customers")) return "دليل العملاء وعلاقات المشترين (CRM)";
    if (pathname.startsWith("/admin/orders")) return "إدارة الطلبات والمبيعات";
    if (pathname.startsWith("/admin/settings")) return "إعدادات المتجر والمنظومة";
    return "لوحة التحكم والإدارة";
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 font-alexandria select-none">
      {/* Current Page Title */}
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-extrabold text-slate-800">
          {getPageTitle()}
        </h2>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
        >
          <ExternalLink size={13} className="text-slate-500" />
          <span>زيارة المتجر للعملاء</span>
        </Link>
      </div>
    </header>
  );
}
