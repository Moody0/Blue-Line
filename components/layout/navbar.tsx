"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, User, Heart } from "lucide-react";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { LiveSearchModal } from "./live-search-modal";
import { NAV_CATEGORIES } from "@/lib/constants";
import { useCart } from "@/components/cart/cart-context";
import { useFavorites } from "@/components/favorites/favorites-context";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface NavbarProps {
  cartItemCount?: number;
  onOpenCart?: () => void;
}

export function Navbar({ cartItemCount, onOpenCart }: NavbarProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const pathname = usePathname();

  // Access cart and favorites context
  const cart = useCart();
  const { favoritesCount } = useFavorites();
  const count = cartItemCount !== undefined ? cartItemCount : cart.cartCount;
  const handleOpenCart = onOpenCart || cart.openDrawer;

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const name =
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "حسابي";
          setCurrentUser({ name, email: user.email || "" });
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const name =
          session.user.user_metadata?.full_name ||
          session.user.email?.split("@")[0] ||
          "حسابي";
        setCurrentUser({ name, email: session.user.email || "" });
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-border-default transition-all select-none font-alexandria"
        dir="rtl"
      >
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* ── 1. Right side (in RTL): Brand Logo ── */}
            <div className="flex items-center shrink-0">
              <Logo />
            </div>

            {/* ── 2. Center: Clean Navigation Links Matching Reference ── */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-8 mx-auto">
              <Link
                href="/"
                className={cn(
                  "relative text-xs xl:text-sm font-bold transition-colors py-2 group",
                  pathname === "/"
                    ? "text-[#1E6091]"
                    : "text-text-secondary hover:text-brand-900"
                )}
              >
                <span>الرئيسية</span>
                <span
                  className={cn(
                    "absolute bottom-0 inset-x-0 h-0.5 bg-[#1E6091] transition-transform duration-300 ease-out",
                    pathname === "/"
                      ? "scale-x-100"
                      : "scale-x-0 origin-bottom-left group-hover:scale-x-100 group-hover:origin-bottom-right"
                  )}
                />
              </Link>

              {NAV_CATEGORIES.map((category) => {
                const isActive = pathname.startsWith(`/category/${category.slug}`);
                return (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className={cn(
                      "relative text-xs xl:text-sm font-bold transition-colors py-2 group",
                      isActive
                        ? "text-[#1E6091]"
                        : "text-text-secondary hover:text-brand-900"
                    )}
                  >
                    <span>{category.nameAr}</span>
                    <span
                      className={cn(
                        "absolute bottom-0 inset-x-0 h-0.5 bg-[#1E6091] transition-transform duration-300 ease-out",
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 origin-bottom-left group-hover:scale-x-100 group-hover:origin-bottom-right"
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* ── 3. Left side (in RTL): Utility Icons (Search, Account, Wishlist, Cart) ── */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Live Search Trigger Button */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-text-secondary hover:text-brand-900 hover:bg-surface-100 rounded-full transition-colors cursor-pointer"
                aria-label="بحث في المنتجات"
              >
                <Search size={20} />
              </button>

              {/* Customer Account Indicator */}
              {currentUser ? (
                <Link
                  href="/account"
                  className="flex items-center gap-2 py-1 px-2.5 sm:px-3 sm:py-1.5 rounded-full bg-surface-100 hover:bg-surface-200 text-brand-900 transition-all border border-border-default/70 group"
                  aria-label={`حساب ${currentUser.name}`}
                >
                  <div className="relative w-6 h-6 rounded-full bg-[#1E6091] text-white flex items-center justify-center text-[11px] font-black shrink-0">
                    {currentUser.name.charAt(0).toUpperCase()}
                    <span className="absolute -bottom-0.5 -start-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                  </div>
                  <span className="hidden md:inline-block font-bold text-xs text-brand-900 truncate max-w-[110px]">
                    {currentUser.name}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="p-2 text-text-secondary hover:text-brand-900 hover:bg-surface-100 rounded-full transition-colors hidden sm:inline-flex"
                  aria-label="تسجيل الدخول"
                >
                  <User size={20} />
                </Link>
              )}

              {/* Favorites Link with Live Count */}
              <Link
                href="/favorites"
                className="relative p-2 text-text-secondary hover:text-brand-900 hover:bg-surface-100 rounded-full transition-colors hidden sm:inline-flex"
                aria-label="المفضلة"
              >
                <Heart
                  size={20}
                  className={favoritesCount > 0 ? "text-red-500 fill-red-50" : ""}
                />
                {favoritesCount > 0 && (
                  <span className="absolute top-1 -end-0.5 min-w-4.5 h-4.5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {favoritesCount > 99 ? "+99" : favoritesCount}
                  </span>
                )}
              </Link>

              {/* Slide-over Cart Trigger with Live Badge */}
              <button
                type="button"
                onClick={handleOpenCart}
                className="relative p-2 text-brand-900 hover:bg-surface-100 rounded-full transition-colors flex items-center justify-center cursor-pointer"
                aria-label="سلة المشتريات"
              >
                <ShoppingBag size={20} />
                <span className="absolute top-1 -end-0.5 min-w-4.5 h-4.5 px-1 bg-[#1E6091] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {count > 99 ? "+99" : count}
                </span>
              </button>

              {/* Mobile Menu Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="lg:hidden p-2 text-brand-900 hover:bg-surface-100 rounded-full transition-colors cursor-pointer"
                aria-label="فتح القائمة الرئيسية"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Live Instant Search Modal ── */}
      <LiveSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* ── Mobile Navigation Drawer ── */}
      <MobileNav
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        currentUser={currentUser}
      />
    </>
  );
}
