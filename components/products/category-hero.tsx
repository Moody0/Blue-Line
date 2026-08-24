import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/ecommerce";

interface CategoryHeroProps {
  category: Category | null;
  productCount?: number;
}

export function CategoryHero({ category, productCount }: CategoryHeroProps) {
  const titleAr = category?.name_ar || "خلاطات وأدوات صحية";
  const bgImage = category?.image_url || "/images/promo/faucet-banner.jpg";

  return (
    <div
      className="relative w-full h-36 sm:h-48 md:h-52 overflow-hidden flex items-center justify-center text-center font-alexandria select-none"
      dir="rtl"
    >
      {/* Background Image */}
      <Image
        src={bgImage}
        alt={titleAr}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80" />

      {/* Centered Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-2">
        {/* Breadcrumbs */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-white/80 font-medium">
          <Link
            href="/"
            className="hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            الرئيسية
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-white font-bold">{titleAr}</span>
        </div>

        {/* Category Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
          {titleAr}
        </h1>

        {/* Product Count Badge */}
        {productCount !== undefined && (
          <p className="text-xs sm:text-sm text-surface-200/90 font-medium pt-0.5 text-center">
            {productCount} منتج متوفر بجودة معتمدة
          </p>
        )}
      </div>
    </div>
  );
}
