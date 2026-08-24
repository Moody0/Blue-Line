import type { Metadata } from "next";
import { getAllProducts, getCategories } from "@/actions/catalog";
import { CategoryCatalogView } from "@/components/products/category-catalog-view";
import { CategoryHero } from "@/components/products/category-hero";

export const metadata: Metadata = {
  title: "جميع المنتجات والتشكيلات | Blue Line لأدوات السباكة",
  description:
    "استكشف كافة تشكيلات خلاطات المياه وأنظمة الدش والأدوات الصحية ومستلزمات السباكة لدى متجر بلو لاين في مصر.",
};

export default async function AllProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getAllProducts(),
  ]);

  const allProductsCategory = {
    id: "all",
    name_ar: "جميع المنتجات والتشكيلات",
    name_en: "All Products & Collections",
    slug: "products",
    description_ar: "تشكيلات متكاملة من خلاطات المياه وأنظمة الدش ومستلزمات السباكة الفاخرة",
    description_en: "Complete sanitary ware, water solutions and plumbing fixtures",
    image_url: "/images/promo/faucet-banner.jpg",
    parent_id: null,
    sort_order: 0,
    created_at: new Date().toISOString(),
  };

  return (
    <div className="space-y-8 pb-20 font-alexandria select-none" dir="rtl">
      {/* 1. Full-Width Cinematic Hero Banner */}
      <CategoryHero
        category={allProductsCategory}
        productCount={products.length}
      />

      {/* 2. Main Content Container aligned 1480px */}
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        <CategoryCatalogView
          category={allProductsCategory}
          categories={categories}
          initialProducts={products}
        />
      </div>
    </div>
  );
}
