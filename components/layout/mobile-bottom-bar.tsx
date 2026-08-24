"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, LayoutGrid, Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { cn } from "@/lib/utils";

export function MobileBottomBar() {
  const pathname = usePathname();
  const { openDrawer, cartCount } = useCart();

  const navItems = [
    { label: "الرئيسية", href: "/", icon: Home },
    { label: "الأقسام", href: "/category/mixers-basins", icon: LayoutGrid },
    { label: "بحث", href: "/search", icon: Search },
    { label: "حسابي", href: "/account", icon: User },
  ];

  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-border-default shadow-lg pb-safe select-none font-alexandria"
      dir="rtl"
    >
      <nav className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-colors",
                isActive
                  ? "text-[#1E6091] font-bold"
                  : "text-text-secondary hover:text-brand-900"
              )}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[10px] font-bold leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Cart Item in Arabic */}
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
