"use client";

import Link from "next/link";

interface ParallaxBannerProps {
  imageSrc?: string;
  tagline?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function ParallaxBanner({
  imageSrc = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=2000&q=85",
  tagline = "هندسة ألمانية فائقة • GERMAN PRECISION",
  title = "خلاطات وأنظمة دش شلالية بتصميم معماري فاخر",
  subtitle = "تدفق مائي انسيابي وتقنية توفير ذكي للمياه مع طلاء PVD المقاوم للخدش والتكلسات",
  ctaText = "تسوق التشكيلة الآن",
  ctaHref = "/products",
}: ParallaxBannerProps) {
  return (
    <section className="relative w-full my-8 font-alexandria overflow-hidden" dir="rtl">
      {/* Parallax Container with fixed background attachment */}
      <div
        className="relative w-full min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] bg-fixed bg-center bg-cover flex items-center justify-center text-center select-none"
        style={{ backgroundImage: `url(${imageSrc})` }}
      >
        {/* Deep Moody Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-black/65 backdrop-brightness-75" />

        {/* Content Box */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-white space-y-4 sm:space-y-5">
          {/* Eyebrow Tagline */}
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-white/85 uppercase">
            {tagline}
          </p>

          {/* Main Headline */}
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold leading-snug tracking-tight drop-shadow-md max-w-3xl mx-auto">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm lg:text-base text-white/80 max-w-2xl mx-auto font-normal leading-relaxed">
            {subtitle}
          </p>

          {/* Shop Now CTA Button */}
          <div className="pt-3 sm:pt-4">
            <Link
              href={ctaHref}
              className="inline-block bg-white text-black hover:bg-neutral-100 font-bold px-10 py-3.5 rounded-none text-xs sm:text-sm tracking-wider uppercase transition-colors shadow-lg hover:shadow-xl"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
