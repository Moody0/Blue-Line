import type { Metadata } from "next";
import { getCategories } from "@/actions/catalog";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "إضافة منتج جديد | Blue Line Admin",
  description: "إضافة منتج معماري جديد مع تشكيلات الألوان والأسعار.",
};

export default async function NewProductPage() {
  const categories = await getCategories();

  return <ProductForm categories={categories} />;
}
