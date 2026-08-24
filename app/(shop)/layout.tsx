import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-context";
import { FavoritesProvider } from "@/components/favorites/favorites-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { MobileBottomBar } from "@/components/layout/mobile-bottom-bar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <FavoritesProvider>
        <div className="flex min-h-screen flex-col bg-surface-white text-text-primary pb-16 md:pb-0">
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <MobileBottomBar />
        </div>
      </FavoritesProvider>
    </CartProvider>
  );
}
