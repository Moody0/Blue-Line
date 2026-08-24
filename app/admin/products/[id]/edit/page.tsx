import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories } from "@/actions/catalog";
import { getAdminProductById } from "@/actions/admin";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) {
    return { title: "المنتج غير موجود | Blue Line Admin" };
  }

  return {
    title: `تعديل: ${product.title_ar} | Blue Line Admin`,
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductForm product={product} categories={categories} />;
}
