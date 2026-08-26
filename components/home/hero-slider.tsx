"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/types/ecommerce";

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 1,
    tagline: "هندسة ألمانية فائقة • جودة متكاملة",
    title: "حمامات عصرية متكاملة بتصميم وتجهيزات ألمانية فاخرة",
    ctaText: "تسوق الآن",
    ctaHref: "/category/mixers-basins",
    imageSrc:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: 2,
    tagline: "أنظمة الدش والشاور الفندقية",
    title: "أنظمة دش مطري مخفية بتصميم فندقي وأداء فائق",
    ctaText: "تسوق الآن",
    ctaHref: "/category/shower-bury",
    imageSrc:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: 3,
    tagline: "خلاطات مياه فاخرة بتقنية PVD",
    title: "خلاطات مياه معمارية لحمام عصري متميز",
    ctaText: "تسوق الآن",
    ctaHref: "/category/bathtub-mixers",
    imageSrc:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=85",
  },
];

interface HeroSliderProps {
  slides?: HeroSlide[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const currentSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch Swipe State
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 45;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % currentSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? currentSlides.length - 1 : prev - 1));
  };

  // Auto rotation: auto rotate every 7 seconds when not paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, currentSlides.length]);

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Advance to next slide
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Go to previous slide
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const slide = currentSlides[currentSlide] || currentSlides[0];

  return (
    <section
      className="group relative w-full overflow-hidden bg-neutral-900 text-white min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center justify-center select-none touch-pan-y"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="بانر العرض الرئيسي"
    >
      {/* Background Image Slides with Smooth Fade */}
      {currentSlides.map((s, idx) => (
        <div
          key={s.id || idx}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            currentSlide === idx ? "opacity-100 z-0" : "opacity-0 pointer-events-none"
          )}
        >
          {s.imageSrc && (
            <Image
              src={s.imageSrc}
              alt={s.title}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
          {/* Subtle Dark Moody Vignette Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-brightness-[0.85]" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-5 sm:space-y-6">
        {/* Top Tagline */}
        {slide?.tagline && (
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-white/90 uppercase">
            {slide.tagline}
          </p>
        )}

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight sm:leading-[1.15] max-w-3xl mx-auto drop-shadow-sm">
          {slide?.title}
        </h1>

        {/* SHOP NOW Button */}
        {slide?.ctaText && (
          <div className="pt-2 sm:pt-4">
            <Link
              href={slide.ctaHref || "/products"}
              className="inline-block bg-white text-black hover:bg-neutral-100 font-bold px-10 py-3.5 text-xs sm:text-sm tracking-wider uppercase transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              {slide.ctaText}
            </Link>
          </div>
        )}
      </div>

      {/* Left Arrow Button */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="السابق"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-black shadow-lg flex items-center justify-center transition-colors duration-300 hover:bg-neutral-100 z-20 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto cursor-pointer"
      >
        <ArrowLeft size={18} strokeWidth={2} />
      </button>

      {/* Right Arrow Button */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="التالي"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-black shadow-lg flex items-center justify-center transition-colors duration-300 hover:bg-neutral-100 z-20 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto cursor-pointer"
      >
        <ArrowRight size={18} strokeWidth={2} />
      </button>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {currentSlides.map((s, idx) => (
          <button
            key={s.id || idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`شريحة ${idx + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300 cursor-pointer",
              currentSlide === idx
                ? "w-8 bg-white shadow-xs"
                : "w-2 bg-white/50 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </section>
  );
}
