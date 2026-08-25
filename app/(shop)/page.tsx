import {
  getCategories,
  getPopularProducts,
  getFeaturedProducts,
  getNewArrivalProducts,
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
  const [
    categories,
    bestsellerProducts,
    featuredProducts,
    newArrivalProducts,
    topRatedProducts,
    dealProducts,
    siteSettings,
  ] = await Promise.all([
    getCategories(),
    getPopularProducts(8),
    getFeaturedProducts(8),
    getNewArrivalProducts(8),
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

      {/* 3. Popular Products Grid with Dynamic Tabs (Best Sellers, Featured, New Arrivals) */}
      <PopularProducts
        bestsellerProducts={bestsellerProducts}
        featuredProducts={featuredProducts}
        newArrivalProducts={newArrivalProducts}
      />

      {/* 4. Cinematic Parallax Architectural Product Spotlight */}
      <ParallaxBanner />

      {/* 5. Top Rated Architectural Fixtures */}
      <TopRatedProducts products={topRatedProducts} />

      {/* 6. Deal Of The Week — Configurable from CMS with Red Countdown Timer */}
      <DealsSection
        products={dealProducts}
        dealsSettings={siteSettings.deals_section}
      />

      {/* 7. Highest Quality Service — 4 Detailed Pillars (Horizontal Carousel on Mobile) */}
      <ServicePillars pillars={siteSettings.service_pillars} />
    </div>
  );
}
