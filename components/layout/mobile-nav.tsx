"use client";

import Link from "next/link";
import { Phone, ShieldCheck, ChevronLeft, X, MessageCircle, User, LogOut, Truck } from "lucide-react";
import { NAV_CATEGORIES, BRAND, CURRENCY, CONTACT } from "@/lib/constants";
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
}

export function MobileNav({ open, onOpenChange, currentUser }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
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
              <p className="text-xs font-extrabold text-brand-900 px-3 mb-2 tracking-wider">
                أقسام المنتجات
              </p>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/products"
                    onClick={() => onOpenChange(false)}
                    className="flex items-center justify-between py-3 px-3.5 rounded-xl bg-surface-50 text-[#1E6091] font-bold text-xs transition-colors group"
                  >
                    <span>جميع المنتجات والتشكيلات</span>
                    <ChevronLeft
                      size={16}
                      className="text-[#1E6091] transition-transform group-hover:-translate-x-1"
                    />
                  </Link>
                </li>
                {NAV_CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/category/${cat.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center justify-between py-3 px-3.5 rounded-xl text-text-secondary hover:text-brand-900 hover:bg-surface-50 font-bold text-xs transition-colors group"
                    >
                      <span className="group-hover:text-brand-900">
                        {cat.nameAr}
                      </span>
                      <ChevronLeft
                        size={16}
                        className="text-text-muted group-hover:text-accent-600 transition-transform group-hover:-translate-x-1"
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
                  <span>شهادة الضمان المعتمد والصيانة</span>
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
          <div className="flex items-center justify-between text-xs text-text-muted font-medium">
            <span>العملة: {CURRENCY.symbol} (الجنيه المصري)</span>
            <span>القاهرة، مصر</span>
          </div>

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
            </div>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-brand-900 hover:bg-[#1E6091] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <User size={15} />
              <span>تسجيل الدخول / إنشاء حساب</span>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
