"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, LayoutGrid, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { cn } from "@/lib/utils";

export function MobileBottomBar() {
  const pathname = usePathname();
  const { openDrawer, cartCount } = useCart();

  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-border-default shadow-lg pb-safe select-none font-alexandria"
      dir="rtl"
    >
      <nav className="flex items-center justify-around h-16 px-2">
        {/* 1. Home */}
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-colors",
            pathname === "/"
              ? "text-[#1E6091] font-bold"
              : "text-text-secondary hover:text-brand-900"
          )}
        >
          <Home size={18} strokeWidth={pathname === "/" ? 2.2 : 1.8} />
          <span className="text-[10px] font-bold leading-none">الرئيسية</span>
        </Link>

        {/* 2. All Products */}
        <Link
          href="/products"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-colors",
            pathname.startsWith("/products") || pathname.startsWith("/category")
              ? "text-[#1E6091] font-bold"
              : "text-text-secondary hover:text-brand-900"
          )}
        >
          <LayoutGrid
            size={18}
            strokeWidth={
              pathname.startsWith("/products") || pathname.startsWith("/category")
                ? 2.2
                : 1.8
            }
          />
          <span className="text-[10px] font-bold leading-none">كل المنتجات</span>
        </Link>

        {/* 3. Account */}
        <Link
          href="/account"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-colors",
            pathname.startsWith("/account")
              ? "text-[#1E6091] font-bold"
              : "text-text-secondary hover:text-brand-900"
          )}
        >
          <User size={18} strokeWidth={pathname.startsWith("/account") ? 2.2 : 1.8} />
          <span className="text-[10px] font-bold leading-none">حسابي</span>
        </Link>

        {/* 4. Cart */}
        <button
          type="button"
          onClick={openDrawer}
          className="flex flex-col items-center justify-center flex-1 py-1 gap-1 text-text-secondary hover:text-brand-900 transition-colors relative cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag size={18} strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -end-2 min-w-4 h-4 px-1 bg-[#1E6091] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold leading-none">السلة</span>
        </button>
      </nav>
    </div>
  );
}
