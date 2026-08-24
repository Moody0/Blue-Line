import { ProductCard } from "./product-card";
import type { Product } from "@/types/ecommerce";
import { PackageOpen } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ProductGrid({
  products,
  title,
  subtitle,
  className,
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl bg-surface-50 border border-border-default space-y-4">
        <div className="w-16 h-16 rounded-full bg-surface-200/50 flex items-center justify-center text-text-muted">
          <PackageOpen size={32} />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-bold text-text-primary">
            لا توجد منتجات مطابقة حالياً
          </h3>
          <p className="text-xs text-text-muted">
            يرجى تجربة تغيير معايير البحث أو تصفية الفئات للاطلاع على المنتجات المتوفرة.
          </p>
        </div>
        <Link
          href="/category/faucets"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-2")}
        >
          عرض جميع التشكيلات
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(title || subtitle) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-900 tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-text-secondary">{subtitle}</p>
          )}
        </div>
      )}

      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
          className
        )}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
