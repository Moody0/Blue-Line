import type { Metadata } from "next";
import Link from "next/link";
import { FavoritesView } from "@/components/favorites/favorites-view";

export const metadata: Metadata = {
  title: "المفضلة | بلو لاين — لأدوات السباكة",
  description: "راجع المنتجات والتصميمات التي قمت بحفظها في قائمة مفضلتك من بلو لاين.",
};

export default function FavoritesPage() {
  return (
    <div className="min-h-[70vh] py-8 sm:py-12 font-alexandria" dir="rtl">
      {/* Main 1480px Container aligned flush with Navbar and Footer */}
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="مسار التصفح" className="flex items-center gap-2 text-xs text-text-muted">
          <Link href="/" className="hover:text-brand-900 transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-brand-900 font-bold">المفضلة</span>
        </nav>

        {/* Favorites Content View */}
        <FavoritesView />
      </div>
    </div>
  );
}
