import { searchCatalog } from "@/actions/catalog";
import { ProductGrid } from "@/components/products/product-grid";
import { Search } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const products = query ? await searchCatalog(query) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="p-8 rounded-3xl bg-surface-50 border border-border-default space-y-2">
        <div className="flex items-center gap-2 text-accent-600 text-xs font-bold uppercase tracking-wider">
          <Search size={14} />
          <span>نتائج البحث</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-900">
          {query ? `البحث عن: "${query}"` : "البحث في تشكيلات المنتجات"}
        </h1>
        <p className="text-xs text-text-muted">
          تم العثور على {products.length} منتج يطابق معايير البحث
        </p>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
