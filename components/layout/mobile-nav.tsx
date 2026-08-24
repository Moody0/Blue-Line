"use client";

import Link from "next/link";
import { Phone, ShieldCheck, ChevronLeft, X, MessageCircle, User, LogOut, Truck } from "lucide-react";
import { NAV_CATEGORIES, BRAND, CURRENCY, CONTACT } from "@/lib/constants";
import type { Category } from "@/types/ecommerce";
import { signOut } from "@/actions/auth";
import { Logo } from "./logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser?: { name: string; email: string } | null;
  categories?: Category[];
}

export function MobileNav({ open, onOpenChange, currentUser, categories }: MobileNavProps) {
  const allCategories =
    categories && categories.length > 0
      ? categories
      : NAV_CATEGORIES.map((c, i) => ({
          id: `cat-${i}`,
          name_ar: c.nameAr,
          name_en: c.nameEn,
          slug: c.slug,
        }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[85vw] max-w-sm bg-white p-0 flex flex-col justify-between font-alexandria select-none"
        dir="rtl"
      >
        <div>
          {/* Header with Logo on Right and Close Button on Left */}
          <SheetHeader className="p-5 border-b border-border-default flex flex-row items-center justify-between">
            <SheetTitle className="text-start">
              <Logo />
            </SheetTitle>

            {/* Clean Close Button positioned on the Left in RTL */}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="إغلاق القائمة"
              className="w-9 h-9 rounded-full bg-surface-100 hover:bg-surface-200 text-text-secondary hover:text-brand-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </SheetHeader>

          {/* Navigation Category Links (100% Arabic) */}
          <nav className="p-4 space-y-4">
            <div>
              <p className="text-xs font-extrabold text-brand-900 px-3 mb-2 tracking-wider flex items-center justify-between">
                <span>أقسام المنتجات</span>
                <span className="text-[10px] text-slate-400 font-bold">({allCategories.length})</span>
              </p>
              <ul className="space-y-0.5 max-h-[44vh] overflow-y-auto pl-1 overscroll-contain">
                <li>
                  <Link
                    href="/products"
                    onClick={() => onOpenChange(false)}
                    className="flex items-center justify-between py-2 px-3.5 rounded-xl bg-surface-50 text-[#1E6091] font-bold text-xs transition-colors group mb-1"
                  >
                    <span>جميع المنتجات والتشكيلات</span>
                    <ChevronLeft
                      size={15}
                      className="text-[#1E6091] transition-transform group-hover:-translate-x-1"
                    />
                  </Link>
                </li>
                {allCategories.map((cat, idx) => (
                  <li key={cat.id || `${cat.slug}-${idx}`}>
                    <Link
                      href={`/category/${cat.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center justify-between py-2 px-3.5 rounded-xl text-text-secondary hover:text-brand-900 hover:bg-surface-50 font-bold text-xs transition-colors group"
                    >
                      <span className="group-hover:text-brand-900 truncate">
                        {cat.name_ar}
                      </span>
                      <ChevronLeft
                        size={15}
                        className="text-text-muted group-hover:text-accent-600 transition-transform group-hover:-translate-x-1 shrink-0"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border-default pt-3">
              <p className="text-xs font-extrabold text-brand-900 px-3 mb-2 tracking-wider">
                خدمات وضمانات بلو لاين
              </p>
              <div className="space-y-1">
                <Link
                  href="/warranty"
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl text-text-secondary hover:text-brand-900 hover:bg-surface-50 text-xs font-semibold transition-colors"
                >
                  <ShieldCheck size={16} className="text-[#1E6091]" />
                  <span>قوانين وسياسة الضمان</span>
                </Link>
                <Link
                  href="/track-order"
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl text-text-secondary hover:text-brand-900 hover:bg-surface-50 text-xs font-semibold transition-colors"
                >
                  <Truck size={16} className="text-[#1E6091]" />
                  <span>تتبع حالة الشحنة والطلب</span>
                </Link>
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl text-text-secondary hover:text-brand-900 hover:bg-surface-50 text-xs font-semibold transition-colors"
                >
                  <MessageCircle size={16} className="text-emerald-600" />
                  <span className="inline-flex items-center gap-1">
                    <span>استشارة عبر واتساب</span>
                    <span dir="ltr" className="font-mono">({CONTACT.phoneDisplay})</span>
                  </span>
                </a>
              </div>
            </div>
          </nav>
        </div>

        {/* Footer / Account section */}
        <div className="p-5 bg-surface-50 border-t border-border-default space-y-3">
          {currentUser ? (
            <div className="space-y-2">
              <Link
                href="/account"
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-border-default hover:border-[#1E6091] transition-all shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1E6091] text-white flex items-center justify-center text-xs font-black">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-start">
                    <span className="text-xs font-bold text-brand-900 block">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-text-muted">عرض تفاصيل الحساب</span>
                  </div>
                </div>
                <ChevronLeft size={16} className="text-text-muted" />
              </Link>

              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>تسجيل الخروج</span>
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-brand-900 hover:bg-[#1E6091] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <User size={16} />
              <span>تسجيل الدخول / إنشاء حساب</span>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
