"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Settings,
  PlusCircle,
  LogOut,
  Tag,
  Users,
  Sliders,
  FileText,
} from "lucide-react";
import { signOut } from "@/actions/auth";
import { cn } from "@/lib/utils";

interface NavGroup {
  groupNameAr: string;
  items: {
    title: string;
    href: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    exact?: boolean;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupNameAr: "نظرة عامة",
    items: [
      {
        title: "لوحة المؤشرات",
        href: "/admin",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    groupNameAr: "إدارة الكتالوج والمحتوى",
    items: [
      {
        title: "المنتجات",
        href: "/admin/products",
        icon: Package,
        exact: true,
      },
      {
        title: "الفئات والأقسام",
        href: "/admin/categories",
        icon: Layers,
        exact: false,
      },
      {
        title: "إضافة منتج",
        href: "/admin/products/new",
        icon: PlusCircle,
        exact: true,
      },
      {
        title: "المحتوى والصفحات (CMS)",
        href: "/admin/content",
        icon: Sliders,
        exact: false,
      },
    ],
  },
  {
    groupNameAr: "المبيعات والعملاء",
    items: [
      {
        title: "الطلبات الواردة",
        href: "/admin/orders",
        icon: ShoppingBag,
        exact: false,
      },
      {
        title: "كوبونات الخصم",
        href: "/admin/coupons",
        icon: Tag,
        exact: false,
      },
      {
        title: "دليل العملاء",
        href: "/admin/customers",
        icon: Users,
        exact: false,
      },
    ],
  },
  {
    groupNameAr: "المتجر والنظام",
    items: [
      {
        title: "إعدادات المتجر",
        href: "/admin/settings",
        icon: Settings,
        exact: false,
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white border-l border-slate-200/80 flex flex-col shrink-0 z-30 font-alexandria select-none">
      {/* Sidebar Top Brand Header */}
      <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B192C] text-white flex items-center justify-center font-black text-sm shadow-xs">
            BL
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 leading-tight">
              بلو لاين
            </h1>
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">
              ADMIN PORTAL
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Groups (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {NAV_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            <h2 className="text-[11px] font-extrabold text-slate-400 px-3 tracking-wider uppercase">
              {group.groupNameAr}
            </h2>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all",
                      isActive
                        ? "bg-[#0B192C] text-white shadow-xs font-extrabold"
                        : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/80"
                    )}
                  >
                    <Icon
                      size={17}
                      className={cn(
                        "shrink-0 transition-colors",
                        isActive ? "text-white" : "text-slate-400"
                      )}
                    />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer: Super Admin User Profile & Sign Out */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              A
            </div>
            <div className="truncate">
              <span className="text-xs font-extrabold text-slate-900 block truncate">
                مدير النظام
              </span>
              <span className="text-[10px] font-bold text-emerald-600 font-mono block tracking-wider uppercase">
                SUPER ADMIN
              </span>
            </div>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut size={14} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
