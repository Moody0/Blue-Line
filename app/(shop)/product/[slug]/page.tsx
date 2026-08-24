import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProductBySlug, getProductsByCategory } from "@/actions/catalog";
import { ProductDetailView } from "@/components/products/product-detail-view";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "المنتج غير موجود | Blue Line",
    };
  }

  return {
    title: `${product.title_en} — ${product.title_ar} | Blue Line`,
    description: product.description_ar || product.description_en,
    openGraph: {
      title: `${product.title_en} | Blue Line`,
      description: product.description_ar || product.description_en,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const categoryResult = await getProductsByCategory(product.category?.slug || "mixers-kitchens");
  const relatedProducts = categoryResult.products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="pb-28 sm:pb-20 pt-3 sm:pt-6">
      {/* Main Container */}
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Sleek Minimal Inline Breadcrumb */}
        <nav
          aria-label="مسار التصفح"
          className="flex items-center gap-2 text-xs text-text-muted font-alexandria overflow-x-auto no-scrollbar py-1"
        >
          <Link
            href="/"
            className="hover:text-brand-900 transition-colors shrink-0"
          >
            الرئيسية
          </Link>
          <span className="text-border-strong text-[10px]">/</span>
          {product.category && (
            <>
              <Link
                href={`/category/${product.category.slug}`}
                className="hover:text-brand-900 transition-colors shrink-0"
              >
                {product.category.name_ar}
              </Link>
              <span className="text-border-strong text-[10px]">/</span>
            </>
          )}
          <span className="text-brand-900 font-semibold truncate max-w-sm sm:max-w-md">
            {product.title_ar}
          </span>
        </nav>

        <ProductDetailView product={product} relatedProducts={relatedProducts} />
      </div>
    </div>
  );
}
