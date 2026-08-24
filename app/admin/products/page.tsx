import type { Metadata } from "next";
import { getAdminProducts } from "@/actions/admin";
import { ProductsDataTable } from "@/components/admin/products-data-table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "إدارة المنتجات والتشطيبات | Blue Line Admin",
  description: "عرض وتعديل كتالوج الأدوات الصحية وإدارة تشكيلات ومخزون PVD.",
};

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return <ProductsDataTable products={products} />;
}
