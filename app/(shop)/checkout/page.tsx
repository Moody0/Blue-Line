import type { Metadata } from "next";
import { CheckoutView } from "@/components/cart/checkout-view";

export const metadata: Metadata = {
  title: "إتمام الطلب والدفع | Blue Line — الأدوات الصحية الفاخرة",
  description: "أدخل عنوان الشحن والتوصيل واختر طريقة الدفع لإتمام طلب منتجات بلو لاين.",
};

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <CheckoutView />
    </div>
  );
}
