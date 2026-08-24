import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-context";
import { FavoritesProvider } from "@/components/favorites/favorites-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { MobileBottomBar } from "@/components/layout/mobile-bottom-bar";
import { ScrollToTop } from "@/components/layout/scroll-to-top";

import { getSiteSettings } from "@/actions/settings";
import { getCategories } from "@/actions/catalog";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategories(),
  ]);

  return (
    <CartProvider>
      <FavoritesProvider>
        <div className="flex min-h-screen flex-col bg-surface-white text-text-primary pb-16 md:pb-0">
          <AnnouncementBar />
          <Navbar navLinks={settings.nav_links} categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <MobileBottomBar />
          <ScrollToTop />
        </div>
      </FavoritesProvider>
    </CartProvider>
  );
}
