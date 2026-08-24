import {
  getCategories,
  getPopularProducts,
  getTopRatedProducts,
  getDealProducts,
} from "@/actions/catalog";
import { getSiteSettings } from "@/actions/settings";
import { HeroSlider } from "@/components/home/hero-slider";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { PopularProducts } from "@/components/home/popular-products";
import { TopRatedProducts } from "@/components/home/top-rated-products";
import { ServicePillars } from "@/components/home/service-pillars";
import { DealsSection } from "@/components/home/deals-section";

// Fast dynamic server-side rendering with revalidation
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, popularProducts, topRatedProducts, dealProducts, siteSettings] =
    await Promise.all([
      getCategories(),
      getPopularProducts(8),
      getTopRatedProducts(8),
      getDealProducts(8),
      getSiteSettings(),
    ]);

  return (
    <div className="space-y-24 pb-28">
      {/* 1. Dynamic Cinematic Hero Slider from CMS */}
      <HeroSlider slides={siteSettings.hero_slides} />

      {/* 2. Shop By Categories — Dynamic Categories Grid from Backend */}
      <CategoryShowcase categories={categories} />

      {/* 3. Popular Products Grid with Tabs */}
      <PopularProducts products={popularProducts} />

      {/* 4. Top Rated Products Grid (No Filter Tabs + Centered Action) */}
      <TopRatedProducts products={topRatedProducts} />

      {/* 5. Highest Quality Service — 4 Round Pillars from CMS */}
      <ServicePillars pillars={siteSettings.service_pillars} />

      {/* 6. Deal Of The Week — with Red Countdown Timer */}
      <DealsSection products={dealProducts} />
    </div>
  );
}
