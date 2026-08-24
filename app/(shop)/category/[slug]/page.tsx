import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductsByCategory, getCategories } from "@/actions/catalog";
import { CategoryCatalogView } from "@/components/products/category-catalog-view";
import { CategoryHero } from "@/components/products/category-hero";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const decodedSlug = decodeURIComponent(slug);
  const category = categories.find((c) => c.slug === slug || c.slug === decodedSlug);

  if (!category) {
    return {
      title: "القسم غير موجود | Blue Line",
    };
  }

  return {
    title: `${category.name_ar} — ${category.name_en} | Blue Line`,
    description: `استكشف تشكيلة ${category.name_ar} من بلو لاين بحلول هندسية ألمانية وتشطيبات راقية.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const [categories, categoryResult] = await Promise.all([
    getCategories(),
    getProductsByCategory(decodedSlug),
  ]);

  if (!categoryResult.category) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-20 font-alexandria">
      {/* 1. Full-Width Cinematic Category Hero Banner */}
      <CategoryHero
        category={categoryResult.category}
        productCount={categoryResult.products.length}
      />

      {/* 2. Main Content Container */}
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        <CategoryCatalogView
          category={categoryResult.category}
          categories={categories}
          initialProducts={categoryResult.products}
        />
      </div>
    </div>
  );
}
