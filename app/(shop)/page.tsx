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
import { DealsSection } from "@/components/home/deals-section";
import { ParallaxBanner } from "@/components/home/parallax-banner";
import { TopRatedProducts } from "@/components/home/top-rated-products";
import { ServicePillars } from "@/components/home/service-pillars";

// Fast dynamic server-side rendering with revalidation
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, popularProducts, topRatedProducts, dealProducts, siteSettings] =
    await Promise.all([
      getCategories(),
      getPopularProducts(16),
      getTopRatedProducts(8),
      getDealProducts(8),
      getSiteSettings(),
    ]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-28 font-alexandria">
      {/* 1. Dynamic Cinematic Hero Slider from CMS */}
      <HeroSlider slides={siteSettings.hero_slides} />

      {/* 2. Shop By 6 Core Flagship Categories with Real Imagery */}
      <CategoryShowcase categories={categories} />

      {/* 3. Popular Products Grid with Tabs (Best Sellers, Featured, New Arrivals) */}
      <PopularProducts products={popularProducts} />

      {/* 4. Deal Of The Week — with Red Countdown Timer */}
      <DealsSection products={dealProducts} />

      {/* 5. Cinematic Parallax Architectural Product Spotlight */}
      <ParallaxBanner />

      {/* 6. Top Rated Architectural Fixtures */}
      <TopRatedProducts products={topRatedProducts} />

      {/* 7. Highest Quality Service — 4 Detailed Pillars from CMS */}
      <ServicePillars pillars={siteSettings.service_pillars} />
    </div>
  );
}
