import type { Metadata } from "next";
import { FullCartView } from "@/components/cart/full-cart-view";

export const metadata: Metadata = {
  title: "سلة المشتريات | Blue Line — الأدوات الصحية الفاخرة",
  description: "راجع المنتجات المختارة في سلة مشترياتك وتابع خطوات إتمام الطلب.",
};

export default function CartPage() {
  return (
    <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <FullCartView />
    </div>
  );
}
